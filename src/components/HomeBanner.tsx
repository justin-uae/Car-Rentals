import { useEffect, useRef, useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchCollectionsWithProducts, fetchAllExcursions } from '../slices/productsSlice';
import { useNavigate } from 'react-router-dom';
import { getMediaUrls } from '../services/shopifyService';
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function HomepageBanner() {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [bannerUrls, setBannerUrls] = useState<string[]>([]);
    const [loadingBanners, setLoadingBanners] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const autoRotateRef = useRef<any | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { collectionsWithProducts, products, loading } = useAppSelector((state) => state.products);

    // Fetch collections and products on mount
    useEffect(() => {
        dispatch(fetchCollectionsWithProducts());
        dispatch(fetchAllExcursions());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowBrandDropdown(false);
            }
        };

        if (showBrandDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showBrandDropdown]);

    // Fetch banner URLs from media IDs
    useEffect(() => {
        const fetchBannerUrls = async () => {
            const bannerCollection = collectionsWithProducts?.find((col: any) => col.handle === "banner");
            const mediaIds = bannerCollection?.bannerMediaIds || [];

            if (mediaIds.length > 0) {
                setLoadingBanners(true);
                try {
                    const urls = await getMediaUrls(mediaIds);
                    setBannerUrls(urls);
                } catch (error) {
                    console.error("Error fetching banner URLs:", error);
                } finally {
                    setLoadingBanners(false);
                }
            }
        };

        fetchBannerUrls();
    }, [collectionsWithProducts]);

    // Auto-rotate banner every 5 seconds
    useEffect(() => {
        if (bannerUrls.length > 1) {
            autoRotateRef.current = setInterval(() => {
                setCurrentBannerIndex((prev) => (prev + 1) % bannerUrls.length);
            }, 5000);

            return () => {
                if (autoRotateRef.current) {
                    clearInterval(autoRotateRef.current);
                }
            };
        }
    }, [bannerUrls.length]);

    // Banner navigation functions
    const goToPreviousBanner = () => {
        if (autoRotateRef.current) {
            clearInterval(autoRotateRef.current);
        }

        setCurrentBannerIndex((prev) =>
            prev === 0 ? bannerUrls.length - 1 : prev - 1
        );

        if (bannerUrls.length > 1) {
            autoRotateRef.current = setInterval(() => {
                setCurrentBannerIndex((prev) => (prev + 1) % bannerUrls.length);
            }, 5000);
        }
    };

    const goToNextBanner = () => {
        if (autoRotateRef.current) {
            clearInterval(autoRotateRef.current);
        }

        setCurrentBannerIndex((prev) =>
            (prev + 1) % bannerUrls.length
        );

        if (bannerUrls.length > 1) {
            autoRotateRef.current = setInterval(() => {
                setCurrentBannerIndex((prev) => (prev + 1) % bannerUrls.length);
            }, 5000);
        }
    };

    // Get current banner image
    const currentBannerImage = bannerUrls[currentBannerIndex] || '';

    useEffect(() => {
        if (selectedBrand !== '') {
            navigate(`/fleets?brand=${encodeURIComponent(selectedBrand)}`);
        }
    }, [selectedBrand, navigate]);

    // Get unique brands from products
    const uniqueBrands = [
        ...new Map(
            products
                ?.filter((car: any) => car?.brand) // Only include products with brand
                .map((car: any) => [car?.brand, car])
        ).values(),
    ];

    // Get first 10 products for Popular Rental Locations
    const popularCars = products?.slice(0, 10) || [];

    // Scroll Functionality
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            const newScrollPosition =
                direction === 'left'
                    ? scrollLeft - scrollAmount
                    : scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    const handleBrandClick = (brand: string) => {
        setSelectedBrand(brand);
    };

    const handleCarClick = (carId: string) => {
        const numericId = carId?.split('/').pop() || carId;
        navigate(`/fleets/${numericId}`);
    };

    return (
        <>
            <div className="relative mt-2">
                {/* Hero Banner - Luxury Car Rental Theme */}
                <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px] group">
                    <div className="absolute inset-0 overflow-hidden">
                        {loadingBanners || !currentBannerImage ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-900 via-gray-900 to-black">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                                    <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-600 animate-pulse" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <LazyLoadImage
                                    src={`${currentBannerImage}`}
                                    alt="Luxury Car Rental Banner"
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                            </>
                        )}
                    </div>

                    {/* Banner Navigation Arrows - Luxury styled */}
                    {bannerUrls.length > 1 && !loadingBanners && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={goToPreviousBanner}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-2 sm:p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100 z-30"
                                aria-label="Previous banner"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={goToNextBanner}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-2 sm:p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100 z-30"
                                aria-label="Next banner"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Banner Indicators/Dots - Luxury styled */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                                {bannerUrls.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentBannerIndex(index);
                                            if (autoRotateRef.current) {
                                                clearInterval(autoRotateRef.current);
                                                autoRotateRef.current = setInterval(() => {
                                                    setCurrentBannerIndex((prev) => (prev + 1) % bannerUrls.length);
                                                }, 5000);
                                            }
                                        }}
                                        className={`rounded-full transition-all ${index === currentBannerIndex
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 w-8 sm:w-10 h-2.5 sm:h-3 shadow-lg'
                                            : 'bg-white/60 hover:bg-white/80 w-2.5 sm:w-3 h-2.5 sm:h-3'
                                            }`}
                                        aria-label={`Go to banner ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Hero Text - Clean & Visible */}
                    <div className="absolute inset-0 flex items-center z-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="max-w-4xl">
                                {/* Main heading with text shadow */}
                                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-3 sm:mb-4 md:mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                                    Drive Your Dream
                                    <span className="block text-red-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mt-1 sm:mt-2">
                                        Luxury Car Rental
                                    </span>
                                </h1>

                                {/* Description with background */}
                                <div className="inline-block bg-black/30 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3.5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold max-w-2xl leading-relaxed">
                                        Experience premium vehicles, exceptional service, and unforgettable journeys across the UAE
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Selector - Luxury styled */}
                <div className="relative -mt-8 sm:-mt-10 z-40 px-4">
                    <div className="max-w-md mx-auto">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                                className="w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-3 hover:shadow-3xl transition-all border-2 border-gray-100 hover:border-red-300 group"
                            >
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Select Brand</p>
                                    <span className={`${selectedBrand ? "text-gray-900 font-bold" : "text-gray-400 font-medium"} text-sm sm:text-base`}>
                                        {selectedBrand || "Choose Your Preferred Brand"}
                                    </span>
                                </div>
                                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-red-600 transition-transform ${showBrandDropdown ? 'rotate-90' : ''}`} />
                            </button>

                            {showBrandDropdown && (
                                <div className="absolute top-full mt-2 sm:mt-3 w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 max-h-96 overflow-y-auto z-50 border-2 border-gray-100">
                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Select Car Brand</h3>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Choose your preferred luxury brand</p>
                                    </div>
                                    {loading ? (
                                        <div className="text-center py-8 sm:py-12 text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-red-600 mx-auto mb-2 sm:mb-3"></div>
                                            <p className="text-xs sm:text-sm font-medium">Loading brands...</p>
                                        </div>
                                    ) : uniqueBrands.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-xs sm:text-sm font-medium">No brands available</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                            {uniqueBrands?.map((car: any, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        handleBrandClick(car?.brand);
                                                        setShowBrandDropdown(false);
                                                    }}
                                                    className="group flex flex-col gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all border-2 border-transparent hover:border-red-200"
                                                >
                                                    <div className="w-full h-20 sm:h-24 rounded-md sm:rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
                                                        <LazyLoadImage
                                                            src={car?.images?.[0] || 'https://via.placeholder.com/400x300?text=Car'}
                                                            alt={car.brand}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-1.5 justify-center">
                                                        <Car className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-red-700 transition-colors truncate">{car?.brand}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Popular Cars Section - Luxury Theme */}
                <div className="bg-gradient-to-b from-white via-gray-50/30 to-white py-12 sm:py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-1 sm:mb-2">
                                    Popular Rental Cars
                                </h2>
                                <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Explore our most sought-after luxury vehicles</p>
                            </div>
                            <div className="hidden sm:flex gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="bg-white border-2 border-gray-200 rounded-full p-2 sm:p-3 hover:border-red-400 hover:bg-red-50 transition-all shadow-md hover:shadow-lg group"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-red-700" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="bg-white border-2 border-gray-200 rounded-full p-2 sm:p-3 hover:border-red-400 hover:bg-red-50 transition-all shadow-md hover:shadow-lg group"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-red-700" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 sm:py-16 text-gray-500">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-3 sm:mb-4"></div>
                                <p className="font-semibold text-sm sm:text-base">Loading cars...</p>
                            </div>
                        ) : popularCars.length === 0 ? (
                            <div className="text-center py-12 sm:py-16 text-gray-500">
                                <Car className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                                <p className="font-semibold text-sm sm:text-base">No cars available at the moment</p>
                            </div>
                        ) : (
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {popularCars.map((car: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCarClick(car?.id)}
                                        className="relative min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[380px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-white hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                                    >
                                        {/* Car Image */}
                                        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                            <LazyLoadImage
                                                src={car?.images?.[0] || 'https://via.placeholder.com/400x300?text=Car'}
                                                alt={car.title}
                                                loading='lazy'
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                            {/* Brand Badge */}
                                            {car?.brand && (
                                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-lg">
                                                    <span className="text-xs font-bold text-gray-900">{car.brand}</span>
                                                </div>
                                            )}

                                            {/* Price Badge */}
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg shadow-lg">
                                                <span className="text-xs font-bold">AED {car.price}/day</span>
                                            </div>
                                        </div>

                                        {/* Car Details */}
                                        <div className="p-4 sm:p-5 text-left">
                                            <h3 className="text-gray-900 text-base sm:text-lg md:text-xl font-black mb-2 line-clamp-1 group-hover:text-red-700 transition-colors">
                                                {car?.title}
                                            </h3>

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {car?.seats && (
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <span className="text-xs font-medium">{car.seats} Seats</span>
                                                    </div>
                                                )}
                                                {car?.fuelType && (
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <span className="text-xs font-medium">{car.fuelType}</span>
                                                    </div>
                                                )}
                                                {car?.year && (
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <span className="text-xs font-medium">{car.year}</span>
                                                    </div>
                                                )}
                                                {car?.carType && (
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <span className="text-xs font-medium">{car.carType}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Location */}
                                            {car?.location && (
                                                <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                                                    <MapPin className="w-3 h-3 text-red-600" />
                                                    <span className="text-xs font-medium">{car.location}</span>
                                                </div>
                                            )}

                                            {/* CTA */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span className="text-xs font-bold text-gray-900">View Details</span>
                                                <ChevronRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Corner accent */}
                                        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}