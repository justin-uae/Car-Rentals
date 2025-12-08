import { useNavigate } from "react-router-dom";
import { LazyImage } from "./LazyImage";
import { useCurrency } from "../hooks/useCurrency";
import { MapPin, Clock, Users, MessageCircle, Star, Sparkles, ArrowRight } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    images: string[];
    location: string;
    duration: string;
    rating: number;
    reviewsCount: number;
    groupSize: string;
    carType?: string;
}

export const ExcursionCard = ({ excursion }: { excursion: Product }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    const goToDetail = (productId: string) => {
        const numericId = productId.split('/').pop() || productId;
        navigate(`/fleets/${numericId}`);
    };

    const discountPercentage = Math.round(((60) / ((excursion.price) + 60)) * 100);

    return (
        <div
            className="bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group border-2 border-transparent hover:border-red-200"
            onClick={() => goToDetail(excursion.id)}
        >
            {/* Image Container */}
            <div className="relative h-50 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <LazyImage
                    src={`${excursion.images[0]}?width=400&height=300&crop=center`}
                    alt={excursion.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Location Badge */}
                {excursion.location && (
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 rounded-full shadow-lg flex items-center gap-1.5 border border-gray-200">
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                            {excursion.location}
                        </span>
                    </div>
                )}

                {/* Discount Badge */}
                {excursion.price && discountPercentage > 0 && (
                    <div className="absolute top-3 right-3">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {discountPercentage}% OFF
                        </span>
                    </div>
                )}

                {/* Rating Badge */}
                {excursion.rating > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
                        <Star className="w-4 h-4 fill-red-600 text-red-600" />
                        <span className="text-sm font-bold text-gray-900">{excursion.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Price Tag - Bottom Left */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-gray-200">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                            {formatPrice(excursion.price)}
                        </span>
                        <span className="text-[9px] text-gray-600 font-semibold">/day</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-0 group-hover:text-red-600 transition-colors leading-tight min-h-[3.5rem]">
                    {excursion.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {excursion.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-5 pb-5 border-b border-gray-100">
                    {/* Duration */}
                    {excursion.duration && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">{excursion.duration}</span>
                        </div>
                    )}

                    {/* Reviews */}
                    {excursion.reviewsCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">{excursion.reviewsCount} reviews</span>
                        </div>
                    )}

                    {/* Group Size */}
                    {excursion.groupSize && (
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">{excursion.groupSize}</span>
                        </div>
                    )}
                </div>

                {/* View Details Button */}
                <button
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 group-hover:from-red-600 group-hover:to-red-700 group-hover:text-white font-bold text-sm py-3 rounded-xl transition-all duration-300 border-2 border-gray-200 group-hover:border-transparent shadow-sm group-hover:shadow-md"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetail(excursion.id);
                    }}
                >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};