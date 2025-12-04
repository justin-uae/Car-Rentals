export const OrderCardSkeleton = () => (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-600 animate-pulse rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-600 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-xl"></div>
                    <div className="h-6 sm:h-8 bg-white/20 rounded-lg w-32 sm:w-40"></div>
                </div>
                <div className="h-5 bg-white/20 rounded-lg w-24 sm:w-32 ml-9 sm:ml-0"></div>
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-white">
            {[1, 2].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <div className="w-full sm:w-24 md:w-28 h-48 sm:h-24 md:h-28 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                            <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-32"></div>
                </div>
            </div>
        </div>
    </div>
);