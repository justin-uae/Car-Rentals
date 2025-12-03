import { Shield, Award, Headphones, Wallet, Clock, Users, Star, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyChooseUs() {
    const features = [
        {
            icon: Shield,
            title: "Safe & Secure",
            description: "100% secure payment and verified premium vehicles"
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Find a better price? We'll match it instantly"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Expert assistance whenever you need us"
        },
        {
            icon: Wallet,
            title: "Easy Booking",
            description: "Quick and seamless booking experience"
        }
    ];

    const stats = [
        {
            icon: Users,
            number: "50K+",
            label: "Happy Customers"
        },
        {
            icon: Star,
            number: "4.9/5",
            label: "Average Rating"
        },
        {
            icon: Globe,
            number: "200+",
            label: "Premium Vehicles"
        },
        {
            icon: Clock,
            number: "15+",
            label: "Years of Excellence"
        }
    ];

    return (
        <div className="bg-gradient-to-b from-white via-gray-50/30 to-white py-16 sm:py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-14 md:mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full mb-4 border border-gray-300">
                        <Sparkles className="w-4 h-4 text-red-600" />
                        <span className="text-red-700 text-sm font-bold uppercase tracking-wider">Why Choose Us</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-5">
                        Your Trusted Luxury
                        <span className="block bg-gradient-to-r from-red-600 via-red-700 to-red-600 bg-clip-text text-transparent">
                            Car Rental Partner
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 font-medium">
                        We transform your journey into an extraordinary experience with premium vehicles, exceptional service, and unforgettable moments
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-16 sm:mb-20 md:mb-24">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border-2 border-transparent hover:border-red-200 relative overflow-hidden"
                            >
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-600 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-red-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Section */}
                <div className="relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl p-8 sm:p-10 md:p-14 border-2 border-gray-200 overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full opacity-20 blur-3xl"></div>

                    <div className="relative">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">
                                Trusted by Thousands
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base font-medium">Our numbers speak for themselves</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="text-center group">
                                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border-2 border-gray-300">
                                            <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-red-600" />
                                        </div>
                                        <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs sm:text-sm md:text-base text-gray-700 font-bold">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="mt-12 sm:mt-16 md:mt-20 relative bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-3xl p-8 sm:p-10 md:p-14 text-center shadow-2xl overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">Limited Time Offer</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-5 px-2 drop-shadow-lg">
                            Ready for Your Ultimate Drive?
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 font-medium drop-shadow">
                            Book your dream luxury vehicle today and experience the finest cars in the UAE with unmatched service
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                            <Link to={'/fleets'} className="w-full sm:w-auto">
                                <button className="group w-full sm:w-auto bg-white text-red-700 hover:bg-gray-50 font-bold px-8 sm:px-10 py-4 text-base sm:text-lg rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span>Explore Fleet</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link to={'/contact'} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-700 font-bold px-8 sm:px-10 py-4 text-base sm:text-lg rounded-full transition-all transform hover:scale-105">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}