import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Calendar, Users, Loader, Trash2, Plus, Minus, User, UserX, ShoppingBag, Sparkles, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createOrder } from '../slices/checkoutSlice';
import { clearCart, removeFromCart, updateQuantity } from '../slices/cartSlice';
import { useCurrency } from '../hooks/useCurrency';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type CheckoutStep = 'cart' | 'checkout';
type CheckoutType = 'guest' | 'account';

export const CartPageComplete: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { items } = useAppSelector((state) => state.cart);
    const { loading: checkoutLoading, success: checkoutSuccess } = useAppSelector((state) => state.checkout);
    const { formatPrice, convertPrice, selectedCurrency } = useCurrency();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
    const [checkoutType, setCheckoutType] = useState<CheckoutType>('guest');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '+971',
    });

    // Set default checkout type based on authentication
    useEffect(() => {
        if (isAuthenticated && user) {
            setCheckoutType('account');
        }
    }, [isAuthenticated, user]);

    // Pre-fill data ONLY when checkout type is 'account' AND user is authenticated
    useEffect(() => {
        if (checkoutType === 'account' && isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                name: user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : prev.name,
            }));
        } else if (checkoutType === 'guest') {
            // Clear form data when switching to guest mode
            setFormData({
                name: '',
                email: '',
                phone: '+971',
            });
        }
    }, [checkoutType, isAuthenticated, user]);

    // Calculate totals with currency conversion
    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            const convertedPrice = convertPrice(item.price);
            return sum + (convertedPrice * item.quantity);
        }, 0);
    }, [items, convertPrice]);

    const tax = useMemo(() => totalPrice * 0.05, [totalPrice]);
    const finalTotal = useMemo(() => totalPrice + tax, [totalPrice, tax]);

    // Calculate AED totals for order submission
    const totalPriceAED = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    const taxAED = useMemo(() => totalPriceAED * 0.05, [totalPriceAED]);
    const finalTotalAED = useMemo(() => totalPriceAED + taxAED, [totalPriceAED, taxAED]);

    const handleRemoveItem = (variantId: string) => {
        dispatch(removeFromCart(variantId));
    };

    const handleQuantityChange = (variantId: string, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ variantId, quantity }));
        }
    };

    const handleCheckoutClick = () => {
        setCurrentStep('checkout');
    };

    const handleBackToCart = () => {
        setCurrentStep('cart');
        setErrorMessage(null);
    };

    const handleCheckoutTypeChange = (type: CheckoutType) => {
        if (type === 'account' && !isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/cart' } } });
            return;
        }
        setCheckoutType(type);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            if (!value.startsWith('+971')) {
                setFormData(prev => ({ ...prev, [name]: '+971' }));
                return;
            }
            const phoneRegex = /^\+971[0-9]{0,9}$/;
            if (phoneRegex.test(value) || value === '+971') {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.name || !formData.email || !formData.phone) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        if (formData.phone.length !== 13) {
            setErrorMessage('Please enter a valid UAE phone number (9 digits after +971)');
            return;
        }

        const lineItems = items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            customAttributes: item.customAttributes
                ? [
                    { key: 'Pickup Date', value: item.customAttributes.pickupDate || item.customAttributes.date || '' },
                    { key: 'Dropoff Date', value: item.customAttributes.dropoffDate || '' },
                    { key: 'Rental Days', value: item.customAttributes.rentalDays || item.customAttributes.totalGuests || '0' },
                    { key: 'Display Currency', value: selectedCurrency.code },
                    { key: 'Checkout Type', value: checkoutType === 'guest' ? 'Guest Checkout' : 'Account Checkout' },
                ]
                : [
                    { key: 'Display Currency', value: selectedCurrency.code },
                    { key: 'Checkout Type', value: checkoutType === 'guest' ? 'Guest Checkout' : 'Account Checkout' },
                ],
        }));

        const result: any = await dispatch(
            createOrder({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                lineItems,
                note: `${checkoutType === 'guest' ? 'Guest' : 'Account'} Booking - Customer viewed prices in ${selectedCurrency.code}`,
                tags: ['Online Booking', `Currency: ${selectedCurrency.code}`, checkoutType === 'guest' ? 'Guest Checkout' : 'Account Checkout'],
            })
        );

        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(clearCart());
            setSubmitted(true);
            sessionStorage.setItem('tempOrderData', JSON.stringify(result.payload));

            setTimeout(() => {
                if (result.payload?.checkoutUrl) {
                    window.location.href = result.payload.checkoutUrl;
                } else {
                    setErrorMessage('Checkout URL not received. Please try again.');
                    setSubmitted(false);
                }
            }, 1500);
        } else if (result.meta.requestStatus === 'rejected') {
            setErrorMessage(result.payload || 'Failed to create order. Please try again.');
            setSubmitted(false);
        }
    };

    // Success/Loading State
    if (submitted && checkoutSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="mb-8 inline-block">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center animate-pulse">
                                <Loader className="w-12 h-12 text-white animate-spin" />
                            </div>
                            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3">Booking Confirmed!</h1>
                    <p className="text-lg text-gray-600 mb-8 font-medium">Preparing your secure checkout...</p>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🔒</div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 text-base mb-2">Secure Payment Gateway</p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Your luxury car rental booking is ready. Redirecting to our secure payment portal now.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-700 font-bold mb-4">Redirecting to Payment</p>
                        <div className="flex gap-2 justify-center">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-red-700 rounded-full animate-pulse delay-100"></div>
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-200"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-900">Next: Complete Your Payment</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Please keep this page open. You'll be redirected automatically.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center text-center p-6">
                <div>
                    <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-gray-300">
                        <ShoppingBag className="w-14 h-14 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8 text-lg font-medium">Start your journey by browsing our premium fleet!</p>
                    <Link
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                        to={"/fleets"}
                    >
                        <span>Explore Our Fleet</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    // CART VIEW
    if (currentStep === 'cart') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full mb-4 border border-gray-300">
                            <ShoppingBag className="w-4 h-4 text-red-600" />
                            <span className="text-red-700 text-sm font-bold uppercase tracking-wider">Shopping Cart</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Your Selected Vehicles</h1>
                        <p className="text-gray-600 text-lg font-medium">
                            {items.length} {items.length !== 1 ? 'vehicles' : 'vehicle'} selected
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.variantId}
                                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="w-full sm:w-32 h-32 flex items-center rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                            <LazyLoadImage loading='lazy' src={item?.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                                    <p className="text-xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.variantId)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {item.customAttributes && (
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 mb-4 text-sm text-gray-700 space-y-2 border border-gray-200">
                                                    {item.customAttributes.pickupDate && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-red-600" />
                                                            <span className="font-semibold">
                                                                Pickup: {new Date(item.customAttributes.pickupDate).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.customAttributes.dropoffDate && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-red-600" />
                                                            <span className="font-semibold">
                                                                Dropoff: {new Date(item.customAttributes.dropoffDate).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.customAttributes.rentalDays && (
                                                        <div className="text-gray-700 font-medium">
                                                            🕐 {item.customAttributes.rentalDays} {item.customAttributes.rentalDays === '1' ? 'day' : 'days'} rental
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 flex-wrap">
                                                <span className="text-gray-700 text-sm font-semibold">Quantity:</span>
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-red-600" />
                                                    </button>
                                                    <span className="px-4 py-2 font-bold text-gray-900 min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                                <span className="ml-auto text-right">
                                                    <p className="text-gray-600 text-sm font-medium">Subtotal</p>
                                                    <p className="text-xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Link
                                to="/fleets"
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold mt-6 transition-colors"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200 sticky top-6">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Order Summary</h3>

                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border-2 border-gray-200 mb-6">
                                    <div className="flex justify-between text-gray-700 font-medium">
                                        <span>Subtotal</span>
                                        <span>{selectedCurrency?.symbol}{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 font-medium">
                                        <span>VAT (5%)</span>
                                        <span>{selectedCurrency?.symbol}{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                                        <span className="text-lg font-black text-gray-900">Total</span>
                                        <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                            {selectedCurrency?.symbol}{finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {selectedCurrency.code !== 'AED' && (
                                        <div className="text-xs text-gray-600 text-center pt-2 border-t border-gray-200 font-medium">
                                            ≈ AED {finalTotalAED.toFixed(2)} at checkout
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleCheckoutClick}
                                    className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </button>

                                {/* Guest Checkout Badge */}
                                <div className="mt-5 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-gray-700 bg-green-50 px-4 py-2 rounded-full border-2 border-green-200 font-semibold">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Quick guest checkout available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // CHECKOUT VIEW
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <button
                        onClick={handleBackToCart}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold mb-6 transition-colors"
                    >
                        ← Back to Cart
                    </button>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full mb-4 border border-gray-300">
                        <Sparkles className="w-4 h-4 text-red-600" />
                        <span className="text-red-700 text-sm font-bold uppercase tracking-wider">Checkout</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Complete Your Booking</h1>
                    <p className="text-gray-600 text-lg font-medium">Your luxury vehicle awaits!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={handleCheckoutSubmit}
                            className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200"
                        >
                            {/* Checkout Type Selection */}
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-gray-900 mb-4">Choose Checkout Method</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Guest Checkout Option */}
                                    <button
                                        type="button"
                                        onClick={() => handleCheckoutTypeChange('guest')}
                                        className={`p-5 rounded-2xl border-2 transition-all text-left ${checkoutType === 'guest'
                                            ? 'border-red-600 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkoutType === 'guest'
                                                ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <UserX className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Guest Checkout</h3>
                                                <p className="text-xs text-gray-600 font-medium">Quick & easy</p>
                                            </div>
                                        </div>
                                        {checkoutType === 'guest' && (
                                            <div className="text-xs text-red-700 font-bold mt-2 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Selected
                                            </div>
                                        )}
                                    </button>

                                    {/* Account Checkout Option */}
                                    <button
                                        type="button"
                                        onClick={() => handleCheckoutTypeChange('account')}
                                        className={`p-5 rounded-2xl border-2 transition-all text-left ${checkoutType === 'account'
                                            ? 'border-red-600 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkoutType === 'account'
                                                ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {isAuthenticated ? 'Use My Account' : 'Sign In'}
                                                </h3>
                                                <p className="text-xs text-gray-600 font-medium">
                                                    {isAuthenticated ? 'Faster checkout' : 'Track your bookings'}
                                                </p>
                                            </div>
                                        </div>
                                        {checkoutType === 'account' && isAuthenticated && (
                                            <div className="text-xs text-red-700 font-bold mt-2 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                {user?.email}
                                            </div>
                                        )}
                                        {!isAuthenticated && (
                                            <div className="text-xs text-gray-600 font-medium mt-2">Click to sign in →</div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></span>
                                {checkoutType === 'guest' ? 'Guest Details' : 'Your Details'}
                            </h2>

                            {errorMessage && (
                                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                    <p className="text-red-700 text-sm font-bold">❌ {errorMessage}</p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-800 text-sm font-bold mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition-all font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-800 text-sm font-bold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition-all font-medium ${checkoutType === 'account' && user?.email ? 'bg-gray-50' : ''
                                            }`}
                                        required
                                        readOnly={checkoutType === 'account' && !!user?.email}
                                    />
                                    {checkoutType === 'account' && user?.email && (
                                        <p className="text-red-600 text-xs mt-1 font-medium">Using your account email</p>
                                    )}
                                    {checkoutType === 'guest' && (
                                        <p className="text-gray-600 text-xs mt-1 font-medium">Confirmation will be sent here</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-800 text-sm font-bold mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+971 50 123 4567"
                                        pattern="^\+971[0-9]{9}$"
                                        title="Please enter a valid UAE phone number (9 digits after +971)"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition-all font-medium"
                                        required
                                    />
                                    <p className="text-gray-600 text-xs mt-1 font-medium">Enter 9 digits after +971</p>
                                </div>
                            </div>

                            {/* Guest Checkout Benefits */}
                            {checkoutType === 'guest' && (
                                <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 p-5">
                                    <h3 className="text-sm font-black text-green-800 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Guest Checkout Benefits
                                    </h3>
                                    <ul className="text-gray-700 text-sm space-y-2 font-medium">
                                        <li className="flex items-center gap-2">✓ No account creation needed</li>
                                        <li className="flex items-center gap-2">✓ Quick booking process</li>
                                        <li className="flex items-center gap-2">✓ Email confirmation sent</li>
                                        <li className="flex items-center gap-2">✓ Same secure payment</li>
                                    </ul>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-6">
                                <h3 className="text-lg font-black text-gray-700 mb-3 flex items-center gap-2">
                                    💳 Secure Payment
                                </h3>
                                <ul className="text-gray-700 text-sm space-y-2 font-medium leading-relaxed">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        100% secure payment processing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        Redirected to secure checkout
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        Instant email confirmation
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={checkoutLoading}
                                className="w-full mt-8 bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {checkoutLoading ? (
                                    <>
                                        <Loader className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Payment <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>

                            {/* Create Account Prompt for Guests */}
                            {checkoutType === 'guest' && !isAuthenticated && (
                                <div className="mt-4 text-center">
                                    <p className="text-gray-700 text-sm font-medium">
                                        Want to track your bookings?{' '}
                                        <Link to="/register" className="text-red-600 hover:text-red-700 font-bold">
                                            Create an account
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200 sticky top-6">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Order Summary</h3>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div
                                        key={item.variantId}
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="text-gray-600 text-sm font-semibold">× {item.quantity}</p>
                                            </div>
                                            <p className="text-red-600 font-black">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>

                                        <div className="border-t border-gray-200 mt-3 pt-3 text-sm text-gray-700 space-y-1">
                                            {item.customAttributes?.pickupDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-red-600" />
                                                    <span className="font-semibold">
                                                        {new Date(item.customAttributes.pickupDate).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {item.customAttributes?.rentalDays && (
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-red-600" />
                                                    <span className="font-semibold">
                                                        {item.customAttributes.rentalDays}{' '}
                                                        {item.customAttributes.rentalDays === '1' ? 'day' : 'days'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border-2 border-gray-200">
                                <div className="flex justify-between text-gray-700 font-medium">
                                    <span>Subtotal</span>
                                    <span>{selectedCurrency?.symbol}{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 font-medium">
                                    <span>VAT (5%)</span>
                                    <span>{selectedCurrency?.symbol}{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Total</span>
                                    <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                        {selectedCurrency?.symbol}{finalTotal.toFixed(2)}
                                    </span>
                                </div>
                                {selectedCurrency.code !== 'AED' && (
                                    <div className="text-xs text-gray-600 text-center pt-2 border-t border-gray-200 font-medium">
                                        You'll pay AED {finalTotalAED.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageComplete;