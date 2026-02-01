const DescriptionSkeleton = () => {
    return (
        <div className="w-full h-full flex flex-col font-sans relative overflow-hidden">
            {/* Mobile Navbar Skeleton */}
            <div className="lg:hidden sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between mb-4">
                <div className="h-5 w-16 bg-gray-200/50 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200/50 rounded animate-pulse"></div>
                <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 sm:px-4 pb-20 lg:pb-0">
                <div className="flex flex-col gap-6 animate-pulse">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                                {/* Title Skeleton */}
                                <div className="h-8 w-3/4 bg-gray-200/50 rounded-md text-center pt-1">Click on a todo to view</div>
                                {/* Status Badge Skeleton */}
                                <div className="h-6 w-24 bg-gray-200/50 rounded-full"></div>
                            </div>
                            
                            {/* Action Button Skeleton */}
                            <div className="h-9 w-9 bg-gray-200/50 rounded-md shrink-0 ml-2"></div>
                        </div>
                    </div>

                    <hr className="border-border/30" />

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Priority Section */}
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/50 rounded"></div>
                            <div className="h-9 w-32 bg-gray-200/50 rounded-md"></div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/50 rounded"></div>
                            <div className="h-24 w-full bg-gray-200/50 rounded-md"></div>
                        </div>

                        {/* Subtasks Section */}
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200/50 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-12 w-full bg-gray-200/50 rounded-md"></div>
                                <div className="h-12 w-full bg-gray-200/50 rounded-md"></div>
                            </div>
                        </div>

                        {/* Due Date Section */}
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200/50 rounded"></div>
                            <div className="h-10 w-48 bg-gray-200/50 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescriptionSkeleton;
