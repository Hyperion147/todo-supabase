import { useState } from "react";
import { TbCategory } from "react-icons/tb";
import { FaAngleRight } from "react-icons/fa";

const Category = ({
    onFilterChange,
    todos,
    activeFilter: externalActiveFilter,
}) => {
    const [internalActiveFilter, setInternalActiveFilter] = useState("all");

    const activeFilter =
        externalActiveFilter !== undefined
            ? externalActiveFilter
            : internalActiveFilter;

    const handleFilter = (priority) => {
        const newFilter = priority;
        setInternalActiveFilter(newFilter);
        onFilterChange(newFilter);
    };

    const filters = [
        { id: "all", label: "All Todos", color: "bg-hover" },
        { id: "high", label: "High", color: "bg-hover" },
        { id: "medium", label: "Medium", color: "bg-hover" },
        { id: "low", label: "Low", color: "bg-hover" },
        { id: "completed", label: "Completed", color: "bg-blue-200" },
    ];

    return (
        <div className="flex flex-col w-full">
            <h2 className="font-bold text-text tracking-wider flex items-center gap-1 text-lg sm:text-xl my-2">
                <TbCategory /> Filters
            </h2>
            <hr className="border-border opacity-50" />
            <div className="mt-4 space-y-2 flex flex-col">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => handleFilter(filter.id)}
                        className={`w-full px-3 sm:px-4 py-2 rounded-md transition-all duration-200 flex items-center justify-between text-sm sm:text-base ${
                            activeFilter === filter.id
                                ? `bg-opacity-100 ${filter.color} text-black font-medium shadow-sm`
                                : "hover:bg-hover/30 text-text opacity-70 hover:opacity-100"
                        }`}
                    >
                        {filter.label}
                        <FaAngleRight
                            className={`transition-transform duration-200 ${activeFilter === filter.id ? "text-black translate-x-1" : "text-text"}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Category;
