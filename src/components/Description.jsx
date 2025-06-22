import { useEffect, useState } from "react";
import { LuSaveAll } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import Calendar from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Description = ({ todo, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...todo });
    const [isOpen, setIsOpen] = useState(false);
    const [dueDate, setDueDate] = useState(
        editedTask.due_date ? new Date(editedTask.due_date) : null
    );

    useEffect(() => {
        if (!todo) {
            setEditedTask({
                name: "",
                isCompleted: false,
                priority: "low",
                description: "",
                due_date: null,
            });
            setDueDate(null);
            setIsEditing(false);
        } else {
            setEditedTask({ ...todo });
            setDueDate(todo.due_date ? new Date(todo.due_date) : null);
        }
    }, [todo]);

    const handleChange = (change) => {
        const { name, value, type, checked } = change.target;

        if (name == "name") {
            const words = value.trim().split(/\s+/);
            if (words.length > 5) {
                const truncatedInput = words.slice(0, 5).join(" ");
                setEditedTask((prev) => ({ ...prev, name: truncatedInput }));
                toast.error("Todo name cannot exceed 5 words!");
                return;
            }
        }
        setEditedTask((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleDate = (date) => {
        setDueDate(date);
        setEditedTask((prev) => ({
            ...prev,
            due_date: date ? date.toISOString() : null,
        }));
    };

    const handleSave = () => {
        const taskSave = {
            ...editedTask,
            due_date: dueDate ? dueDate.toISOString() : null,
        };
        onSave(taskSave);
        setIsEditing(false);
    };

    return (
        <div className="ml-8 mt-12 mr-10">
            {!todo && isEditing ? (
                <div className="text-text">No Todo Selected</div>
            ) : (
                <>
                    <div className="flex w-full justify-end">
                        {isEditing ? (
                            <div className="space-x-4 flex">
                                <button
                                    onClick={handleSave}
                                    title="save"
                                    className="
                        flex gap-2 mb-1 border border-primary rounded-md px-2 py-1 hover:bg-primary hover:text-background cursor-pointer font-bold"
                                >
                                    Save
                                    <LuSaveAll className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    title="cancel"
                                    className="flex gap-2 mb-1 border border-primary rounded-md px-2 py-1 hover:bg-primary hover:text-background cursor-pointer font-bold"
                                >
                                    Close
                                    <ImCancelCircle className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex gap-2 mb-1 border border-primary rounded-md px-2 py-1 hover:bg-primary hover:text-background cursor-pointer font-bold"
                            >
                                Edit
                                <FiEdit className="w-5 h-5 cursor-pointer" />
                            </button>
                        )}
                    </div>
                    <div className=" flex flex-col">
                        {isEditing ? (
                            <div className="">
                                <p className="mt-2 block text-xl font-medium text-text/70">
                                    Change Name
                                </p>
                                <input
                                    type="text"
                                    required={true}
                                    name="name"
                                    value={editedTask.name}
                                    onChange={handleChange}
                                    className="border-border border-b-3 px-2 pb-1 text-xl text-text focus:outline-none mb-2"
                                />
                            </div>
                        ) : (
                            <h2 className="text-4xl text-text font-bold mb-2 capitalize text-wrap w-60">
                                {todo.name}
                            </h2>
                        )}

                        <div className="mb-4">
                            <label className="text-2xl font-medium text-text/70">
                                Status
                            </label>
                            <div className="mt-1 text-sm font-bold text-text capitalize">
                                <div className="flex">
                                    <span
                                        className={`bg-accent min-w-1 rounded-full mr-2 transition-colors duration-200 ${todo.isCompleted ? "bg-cyan-400" : "bg-red-400"}`}
                                    ></span>
                                    <span className="transition-all duration-200">
                                        {todo.isCompleted
                                            ? "Completed"
                                            : "Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-2xl font-medium text-text/70">
                                Priority
                            </label>
                            {isEditing ? (
                                <div className="relative inline-block w-full">
                                    <div>
                                        <button
                                            type="button"
                                            className="inline-flex w-full rounded-md px-3 py-2 text-sm font-bold text-text shadow-lg ring-1 ring-border ring-inset hover:bg-gray-90 justify-between tracking-wider"
                                            id="priority-menu-button"
                                            aria-expanded="true"
                                            aria-haspopup="true"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            {editedTask.priority === "high"
                                                ? "High"
                                                : editedTask.priority ===
                                                    "medium"
                                                  ? "Medium"
                                                  : "Low"}
                                            <svg
                                                className="-mr-1 h-5 w-5 text-text/70"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {isOpen && (
                                        <div
                                            className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="priority-menu-button"
                                            tabIndex="-1"
                                        >
                                            <div className="py-1" role="none">
                                                <button
                                                    onClick={() => {
                                                        handleChange({
                                                            target: {
                                                                name: "priority",
                                                                value: "low",
                                                            },
                                                        });
                                                        setIsOpen(false);
                                                    }}
                                                    className={`${editedTask.priority === "low" ? "bg-blue-100" : ""} block w-full px-4 py-2 text-left text-sm text-black hover:bg-blue-200`}
                                                    role="menuitem"
                                                    tabIndex="-1"
                                                >
                                                    <span className="inline-block h-3 w-3 rounded-full bg-blue-400 mr-2"></span>
                                                    Low
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleChange({
                                                            target: {
                                                                name: "priority",
                                                                value: "medium",
                                                            },
                                                        });
                                                        setIsOpen(false);
                                                    }}
                                                    className={`${editedTask.priority === "medium" ? "bg-green-200" : ""} block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-200`}
                                                    role="menuitem"
                                                    tabIndex="-1"
                                                >
                                                    <span className="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                                                    Medium
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleChange({
                                                            target: {
                                                                name: "priority",
                                                                value: "high",
                                                            },
                                                        });
                                                        setIsOpen(false);
                                                    }}
                                                    className={`${editedTask.priority === "high" ? "bg-red-100" : ""} block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-100`}
                                                    role="menuitem"
                                                    tabIndex="-1"
                                                >
                                                    <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                                                    High
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className={`flex mt-1 text-md font-bold text-text capitalize`}
                                >
                                    <p
                                        className={`min-w-1 ${todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-500" : "bg-blue-200"} rounded-full mr-2`}
                                    ></p>
                                    {todo.priority || "Low"}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-text/70 text-2xl">
                                Description
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={editedTask.description || ""}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border-2 border-border rounded-sm focus:outline-none px-1 py-1 text-text text-md resize-none"
                                ></textarea>
                            ) : (
                                <p className="mt-1 text-md text-text">
                                    {todo.description ||
                                        "No description added."}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="due-date"
                                className="block text-2xl font-medium text-text/70"
                            >
                                Due Date
                            </label>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            id="due-date"
                                            className={`
                                    w-full mt-1 inline-flex items-center justify-between rounded-md border border-primary px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/50 cursor-pointer
                                    ${!dueDate ? "text-gray-500" : "text-primary"}`}
                                        >
                                            {dueDate
                                                ? format(dueDate, "PPP")
                                                : "Select a date"}
                                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto bg-primary border-none">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={handleDate}
                                            className="text-background w-full px-3 py-1 border-2 border-primary rounded focus:outline-none"
                                            disabled={(date) =>
                                                date <
                                                new Date(
                                                    new Date().setHours(
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    )
                                                )
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <p className="mt-1 text-sm text-text">
                                    {todo.due_date
                                        ? new Date(
                                              todo.due_date
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "No due date"}
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Description;
