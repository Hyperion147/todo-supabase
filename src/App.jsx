import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { Toaster } from "react-hot-toast";
import Todos from "./pages/Todos"
import Navbar from "./components/Navbar"
import { cn } from "./components/ui/utils";
import "./App.css";

function App() {
  return (
    <>
      <Router>
          <div className="min-h-screen bg-background text-text overflow-hidden relative z-10">
            <div
              className="fixed inset-0 bgImg bg-cover bg-center opacity-30 -z-10"
              aria-hidden="true"
            ></div>
            <div
              className={cn(
                "absolute inset-0 opacity-30 -z-10",
                "[background-size:50px_50px]",
                "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
              )}
            />
            <Navbar />
            <Toaster position="bottom-right" />
            <Routes>
              <Route path="/" element={<Todos />} />
            </Routes>
          </div>
      </Router>
    </>
  );
}

export default App;
