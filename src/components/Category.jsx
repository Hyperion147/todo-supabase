import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbCategory } from "react-icons/tb";
import { FaAngleRight } from "react-icons/fa";

const Category = ({ onFilterChange, todos, activeFilter: externalActiveFilter }) => {
    const [internalActiveFilter, setInternalActiveFilter] = useState("all");
    
    const activeFilter = externalActiveFilter !== undefined ? externalActiveFilter : internalActiveFilter;

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
        <div className="flex flex-col relative ml-0 sm:ml-5 w-full">
            <h2 className="mt-0 sm:mt-10 font-bold text-text tracking-wider flex items-center gap-1 text-lg sm:text-xl">
                <TbCategory /> Filters
            </h2>
            <hr />
            <div className="mt-4 space-y-2 flex flex-col">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => handleFilter(filter.id)}
                        className={`w-full px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center justify-between text-black text-sm sm:text-base ${
                            activeFilter === filter.id
                                ? filter.color
                                : "hover:bg-hover/30 text-text"
                        }`}
                    >
                        {filter.label}
                        <FaAngleRight className={`text-black ${activeFilter !== filter.id && "text-text"}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Category;
