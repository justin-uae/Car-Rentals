import { RentalsCardSkeleton } from "./RentalsCardSkeleton";

export const FilterSidebarSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg w-24"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg w-16"></div>
        </div>

        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-xl border-2 border-gray-200"></div>
            ))}
        </div>
    </div>
);

// Hero Section Skeleton
export const HeroSectionSkeleton = () => (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-600 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            {/* Badge skeleton */}
            <div className="flex justify-center mb-6">
                <div className="h-10 bg-white/20 backdrop-blur-sm rounded-full w-64 animate-pulse"></div>
            </div>

            {/* Title skeleton */}
            <div className="h-14 bg-white/20 backdrop-blur-sm rounded-2xl w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 bg-white/15 backdrop-blur-sm rounded-xl w-80 mx-auto mb-8 animate-pulse"></div>

            {/* Search bar skeleton */}
            <div className="h-16 bg-white/30 backdrop-blur-sm rounded-2xl w-full max-w-2xl mx-auto animate-pulse shadow-xl"></div>
        </div>
    </div>
);

// Full Loading State with Skeleton
export const LoadingStateWithSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
        <style>{`
            @keyframes shimmer {
                0% {
                    background-position: -1000px 0;
                }
                100% {
                    background-position: 1000px 0;
                }
            }

            .animate-pulse {
                animation: shimmer 2s infinite;
                background-size: 1000px 100%;
            }
        `}</style>

        {/* Hero Skeleton */}
        <HeroSectionSkeleton />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                    <FilterSidebarSkeleton />
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Sort and Results Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-full"></div>
                            <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg w-48"></div>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-xl w-56 border-2 border-gray-200"></div>
                    </div>

                    {/* Active Filters Skeleton */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-full w-32 border-2 border-gray-200 flex-shrink-0"></div>
                        ))}
                    </div>

                    {/* Cards Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <RentalsCardSkeleton key={index} />
                        ))}
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    </div>
);