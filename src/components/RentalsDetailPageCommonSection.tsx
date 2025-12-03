import { Check, ChevronRight, Mail, Sparkles, Shield, Clock, CreditCard, CheckCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const RentalsDetailPageCommonSection = () => {
    return (
        <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
            {/* How It Works - Desert Theme */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                    How It Works
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center group">
                        <div className="relative mb-4 mx-auto w-fit">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-2xl sm:text-3xl font-black text-white">1</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Choose & Book</h3>
                        <p className="text-sm text-gray-600 font-medium">Select your date and number of adventurers</p>
                    </div>
                    <div className="text-center group">
                        <div className="relative mb-4 mx-auto w-fit">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-2xl sm:text-3xl font-black text-white">2</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Get Confirmation</h3>
                        <p className="text-sm text-gray-600 font-medium">Instant email with all details</p>
                    </div>
                    <div className="text-center group">
                        <div className="relative mb-4 mx-auto w-fit">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-2xl sm:text-3xl font-black text-white">3</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Enjoy Your Safari</h3>
                        <p className="text-sm text-gray-600 font-medium">Show voucher and create memories</p>
                    </div>
                </div>
            </div>

            {/* Important Information - Desert Theme */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                    Important Information
                </h2>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 sm:p-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Stay hydrated - bring water, especially during summer months
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Save our WhatsApp number for instant support during your adventure
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Bring valid ID or passport for verification
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Comfortable clothing and closed-toe shoes recommended
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Children must be accompanied by an adult
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                                Subject to favorable weather conditions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Book With Us - Desert Theme */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                    Why Book With Us
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 hover:shadow-md transition-all group">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-gray-900">Best Price Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 hover:shadow-md transition-all group">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-gray-900">24/7 Customer Support</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 hover:shadow-md transition-all group">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-gray-900">Secure Online Payment</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 hover:shadow-md transition-all group">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-gray-900">Instant Confirmation</span>
                    </div>
                </div>
            </div>

            {/* FAQ - Desert Theme */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    <details className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 group border-2 border-amber-200 hover:shadow-md transition-all">
                        <summary className="font-bold text-sm sm:text-base text-gray-900 cursor-pointer list-none flex items-center justify-between">
                            How do I receive my booking confirmation?
                            <ChevronRight className="w-5 h-5 text-amber-600 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium pl-1">
                            You'll receive an instant confirmation email with your booking details and voucher immediately after payment.
                        </p>
                    </details>
                    <details className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 group border-2 border-amber-200 hover:shadow-md transition-all">
                        <summary className="font-bold text-sm sm:text-base text-gray-900 cursor-pointer list-none flex items-center justify-between">
                            What should I bring on the safari?
                            <ChevronRight className="w-5 h-5 text-amber-600 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium pl-1">
                            Bring sunscreen, sunglasses, comfortable shoes, camera, light clothing, and your ID/passport. Don't forget water!
                        </p>
                    </details>
                    <details className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 group border-2 border-amber-200 hover:shadow-md transition-all">
                        <summary className="font-bold text-sm sm:text-base text-gray-900 cursor-pointer list-none flex items-center justify-between">
                            Can I modify or cancel my booking?
                            <ChevronRight className="w-5 h-5 text-amber-600 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium pl-1">
                            Yes! You can modify or cancel your booking up to 24 hours before the tour. Contact our support team via WhatsApp or email.
                        </p>
                    </details>
                    <details className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 group border-2 border-amber-200 hover:shadow-md transition-all">
                        <summary className="font-bold text-sm sm:text-base text-gray-900 cursor-pointer list-none flex items-center justify-between">
                            Are your desert safaris safe and insured?
                            <ChevronRight className="w-5 h-5 text-amber-600 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium pl-1">
                            Absolutely! All our safaris are fully licensed and insured. Our experienced guides are trained in safety protocols to ensure a secure and enjoyable experience.
                        </p>
                    </details>
                </div>
            </div>

            {/* Need Help - Desert Theme */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                            <FaWhatsapp className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white">Need Help?</h2>
                    </div>

                    <p className="text-sm sm:text-base text-white/95 mb-6 font-medium leading-relaxed">
                        Have questions about your desert adventure? Our expert team is available 24/7 to assist you with bookings, inquiries, and support.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="https://wa.me/971545613397"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Chat on WhatsApp
                        </a>
                        <a
                            href="mailto:info@safaris.ae"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            <Mail className="w-5 h-5" />
                            Email Us
                        </a>
                    </div>

                    <div className="mt-6 pt-6 border-t-2 border-white/20">
                        <div className="flex items-center justify-center gap-2 text-white/90">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-bold">100% Secure Booking • Licensed & Insured</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentalsDetailPageCommonSection