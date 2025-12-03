import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Our Fleet", href: "/fleets" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Company Info with Logo */}
          <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* <LazyLoadImage className="w-12 h-10 sm:w-14 sm:h-14 md:w-16 md:h-14 transform group-hover:scale-110 transition-transform" src={Logo} /> */}
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                  JETSET <span className="text-red-600">RENTALS</span>
                </span>
              </div>
            </Link>

            {/* Contact Info - Responsive Stack */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 mt-2">
              <div className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <span className="text-sm text-center sm:text-left font-medium">Hor Al Anz Building 101, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <a href="tel:+971545613397" className="text-sm hover:text-red-400 transition-colors font-medium">
                  +971 54561 3397
                </a>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <a href="mailto:info@luxurycars.ae" className="text-sm hover:text-red-400 transition-colors break-all sm:break-normal font-medium">
                  info@luxurycars.ae
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold hover:text-red-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20" style={{ borderImage: 'linear-gradient(to right, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.2), rgba(220, 38, 38, 0.2)) 1' }}>
          <p className="text-center text-sm text-gray-400 font-medium">
            © 2025{' '}

            <a href="https://www.luxurycarsrental.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 font-bold transition-colors"
            >
              LuxuryCarsRental.ae
            </a>{' '}
            is a trading style of Jetset Worldwide Travel & Tourism. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}