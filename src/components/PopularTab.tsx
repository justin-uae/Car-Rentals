import { useEffect, useRef, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchAllExcursions } from '../slices/productsSlice';
import { PopularToursSkeletonLoader } from './Skeletons/PopularToursSkeletonLoader';
import { useCurrency } from '../hooks/useCurrency';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function PopularTours() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { formatPrice } = useCurrency();

    const dispatch = useAppDispatch();
    const { products: tours, loading } = useAppSelector((state) => state.products);

    // Fetch vehicles on mount
    useEffect(() => {
        dispatch(fetchAllExcursions());
    }, [dispatch]);

    // Get top 10 vehicles with useMemo for performance
    const topVehicles = useMemo(() => {
        return tours.slice(0, 10);
    }, [tours]);

    const goToDetail = (productId: string) => {
        const numericId = productId?.split('/').pop() || productId;
        navigate(`/fleets/${numericId}`);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (loading) {
        return <PopularToursSkeletonLoader />;
    }

    return (
        <div className="bg-gradient-to-b from-white via-gray-50/20 to-white py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            <span className="text-red-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Featured</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                            Premium Fleet Collection
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base font-medium mt-2">Handpicked luxury vehicles for every occasion</p>
                    </div>
                    <div className="hidden sm:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="bg-white border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-full p-3 transition-all shadow-md hover:shadow-lg group"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="bg-white border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-full p-3 transition-all shadow-md hover:shadow-lg group"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                        </button>
                    </div>
                </div>

                {/* Vehicles Scrollable Row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {topVehicles.map((vehicle, index) => (
                        <div
                            key={vehicle.id}
                            className="group cursor-pointer w-[75vw] sm:w-[45vw] md:w-[320px] lg:w-[300px] flex-shrink-0 transform hover:scale-[1.02] transition-all duration-300"
                            onClick={() => goToDetail(vehicle.id)}
                        >
                            {/* Card Container */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-200">
                                {/* Image */}
                                <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <LazyLoadImage
                                        src={vehicle.images[0]}
                                        alt={vehicle.title}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                        onError={(e) => {
                                            console.error('Vehicle image failed to load:', vehicle.images[0]);
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600';
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Most Popular Badge - Show for first 3 vehicles */}
                                    {index < 3 && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            <span>Most Popular</span>
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-gray-200">
                                        {vehicle.price && (
                                            <div className="flex flex-col">
                                                {/* Original (Strikethrough) Price */}
                                                <span className="text-[10px] sm:text-xs text-gray-500 line-through leading-tight">
                                                    {formatPrice(vehicle.price + 60)}
                                                </span>
                                                {/* Current Price */}
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent leading-tight">
                                                        {formatPrice(vehicle.price)}
                                                    </span>
                                                    <span className="text-[9px] text-gray-600 font-semibold">/day</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rating Badge */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-lg border border-gray-200 flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-600 text-red-600" />
                                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                                            {vehicle.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-gray-600 font-semibold truncate">
                                            {vehicle.location}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 leading-tight mb-3">
                                        {vehicle.title}
                                    </h3>

                                    {/* View Details Button */}
                                    <button className="w-full bg-gradient-to-r from-gray-50 to-gray-100 group-hover:from-red-600 group-hover:to-red-700 text-gray-700 group-hover:text-white font-bold text-sm py-2.5 rounded-lg transition-all duration-300 border-2 border-gray-200 group-hover:border-transparent shadow-sm group-hover:shadow-md">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10 sm:mt-12 md:mt-14">
                    <Link to={"/fleets"}>
                        <button className="group relative bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Explore All Vehicles
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}