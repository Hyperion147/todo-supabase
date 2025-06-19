import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";

const Category = ({ todos }) => {
    const [categoryTodo, setCategoryTodo] = useState({
        high: [],
        medium: [],
        low: [],
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const category = {
            high: todos.filter((todo) => todo.priority === "high"),
            medium: todos.filter((todo) => todo.priority === "medium"),
            low: todos.filter((todo) => todo.priority === "low"),
        };
        setCategoryTodo(category);
    }, [todos]);

    const toggle = (category) => {
        setOpen(open === category ? null : category);
    };

    const getColor = (priority) => {
        switch (priority) {
            case "high":
                return "bg-red-500";
            case "low":
                return "bg-blue-200";
            case "medium":
                return "bg-green-500";
        }
    };

    return (
        <div className="flex flex-col relative ml-5">
            <h2 className="mt-10 font-bold text-primary flex items-center gap-1">
                <TbCategory /> Categories
            </h2>
            {/* <div className="mt-4">
                <button
                    type="button"
                    className="text-xl font-bold border-b-2 rounded-b-sm px-2 shadow-gray-700 flex gap-4 justify-between items-center cursor-pointer w-40 hover:from-red-200 hover:bg-gradient-to-t"
                    onClick={() => categoryTodo.high.length > 0 ? toggle("high") : toast.error("No High Priority Todos!")}
                    aria-expanded={open === "high"}
                >
                    High {open ? <FaAngleUp /> : <FaAngleDown />}
                </button>
                {open === "high" && (
                    <ul
                        className="absolute z-10 max-h-56 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-hidden sm:text-sm "
                        tabindex="-1"
                        role="listbox"
                        aria-labelledby="listbox-label"
                        aria-activedescendant="listbox-option-3"
                    >
                      {categoryTodo.high.length > 0 ? 
                        (categoryTodo.high.map((todo) => (
                            <li
                                key={todo.id}
                                className="relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none bg-red-200"
                                id="listbox-option-0"
                            >
                                <p className="text-2xl">{todo.name}</p>
                            </li>
                        ))) : ""
                      }
                    </ul>
                )}

                <button className="text-xl font-bold border-b-2 rounded-b-sm px-2 shadow-gray-700 flex gap-4 justify-between items-center cursor-pointer w-40">
                    Medium <FaAngleDown />
                </button>
                <ul>
                    {categoryTodo.medium.map((todo) => (
                        <li key={todo.id}>
                            <p>{todo.name}</p>
                        </li>
                    ))}
                </ul>
                <button className="text-xl font-bold border-b-2 rounded-b-sm px-2 shadow-gray-700 flex gap-4 justify-between items-center cursor-pointer w-40">
                    Low <FaAngleDown />
                </button>
                <ul>
                    {categoryTodo.low.map((todo) => (
                        <li key={todo.id}>
                            <p>{todo.name}</p>
                        </li>
                    ))}
                </ul>
            </div> */}
            <div>
                {console.log(todos.isCompleted)}
            </div>
        </div>
    );
};

export default Category;
