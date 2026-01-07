# Todo App with Supabase

A task management application built with React and powered by Supabase. This application offers a seamless experience for managing daily tasks with features like prioritization, subtasks, due dates, and real-time synchronization.

## Features

- **User Authentication**: Secure sign-up and login functionality using Supabase Auth.
- **Task Management**: Create, read, update, and delete tasks effortlessly.
- **Subtasks**: Break down main tasks into smaller, manageable subtasks.
- **Prioritization**: Assign priority levels (Low, Medium, High) to tasks to stay organized.
- **Due Dates**: Set deadlines for tasks to ensure timely completion.
- **Filtering**: Filter tasks by status (All, Active, Completed) or priority.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.
- **Modern UI**: Features a sleek interface with glassmorphism effects and smooth animations.

## Tech Stack

- **Frontend**: React, Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL Database, Authentication)
- **Animations**: GSAP, CSS Transitions
- **Icons**: React Icons, Lucide React
- **Date Handling**: date-fns
- **UI Components**: Radix UI Primitives

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/todo-supabase.git
    cd todo-supabase
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Usage

- **Sign Up/Login**: Create a new account or log in with existing credentials.
- **Add Task**: Use the input field at the top to create new tasks.
- **Edit Task**: Click on a task to view details, add subtasks, set due dates, or change priority.
- **Filter**: Use the sidebar (desktop) or filter menu (mobile) to view specific tasks.
- **Complete/Delete**: Check the box to complete a task or hover to see the delete option.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate optimized static files in the `dist` directory.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is open-source and available under the MIT License.
