import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Users, Star, ChevronLeft, ChevronRight, CheckCircle, Check, Sparkles, ChevronUp, ChevronDown, Info, AlertCircle, Gauge, Fuel, Settings, Car as CarIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchExcursionById } from '../slices/productsSlice';
import { LazyImage } from './LazyImage';
import { BookingSkeleton, DetailsSkeleton, ImageGallerySkeleton } from './Skeletons/ItemDetailPage';
import { FaWhatsapp } from 'react-icons/fa';
import { useCurrency } from '../hooks/useCurrency';

export default function ItemDetailpage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    // Get product state from Redux
    const { selectedProduct: excursion, loading } = useAppSelector((state) => state.products);
    const { formatPrice } = useCurrency();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Accordion states
    const [isOverviewOpen, setIsOverviewOpen] = useState(true);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);
    const [isRentalInfoOpen, setIsRentalInfoOpen] = useState(false);

    // Fetch vehicle details
    useEffect(() => {
        if (id) {
            const gidId = id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
            dispatch(fetchExcursionById(gidId));
        }
    }, [id, dispatch]);

    const nextImage = () => {
        if (excursion) {
            setCurrentImageIndex((prev) => (prev + 1) % excursion.images.length);
        }
    };

    const prevImage = () => {
        if (excursion) {
            setCurrentImageIndex((prev) => (prev - 1 + excursion.images.length) % excursion.images.length);
        }
    };

    const displayFeatures = useMemo(() => {
        const defaultFeatures = [
            "Air Conditioning",
            "Bluetooth Audio",
            "GPS Navigation",
            "Automatic Transmission",
            "Premium Sound System",
            "Leather Seats"
        ];

        const hasValidInclusions = excursion?.inclusions &&
            excursion.inclusions.length > 0 &&
            excursion.inclusions.some(item => item && item.trim().length > 0);

        return hasValidInclusions
            ? excursion.inclusions.filter(item => item && item.trim().length > 0)
            : defaultFeatures;
    }, [excursion?.inclusions]);

    const pricePerDay = excursion?.price || 0;

    const handleWhatsAppInquiry = () => {
        if (!excursion) return;

        const phoneNumber = `${import.meta.env.VITE_CONTACT_NUMBER}`;

        const message = `Hi! I'm interested in renting this vehicle:

🚗 *${excursion.title}*
${excursion.brand ? `🏢 Brand: ${excursion.brand}` : ''}
${excursion.carType ? `🚙 Type: ${excursion.carType}` : ''}
${excursion.location ? `📌 Location: ${excursion.location}` : ''}

💰 Price: ${formatPrice(pricePerDay)}/day

Can you help me with the booking?`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
                {/* Breadcrumb Skeleton */}
                <div className="border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-48 sm:w-64" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                        {/* Left Column - Skeletons */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            <ImageGallerySkeleton />
                            <DetailsSkeleton />
                        </div>

                        {/* Right Column - Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 sm:top-8">
                                <BookingSkeleton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!excursion) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 px-4">
                Vehicle not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
                        <Link to="/" className="hover:text-red-600 font-medium transition-colors">Home</Link>
                        <span className="text-gray-400">→</span>
                        <Link to="/fleets" className="hover:text-red-600 font-medium transition-colors">Our Fleet</Link>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 font-semibold truncate">{excursion.title}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Image Gallery */}
                        <div className="relative">
                            <div className="relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200">
                                <LazyImage
                                    src={excursion.images[currentImageIndex]}
                                    alt={excursion.title}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 sm:p-2.5 rounded-full transition-all shadow-lg hover:scale-110"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 sm:p-2.5 rounded-full transition-all shadow-lg hover:scale-110"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                </button>

                                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                                    {currentImageIndex + 1} / {excursion.images.length}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2">
                                {excursion.images.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 ${index === currentImageIndex
                                            ? 'border-red-600 ring-2 ring-red-300'
                                            : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-red-400'
                                            } transition-all`}
                                    >
                                        <LazyImage
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title & Details */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                            <div className="flex items-start justify-between mb-4 gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full">
                                            <Sparkles className="w-4 h-4 text-red-600" />
                                            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Premium Vehicle</span>
                                        </div>
                                        {excursion.brand && (
                                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 px-3 py-1.5 rounded-full">
                                                <CarIcon className="w-4 h-4 text-red-600" />
                                                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">{excursion.brand}</span>
                                            </div>
                                        )}
                                        {excursion.year && (
                                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full">
                                                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{excursion.year}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4">
                                        {excursion.title}
                                    </h1>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600">
                                        {excursion.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                                                <span className="truncate font-semibold">{excursion.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-red-600 text-red-600 flex-shrink-0" />
                                            <span className="font-bold text-gray-900">
                                                {excursion.rating?.toFixed(1)}
                                            </span>
                                            <span className="truncate font-medium">({excursion.reviewsCount} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            {excursion.seats && (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                    <Users className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                    <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                        {excursion.seats}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">Seats</div>
                                </div>
                            )}
                            {excursion.fuelType && (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                    <Fuel className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                    <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                        {excursion.fuelType}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">Fuel Type</div>
                                </div>
                            )}
                            {excursion.carType && (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                    <Gauge className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                    <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                        {excursion.carType}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">Type</div>
                                </div>
                            )}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                    Auto
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Transmission</div>
                            </div>
                        </div>

                        {/* Overview - Accordion */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setIsOverviewOpen(!isOverviewOpen)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-8 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></span>
                                    Overview
                                </h2>
                                <div className="flex-shrink-0 ml-4">
                                    {isOverviewOpen ? (
                                        <ChevronUp className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                            </button>

                            {isOverviewOpen && (
                                <div className="px-6 pb-6">
                                    <div
                                        className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: excursion.descriptionHtml }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Features - Accordion */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <span>Features & Amenities</span>
                                </h2>
                                <div className="flex-shrink-0 ml-4">
                                    {isFeaturesOpen ? (
                                        <ChevronUp className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                            </button>

                            {isFeaturesOpen && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {displayFeatures?.map((feature: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border-2 border-green-200 hover:bg-green-100 transition-colors"
                                            >
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-gray-800 font-semibold text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Specifications - Accordion */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <Settings className="w-6 h-6 text-white" />
                                    </div>
                                    <span>Vehicle Specifications</span>
                                </h2>
                                <div className="flex-shrink-0 ml-4">
                                    {isSpecsOpen ? (
                                        <ChevronUp className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                            </button>

                            {isSpecsOpen && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {excursion.seats && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Seats</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.seats}</div>
                                            </div>
                                        )}
                                        {excursion.fuelType && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Fuel Type</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.fuelType}</div>
                                            </div>
                                        )}
                                        {excursion.acceleration && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">0-100 km/h</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.acceleration} sec</div>
                                            </div>
                                        )}
                                        {excursion.maxSpeed && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Top Speed</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.maxSpeed} km/h</div>
                                            </div>
                                        )}
                                        {excursion.year && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Year</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.year}</div>
                                            </div>
                                        )}
                                        {excursion.carType && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Body Type</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.carType}</div>
                                            </div>
                                        )}
                                        {excursion.brand && (
                                            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1 font-semibold">Brand</div>
                                                <div className="text-sm font-bold text-gray-900">{excursion.brand}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rental Information - Accordion */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setIsRentalInfoOpen(!isRentalInfoOpen)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                        <Info className="w-6 h-6 text-white" />
                                    </div>
                                    <span>Rental Information</span>
                                </h2>
                                <div className="flex-shrink-0 ml-4">
                                    {isRentalInfoOpen ? (
                                        <ChevronUp className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                            </button>

                            {isRentalInfoOpen && (
                                <div className="px-6 pb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-semibold mb-1">Minimum Age</p>
                                                <p className="text-xs text-gray-700">
                                                    Driver must be at least 21 years old with a valid driving license.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-semibold mb-1">Security Deposit</p>
                                                <p className="text-xs text-gray-700">
                                                    A refundable security deposit is required at the time of pickup.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-semibold mb-1">Insurance</p>
                                                <p className="text-xs text-gray-700">
                                                    Comprehensive insurance included. Additional coverage options available.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-semibold mb-1">Mileage</p>
                                                <p className="text-xs text-gray-700">
                                                    Daily limit: 250 km. Additional charges apply for excess mileage.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-semibold mb-1">Cancellation Policy</p>
                                                <p className="text-xs text-gray-700">
                                                    Free cancellation up to 48 hours before pickup. Full refund guaranteed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 sm:top-8 space-y-6">
                            {/* Price Card */}
                            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-8 shadow-2xl">
                                <div className="text-center mb-8">
                                    <p className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">Starting From</p>
                                    <div className="text-5xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">
                                        {formatPrice(excursion.price)}
                                    </div>
                                    <p className="text-lg text-gray-700 font-bold">per day</p>
                                </div>

                                {/* Divider */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t-2 border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-gradient-to-br from-white to-gray-50 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Get Started
                                        </span>
                                    </div>
                                </div>

                                {/* WhatsApp Inquiry Button */}
                                <button
                                    onClick={handleWhatsAppInquiry}
                                    className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group mb-4"
                                >
                                    <FaWhatsapp className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                                    <span className="text-lg">Inquire Now</span>
                                </button>

                                <p className="text-sm text-center text-gray-600 font-medium leading-relaxed">
                                    Chat with our team for instant quotes and personalized service
                                </p>
                            </div>

                            {/* What's Included Card */}
                            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl">
                                <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    What's Included
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600 font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm mb-1">Comprehensive Insurance</p>
                                            <p className="text-xs text-gray-600">Full coverage for peace of mind</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600 font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm mb-1">24/7 Support</p>
                                            <p className="text-xs text-gray-600">Round-the-clock assistance</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600 font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm mb-1">Free Delivery</p>
                                            <p className="text-xs text-gray-600">We bring the car to you</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600 font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm mb-1">Flexible Terms</p>
                                            <p className="text-xs text-gray-600">Daily, weekly, or monthly rentals</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Card */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-3xl p-8 shadow-xl">
                                <div className="text-center">
                                    <div className="text-5xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">
                                        {excursion.rating?.toFixed(1)}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 fill-red-600 text-red-600" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 font-bold mb-1">Excellent Rating</p>
                                    <p className="text-xs text-gray-600 font-medium">
                                        Based on {excursion.reviewsCount} verified reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}