import { useState } from "react";
import { LuSaveAll } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";

const Description = ({ todo, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...todo });
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (change) => {
        const { name, value, type, checked } = change.target;
        setEditedTask((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleDate = (change) => {
        const { name, value } = change.target;
        const date = new Date(editedTask.due_date || new Date());

        if (name === "date") {
            const [day, month, year] = value.split("-");
            date.setFullYear(day, month, year);
        } else if (name === "time") {
            const [hours, min] = value.split(":");
            date.setHours(hours, min);
        }
        setEditedTask((prev) => ({
            ...prev,
            due_date: date.toISOString(),
        }));
    };

    const handleSave = () => {
        onSave(editedTask);
        setIsEditing(false);
    };

    const formatDate = (dateS) => {
        if (!dateS) return "Not set";
        const date = new Date(dateS);
        return date.toLocaleDateString("en-US", {
            date: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };
    const formatTime = (timeS) => {
        if (!timeS) return "Not set";
        const time = new Date(timeS);
        return time.toLocaleTimeString("en-US", {
            hours: "2-digit",
            min: "2-digit",
        });
    };

    return (
        <div className="pl-10 mt-20">
            <div className="">
                {isEditing ? (
                    <div className="space-x-4">
                        <button onClick={handleSave} title="save">
                            <LuSaveAll className="w-6 h-6 text-black cursor-pointer" />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            title="cancel"
                        >
                            <ImCancelCircle className="w-6 h-6 text-black cursor-pointer" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)}>
                        <FiEdit className="w-6 h-6 text-black cursor-pointer" />
                    </button>
                )}
            </div>
            <div className=" flex flex-col">
                {isEditing ? (
                    <div className="">
                        <p className="mt-5 block text-xl font-medium text-gray-700">
                            Change Name
                        </p>
                        <input
                            input="text"
                            required={true}
                            name="name"
                            value={editedTask.name}
                            onChange={handleChange}
                            className="border-primary border-b-3 px-2 pb-1 text-xl text-primary/80 focus:outline-none mb-2"
                        />
                    </div>
                ) : (
                    <h2 className="text-5xl text-primary font-bold mb-2 capitalize">
                        {todo.name}
                    </h2>
                )}

                <div className="mb-4">
                    <label className="text-2xl font-medium text-gray-700">
                        Status
                    </label>
                    <div className="mt-1 text-sm font-bold text-gray-900 capitalize">
                        {todo.isCompleted ? (
                            <div className="flex">
                                <p className="bg-accent min-w-1 rounded-full mr-2"></p>
                                Completed
                            </div>
                        ) : (
                            <div className="flex">
                                <p className="mr-2 bg-warning/90 min-w-1 rounded-xl text-white"></p>
                                Pending
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-2xl font-medium text-gray-700">
                        Priority
                    </label>
                    {isEditing ? (
                        <div className="relative inline-block text-left w-full">
                            <div>
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-between rounded-md px-3 py-2 text-sm font-bold text-gray-900 shadow-lg ring-1 ring-primary ring-inset hover:bg-gray-90"
                                    id="priority-menu-button"
                                    aria-expanded="true"
                                    aria-haspopup="true"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {editedTask.priority === "high"
                                        ? "High"
                                        : editedTask.priority === "medium"
                                          ? "Medium"
                                          : "Low"}
                                    <svg
                                        className="-mr-1 h-5 w-5 text-primary"
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
                                            className={`${editedTask.priority === "low" ? "bg-yellow-100" : ""} block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50`}
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            <span className="inline-block h-3 w-3 rounded-full bg-yellow-300 mr-2"></span>
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
                                            className={`${editedTask.priority === "medium" ? "bg-green-100" : ""} block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-100`}
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            <span className="inline-block h-3 w-3 rounded-full bg-green-300 mr-2"></span>
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
                            className={`flex mt-1 text-md font-bold text-gray-900 capitalize`}
                        >
                            <p
                                className={`min-w-1 ${todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-500" : "bg-yellow-100"} rounded-full mr-2`}
                            ></p>
                            {todo.priority || "Low"}
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block font-medium text-gray-700 text-2xl">
                        Description
                    </label>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={editedTask.description || ""}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border-2 border-gray-700 rounded-sm focus:outline-none px-1 py-1 text-primary text-md resize-none"
                        ></textarea>
                    ) : (
                        <p className="mt-1 text-md text-gray-900">
                            {todo.description || "No description added."}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-2xl font-medium text-gray-700">
                        Due Date
                    </label>
                    {isEditing ? (
                        <input
                            type="date"
                            name="date"
                            value={
                                editedTask.due_date
                                    ? new Date(editedTask.due_date)
                                          .toISOString()
                                          .split("T")[0]
                                    : ""
                            }
                            onChange={handleDate}
                            className="text-primary w-full px-3 py-1 border rounded focus:outline-none"
                        ></input>
                    ) : (
                        <p className="mt-1 text-sm text-gray-900">
                            {todo.due_date
                                ? new Date(todo.due_date).toLocaleDateString()
                                : "No due date"}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-2xl font-medium text-gray-700">
                        Due Time
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                        {todo.due_date
                            ? new Date(todo.due_date).toLocaleTimeString()
                            : "No due date"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Description;
