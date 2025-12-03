import { useEffect } from "react";
import { Home, Package, Calendar, CreditCard, AlertCircle, ShoppingBag, MapPin, Receipt } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { clearError, fetchCustomerOrders } from "../slices/ordersSlice";
import { OrderCardSkeleton } from "../components/Skeletons/OrderCardSkeleton";
import { LazyImage } from "../components/LazyImage";

export default function BookingsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);
    const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (accessToken) {
            dispatch(fetchCustomerOrders(accessToken));
        }

        return () => {
            dispatch(clearError());
        };
    }, [accessToken, isAuthenticated, navigate, dispatch]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleRetry = () => {
        if (accessToken) {
            dispatch(fetchCustomerOrders(accessToken));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2">
                                    My Bookings
                                </h1>
                                <div className="h-5 sm:h-6 bg-white/20 rounded-lg w-32 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skeleton Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="space-y-6 sm:space-y-8">
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex flex-col items-center justify-center px-4 py-8">
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 text-center w-full max-w-md border-2 border-red-200">
                    <div className="bg-red-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2 sm:mb-3">Oops! Something went wrong</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed font-medium">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
                <Link
                    to={'/'}
                    className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-amber-700 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-300"
                >
                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-lg">
                            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2">
                                My Bookings
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-amber-50 font-bold">
                                {orders?.length} {orders.length === 1 ? 'booking' : 'bookings'} found
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {orders?.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-12 md:p-16 text-center border-2 border-amber-100">
                        <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-3 sm:mb-4">No bookings yet</h2>
                        <p className="text-base sm:text-lg text-gray-600 font-medium mb-8 sm:mb-10 max-w-md mx-auto">
                            Start your desert adventure today! Explore our curated collection of amazing safari experiences.
                        </p>
                        <Link
                            to={'/fleets'}
                            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <MapPin className="w-5 h-5" />
                            Explore Desert Safaris
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 border-2 border-amber-100"
                            >
                                {/* Order Header */}
                                <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-6 md:p-8 overflow-hidden">
                                    {/* Decorative background pattern */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

                                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                                                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                                                Order #{order.orderNumber}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 text-amber-50 ml-9 sm:ml-0">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base font-bold">{formatDate(order.date)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 sm:p-6 md:p-8">
                                    <div className="space-y-4 sm:space-y-6">
                                        {order?.items?.map((item, index) => {
                                            const lineTotal = (item?.price || 0) * (item?.quantity || 1);

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 hover:shadow-lg transition-shadow"
                                                >
                                                    {item?.image ? (
                                                        <div className="relative flex-shrink-0 w-full sm:w-24 md:w-28">
                                                            <LazyImage
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full sm:w-24 md:w-28 h-48 sm:h-24 md:h-28 object-cover rounded-2xl shadow-xl ring-2 ring-amber-200"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-shrink-0 w-full sm:w-24 md:w-28 h-48 sm:h-24 md:h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg">
                                                            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                                                        </div>
                                                    )}

                                                    <div className="flex-1 min-w-0 w-full">
                                                        <h5 className="font-black text-gray-900 text-base sm:text-lg mb-3">
                                                            {item?.title}
                                                        </h5>
                                                        <div className="flex flex-col gap-3 text-sm">
                                                            {/* Pricing breakdown */}
                                                            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                                                <span>{order?.currencyCode} {item?.price?.toFixed(2)}</span>
                                                                <span>×</span>
                                                                <span>{item?.quantity}</span>
                                                            </div>

                                                            {/* Line total */}
                                                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2 rounded-xl shadow-lg font-black w-fit">
                                                                <CreditCard className="w-4 h-4" />
                                                                {order?.currencyCode} {lineTotal.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Summary with Tax */}
                                    <div className="mt-6 sm:mt-8 pt-6 border-t-2 border-amber-200">
                                        <div className="space-y-3">
                                            {/* Subtotal */}
                                            <div className="flex items-center justify-between text-gray-700">
                                                <span className="text-sm sm:text-base font-semibold">Subtotal</span>
                                                <span className="text-sm sm:text-base font-black">
                                                    {order?.currencyCode} {order?.subtotal?.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Tax - only show if > 0 */}
                                            {order?.tax > 0 && (
                                                <div className="flex items-center justify-between text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <Receipt className="w-4 h-4 text-amber-600" />
                                                        <span className="text-sm sm:text-base font-semibold">Tax</span>
                                                    </div>
                                                    <span className="text-sm sm:text-base font-black">
                                                        {order?.currencyCode} {order?.tax?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Shipping - only show if > 0 */}
                                            {order?.shipping > 0 && (
                                                <div className="flex items-center justify-between text-gray-700">
                                                    <span className="text-sm sm:text-base font-semibold">Shipping</span>
                                                    <span className="text-sm sm:text-base font-black">
                                                        {order?.currencyCode} {order?.shipping?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Total */}
                                            <div className="flex items-center justify-between pt-3 border-t-2 border-amber-200">
                                                <span className="text-base sm:text-lg font-black text-gray-800">Order Total</span>
                                                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                                                    {order?.currencyCode} {order?.total?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}