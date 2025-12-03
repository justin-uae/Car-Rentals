import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Calendar, Star, ChevronLeft, ChevronRight, CheckCircle, Check, Sparkles, ArrowRight, ChevronUp, ChevronDown, Info, AlertCircle, Gauge, Fuel, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchExcursionById } from '../slices/productsSlice';
import { addToCartAsync } from '../slices/cartSlice';
import { LazyImage } from './LazyImage';
import { BookingSkeleton, DetailsSkeleton, ImageGallerySkeleton } from './Skeletons/ItemDetailPage';
import { FaWhatsapp } from 'react-icons/fa';
import { useCurrency } from '../hooks/useCurrency';

export default function ItemDetailpage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Get product and cart state from Redux
    const { selectedProduct: excursion, loading } = useAppSelector((state) => state.products);
    const { formatPrice } = useCurrency();

    const { checkout } = useAppSelector((state) => state.cart);

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [pickupDate, setPickupDate] = useState(getTodayDate());
    const [dropoffDate, setDropoffDate] = useState(getTodayDate());
    const [rentalDays, setRentalDays] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

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

    // Calculate rental days when dates change
    useEffect(() => {
        if (pickupDate && dropoffDate) {
            const pickup = new Date(pickupDate);
            const dropoff = new Date(dropoffDate);
            const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setRentalDays(diffDays > 0 ? diffDays : 1);
        }
    }, [pickupDate, dropoffDate]);

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
    const subtotal = formatPrice(pricePerDay * rentalDays);

    // Format date for display
    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return 'Select a date';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleWhatsAppInquiry = () => {
        if (!excursion) return;

        const phoneNumber = `${import.meta.env.VITE_CONTACT_NUMBER}`;

        const message = `Hi! I'm interested in renting this vehicle:

    🚗 *${excursion.title}*
    ${excursion.location ? `📌 Location: ${excursion.location}` : ''}

    *Rental Details:*
    📅 Pickup: ${formatDateDisplay(pickupDate)}
    📅 Dropoff: ${formatDateDisplay(dropoffDate)}
    ⏱️ Duration: ${rentalDays} ${rentalDays === 1 ? 'day' : 'days'}

    💰 Total Price: ${subtotal}

    Can you help me with the booking?`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    // Handle Book Now
    const handleBookNow = async () => {
        if (!excursion) return;

        setAddingToCart(true);
        try {
            const result = await dispatch(
                addToCartAsync({
                    item: {
                        variantId: excursion.variants[0].id,
                        quantity: rentalDays,
                        title: `${excursion.title} - ${pickupDate} to ${dropoffDate}`,
                        price: excursion?.price,
                        image: excursion.images[0],
                        productId: excursion.id,
                        customAttributes: {
                            pickupDate: pickupDate,
                            dropoffDate: dropoffDate,
                            rentalDays: rentalDays.toString(),
                        }
                    },
                    currentCheckout: checkout
                })
            );

            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
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
            {/* Custom Styles for Date Picker */}
            <style>{`
                input[type="date"] {
                    position: relative;
                    cursor: pointer;
                }

                input[type="date"]::-webkit-calendar-picker-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: auto;
                    height: auto;
                    color: transparent;
                    background: transparent;
                    cursor: pointer;
                }

                input[type="date"]:hover {
                    border-color: #DC2626 !important;
                }

                input[type="date"]:focus {
                    border-color: #DC2626 !important;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
                }

                .date-input-wrapper {
                    position: relative;
                }

                .date-input-wrapper .calendar-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #DC2626;
                }
            `}</style>

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
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full mb-3">
                                        <Sparkles className="w-4 h-4 text-red-600" />
                                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Premium Vehicle</span>
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
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                <Gauge className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                    {excursion.duration || 'Auto'}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Transmission</div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">
                                    {excursion.groupSize || '4-5'}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Passengers</div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 text-center border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                                <Fuel className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mx-auto mb-2" />
                                <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1">Petrol</div>
                                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Fuel Type</div>
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
                                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-semibold">Engine</div>
                                            <div className="text-sm font-bold text-gray-900">V6 / V8</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-semibold">Horsepower</div>
                                            <div className="text-sm font-bold text-gray-900">300+ HP</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-semibold">0-100 km/h</div>
                                            <div className="text-sm font-bold text-gray-900">5-7 sec</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                            <div className="text-xs text-gray-600 mb-1 font-semibold">Top Speed</div>
                                            <div className="text-sm font-bold text-gray-900">250 km/h</div>
                                        </div>
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
                        <div className="sticky top-4 sm:top-8">
                            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
                                {/* Price */}
                                <div className="mb-6">
                                    {excursion.price && (
                                        <div className="flex items-center gap-3 mb-2">
                                            {/* Original Price */}
                                            <span className="text-sm text-gray-500 line-through font-medium">
                                                {formatPrice(excursion.price + 60)}
                                            </span>
                                            {/* Discount Badge */}
                                            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                                <Sparkles className="w-3 h-3" />
                                                {Math.round(((60) / (excursion.price + 60)) * 100)}% OFF
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                        {formatPrice(excursion.price)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1 font-medium">per day</div>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Pickup Date
                                        </label>

                                        {/* Date Display Box */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-3 border-2 border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-2 flex-shrink-0">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-gray-600 mb-0.5 font-medium">Pickup</div>
                                                    <div className="text-sm font-bold text-gray-900 truncate">
                                                        {formatDateDisplay(pickupDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Styled Date Input */}
                                        <div className="date-input-wrapper">
                                            <input
                                                type="date"
                                                value={pickupDate}
                                                onChange={(e) => setPickupDate(e.target.value)}
                                                min={getTodayDate()}
                                                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all font-semibold text-gray-900 hover:border-red-300 cursor-pointer"
                                            />
                                            <Calendar className="calendar-icon w-5 h-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Dropoff Date
                                        </label>

                                        {/* Date Display Box */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-3 border-2 border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-2 flex-shrink-0">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-gray-600 mb-0.5 font-medium">Dropoff</div>
                                                    <div className="text-sm font-bold text-gray-900 truncate">
                                                        {formatDateDisplay(dropoffDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Styled Date Input */}
                                        <div className="date-input-wrapper">
                                            <input
                                                type="date"
                                                value={dropoffDate}
                                                onChange={(e) => setDropoffDate(e.target.value)}
                                                min={pickupDate}
                                                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all font-semibold text-gray-900 hover:border-red-300 cursor-pointer"
                                            />
                                            <Calendar className="calendar-icon w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Rental Duration Display */}
                                    <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                        <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">
                                            Rental Duration: <span className="font-bold text-gray-900">{rentalDays}</span> {rentalDays === 1 ? 'day' : 'days'}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2 text-sm">
                                        <span className="text-gray-700 font-medium">
                                            Daily Rate
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {formatPrice(pricePerDay)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2 text-sm">
                                        <span className="text-gray-700 font-medium">
                                            Duration ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {subtotal}
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-gray-200 pt-3 mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-black text-gray-900">Total</span>
                                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                                {subtotal}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleBookNow}
                                        disabled={addingToCart}
                                        className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {addingToCart ? 'Adding to Cart...' : (
                                            <>
                                                Book Now
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleWhatsAppInquiry}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                    >
                                        Inquire via WhatsApp
                                        <FaWhatsapp className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                                <div className="text-center">
                                    <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
                                        {excursion.rating?.toFixed(1)}/5
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-700 font-semibold">
                                        Based on {excursion.reviewsCount} reviews
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}