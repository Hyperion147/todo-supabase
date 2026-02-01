import { useEffect, useState } from "react";
import { LuSaveAll } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { IoArrowBack } from "react-icons/io5";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import Calendar from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SubTodos from "./SubTodos";

const Description = ({ todo, onSave, onClose }) => {
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
                toast.error("Todo name cannot exceed 5 words!", { id: "desc-word-limit-error" });
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
        <div className="w-full h-full flex flex-col font-sans relative">
            {/* Mobile Navbar - Only on mobile/tablet */}
            <div className="lg:hidden sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between mb-4">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-text hover:text-text/70 transition-colors duration-200"
                >
                    <IoArrowBack className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </button>
                <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 sm:px-4 pb-20 lg:pb-0">
                {!todo && !isEditing ? (
                     <div className="h-full flex flex-col items-center justify-center text-text/50 gap-4">
                        <p className="text-lg">Select a task to view details</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start gap-4">
                                {isEditing ? (
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-text/50 uppercase tracking-wider mb-1 block">Title</label>
                                        <input
                                            type="text"
                                            required={true}
                                            name="name"
                                            value={editedTask.name}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b-2 border-primary/50 focus:border-primary px-0 py-2 text-2xl font-bold text-text focus:outline-none transition-all placeholder:text-text/30"
                                            placeholder="Task title"
                                        />
                                    </div>
                                ) : (
                                    <h2 className="text-2xl sm:text-3xl font-bold text-text capitalize leading-tight wrap-break-word flex-1">
                                        {todo.name}
                                    </h2>
                                )}
                                
                                <div className="flex bg-background/50 rounded-md border border-border/50 shrink-0 ml-2">
                                    {isEditing ? (
                                        <div className="flex">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="p-2 text-text/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                                title="Cancel"
                                            >
                                                <ImCancelCircle className="w-5 h-5" />
                                            </button>
                                            <div className="h-9 w-px bg-border"/>
                                            <button
                                                onClick={handleSave}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                                title="Save"
                                            >
                                                <LuSaveAll className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 text-text/60 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            {!isEditing && (
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${todo.isCompleted ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${todo.isCompleted ? "bg-green-500" : "bg-yellow-500"}`} />
                                        {todo.isCompleted ? "Completed" : "In Progress"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <hr className="border-border/50" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Priority Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text/50 uppercase tracking-wider flex items-center gap-2">
                                    Priority Level
                                </label>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        {["low", "medium", "high"].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => handleChange({ target: { name: "priority", value: p } })}
                                                className={`flex-1 px-2 py-1 rounded-md text-sm font-medium capitalize border transition-all ${
                                                    editedTask.priority === p 
                                                    ? p === 'high' ? "bg-red-500 text-white border-red-500" : p === 'medium' ? "bg-green-500 text-white border-green-500" : "bg-blue-500 text-white border-blue-500"
                                                    : "bg-transparent border-border text-text/60 hover:border-text/30"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md border ${
                                        todo.priority === "high" ? "bg-red-50 text-red-700 border-red-200" : 
                                        todo.priority === "medium" ? "bg-green-50 text-green-700 border-green-200" : 
                                        "bg-blue-50 text-blue-700 border-blue-200"
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                            todo.priority === "high" ? "bg-red-500" : 
                                            todo.priority === "medium" ? "bg-green-500" : 
                                            "bg-blue-500"
                                        }`} />
                                        <span className="capitalize font-medium">{todo.priority || "Low"}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text/50 uppercase tracking-wider">
                                    Description
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={editedTask.description || ""}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full bg-background border border-border rounded-md p-4 text-text/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm leading-relaxed"
                                        placeholder="Add a more detailed description..."
                                    ></textarea>
                                ) : (
                                    <div className="bg-background/50 border border-border/50 rounded-md p-4 min-h-25">
                                        <p className="text-text/80 text-sm leading-relaxed whitespace-pre-wrap">
                                            {todo.description || <span className="text-text/30 italic">No description added yet.</span>}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Subtasks Section */}
                            {!isEditing && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text/50 uppercase tracking-wider">
                                        Subtasks
                                    </label>
                                    <div className="bg-background/30 rounded-md">
                                        <SubTodos todo={todo} />
                                    </div>
                                </div>
                            )}

                            {/* Due Date Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text/50 uppercase tracking-wider">
                                    Due Date
                                </label>
                                {isEditing ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-md border transition-all ${
                                                    dueDate 
                                                    ? "bg-primary/5 border-primary/30 text-primary" 
                                                    : "bg-background border-border text-text/50 hover:border-text/30"
                                                }`}
                                            >
                                                <span className="font-medium text-sm">
                                                    {dueDate ? format(dueDate, "PPP") : "Set a deadline"}
                                                </span>
                                                <CalendarIcon className="w-4 h-4 opacity-70" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto bg-background border border-border shadow-xl rounded-md" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={handleDate}
                                                className="rounded-md border-none"
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <div className="flex items-center gap-3 text-text/80">
                                        <div className={`p-2 rounded-md ${todo.due_date ? "bg-primary/10 text-primary" : "bg-gray-500 text-gray-400"}`}>
                                            <CalendarIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {todo.due_date
                                                ? format(new Date(todo.due_date), "PPP")
                                                : "No deadline set"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Description;
