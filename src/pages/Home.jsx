import { useState } from "react";
import { Link } from "react-router-dom";
import Description from "../components/Description";
import Category from "../components/Category";
import Navbar from "../components/Navbar";
import Settings from "../components/Settings";
import Todos from "./Todos";

const Home = () => {
    const [selected, setSelected] = useState(null);

    return (
                <div className="flex flex-col min-w-full">
                    <div className="flex items-center border-border">
                        <div className="flex min-w-full justify-around">
                            <div className="min-w-[150px] border-r-2 border-primary">
                                <Category />
                            </div>
                            <main className="flex items-center justify-between mt-4">
                                <Todos onTodoSelect={setSelected} selected={selected} />
                            </main>
                            <div className="min-w-[350px] border-l-2 border-primary">
                                {selected && <Description todo={selected} />}
                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default Home;
