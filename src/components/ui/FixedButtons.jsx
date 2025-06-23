import { FaGithub } from 'react-icons/fa';

const FixedButtons = () => {
  return (
    <div className="fixed bottom-7 left-7 flex flex-col z-50">
      <div className='relative group'>
        <span 
          className="absolute -inset-[2px] rounded-full animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#cbeaff_0%,#2c536a_50%,#c0f9ff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
        <a
          href="https://github.com/Hyperion147/todo-supabase"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex bg-text text-background hover:bg-text/50 p-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
          aria-label="GitHub"
        >
          <FaGithub className="w-4 h-4 md:w-5 md:h-5 " />
        </a>
      </div>
    </div>
  );
};

export default FixedButtons;