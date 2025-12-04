import { Mail, Calendar, MapPin, ShoppingBag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

export default function ProfilePage() {
    const { user } = useAppSelector((state) => state.auth);
    const { orders } = useAppSelector((state) => state.orders);
    // Format member since date
    const getMemberSinceDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return 'Recently';
    };

    const getMemberSinceYear = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).getFullYear();
        }
        return new Date().getFullYear();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 mb-6">
                    {/* Gradient Header - Luxury Theme */}
                    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-600 p-8 sm:p-12 text-white overflow-hidden">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative text-center">
                            {/* Profile Image */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-2xl mx-auto mb-4 ring-4 ring-white/30">
                                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                            </div>

                            {/* Profile Info */}
                            <h2 className="text-2xl sm:text-3xl font-black mb-3 break-words px-4">
                                {user?.displayName || user?.email}
                            </h2>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm sm:text-base text-gray-50 border border-white/20">
                                <Calendar className="w-4 h-4" />
                                <span className="font-bold">Member since {getMemberSinceYear()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="p-6 sm:p-8 md:p-10">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            Account Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Name (if available) */}
                            {(user?.firstName || user?.lastName) && (
                                <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 font-bold">Full Name</p>
                                    <p className="font-black text-base sm:text-lg text-gray-900">
                                        {`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                                    </p>
                                </div>
                            )}

                            {/* Email */}
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 font-bold">Email Address</p>
                                <p className="font-black text-base sm:text-lg text-gray-900 break-words">{user?.email}</p>
                            </div>

                            {/* Member Since */}
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center gap-1 font-bold">
                                    <Calendar className="w-4 h-4 text-red-600" />
                                    Member Since
                                </p>
                                <p className="font-black text-base sm:text-lg text-gray-900">{getMemberSinceDate()}</p>
                            </div>

                            {/* Location */}
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center gap-1 font-bold">
                                    <MapPin className="w-4 h-4 text-red-600" />
                                    Location
                                </p>
                                <p className="font-black text-base sm:text-lg text-gray-900">United Arab Emirates</p>
                            </div>

                            {/* Total Orders */}
                            <div className="p-5 bg-gradient-to-br from-red-600 via-red-700 to-red-600 rounded-2xl text-white sm:col-span-2 shadow-xl">
                                <p className="text-xs sm:text-sm text-gray-50 mb-2 flex items-center gap-1 font-bold">
                                    <ShoppingBag className="w-4 h-4" />
                                    Total Bookings
                                </p>
                                <p className="font-black text-3xl sm:text-4xl">{orders?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    {/* View All Orders */}
                    <Link
                        to="/bookings"
                        className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 hover:shadow-2xl hover:border-red-300 transition-all duration-300 p-6 sm:p-8"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">My Bookings</h3>
                                <p className="text-sm sm:text-base text-gray-600 font-semibold">View all your orders</p>
                            </div>
                        </div>
                    </Link>

                    {/* Browse Fleet */}
                    <Link
                        to="/fleets"
                        className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 hover:shadow-2xl hover:border-red-300 transition-all duration-300 p-6 sm:p-8"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-700 to-red-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Browse Fleet</h3>
                                <p className="text-sm sm:text-base text-gray-600 font-semibold">Explore premium vehicles</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-700 font-bold py-3 px-8 text-sm sm:text-base rounded-2xl transition-all transform hover:scale-105 shadow-xl border-2 border-gray-200 hover:border-red-300"
                        to={"/"}
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}