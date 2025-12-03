export const RentalsCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-100 hover:shadow-2xl transition-shadow">
        {/* Image Skeleton */}
        <div className="relative h-56 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse">
            {/* Location Badge Skeleton - Top Left */}
            <div className="absolute top-3 left-3">
                <div className="h-7 w-24 bg-white/70 backdrop-blur-sm rounded-full border border-amber-200"></div>
            </div>

            {/* Discount Badge Skeleton - Top Right */}
            <div className="absolute top-3 right-3">
                <div className="h-7 w-20 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full"></div>
            </div>

            {/* Rating Badge Skeleton - Bottom Right */}
            <div className="absolute bottom-3 right-3">
                <div className="h-8 w-16 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200"></div>
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-5">
            {/* Title */}
            <div className="h-7 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-lg w-3/4 mb-3"></div>

            {/* Description Lines */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded-md w-full"></div>
                <div className="h-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded-md w-5/6"></div>
            </div>

            {/* Icons Row - Meta Information */}
            <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded w-16"></div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded w-20"></div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded w-16"></div>
                </div>
            </div>

            {/* Price and Button */}
            <div className="flex items-center justify-between pt-5 border-t-2 border-amber-100">
                <div className="space-y-2">
                    <div className="h-9 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-lg w-24"></div>
                    <div className="h-3 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 animate-pulse rounded w-20"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 animate-pulse rounded-xl w-32 shadow-md"></div>
            </div>
        </div>
    </div>
);