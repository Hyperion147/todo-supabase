

const Description = ({ todo }) => {
    return (
        <div className="pl-10 flex flex-col mt-20">
            <h2 className="text-5xl text-primary font-bold mb-2 capitalize">
                {todo.name}
            </h2>

            <div className="mb-4">
                <label className="block text-2xl font-medium text-gray-700">
                    Status
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                    {todo.isCompleted ? <div className="flex"><p className="bg-accent min-w-1 rounded-full font-bold mr-2"></p>Completed</div> : <div className="flex"><p className="mr-2 bg-warning/90 min-w-1 rounded-xl text-white font-bold"></p>Pending</div>}
                </p>
            </div>
            <div className="mb-4">
                <label className="block text-2xl font-medium text-gray-700">
                    Priority
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                    {todo.priority || "Low"}
                </p>
            </div>
            <div className="mb-4">
                <label className="block font-medium text-gray-700 text-2xl">
                    Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                    {todo.description || "No description added."}
                </p>
            </div>

            <div className="mb-4">
                <label className="block text-2xl font-medium text-gray-700">
                    Due Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                    {todo.due_date
                        ? new Date(todo.due_date).toLocaleDateString()
                        : "No due date"}
                </p>
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
    );
};

export default Description;
