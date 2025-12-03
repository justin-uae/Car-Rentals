import { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
}

interface ScopedSandParticlesProps {
    density?: number;
    className?: string;
}

/**
 * Scoped Sand Particles Component
 * Only appears within the parent container
 * Perfect for using in a single component like HomepageBanner
 */
export default function ScopedSandParticles({
    density = 40,
    className = ''
}: ScopedSandParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(2);
    const [isInView, setIsInView] = useState(false);

    const sandColors = [
        '#f59e0b',
        '#f97316',
        '#d97706',
        '#fbbf24',
        '#fb923c',
    ];

    // Check if component is in viewport
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    // Initialize particles
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const createParticle = (): Particle => {
            const rect = container.getBoundingClientRect();
            return {
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                size: Math.random() * 5 + 2,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() * 0.4 + 0.2),
                opacity: Math.random() * 0.4 + 0.2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                color: sandColors[Math.floor(Math.random() * sandColors.length)]
            };
        };

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < density; i++) {
                particlesRef.current.push(createParticle());
            }
        };

        const updateCanvasSize = () => {
            if (canvas && container) {
                const rect = container.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
                initParticles();
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [density]);

    // Animation loop
    useEffect(() => {
        if (!isInView) return; // Only animate when in view

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle, index) => {
                // Movement
                particle.y += particle.speedY;
                particle.x += particle.speedX;
                particle.rotation += particle.rotationSpeed;

                // Natural drift
                particle.x += Math.sin(Date.now() * 0.0008 + index) * 0.15;

                // Reset particle if it goes off screen
                if (particle.y > canvas.height + 20) {
                    particle.y = -20;
                    particle.x = Math.random() * canvas.width;
                }
                if (particle.x > canvas.width + 20) {
                    particle.x = -20;
                } else if (particle.x < -20) {
                    particle.x = canvas.width + 20;
                }

                // Draw particle
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate((particle.rotation * Math.PI) / 180);
                ctx.globalAlpha = particle.opacity;

                ctx.fillStyle = particle.color;
                ctx.beginPath();
                
                const sides = 4 + Math.floor(Math.random() * 3);
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * Math.PI * 2;
                    const radius = particle.size * (0.7 + Math.random() * 0.6);
                    const px = Math.cos(angle) * radius;
                    const py = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInView]);

    return (
        <div 
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ 
                    mixBlendMode: 'multiply',
                    opacity: 0.6
                }}
            />
        </div>
    );
}