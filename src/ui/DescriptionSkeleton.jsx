const DescriptionSkeleton = () => {
    return (
        <>
            <div className="my-10 px-4">
                <p className="mt-2 block text-2xl font-medium text-text decoration-dashed underline pb-2">
                    Select todo to edit!!!
                </p>
                <div className="h-8 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="px-4 mt-10">
                <div className="flex flex-col space-y-6">
                    <div>
                        <label className="text-2xl font-medium text-gray-400">
                            Status
                        </label>
                        <div className="mt-1">
                            <div className="flex items-center">
                                <span className="h-4 w-4 bg-gray-200 rounded-full mr-2"></span>
                                <span className="h-4 w-20 bg-gray-200 rounded"></span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-2xl font-medium text-gray-400">
                            Priority
                        </label>
                        <div className="mt-1">
                            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-400 text-2xl">
                            Description
                        </label>
                        <div className="mt-1">
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-2xl font-medium text-gray-400">
                            Due Date
                        </label>
                        <div className="mt-1">
                            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DescriptionSkeleton;
