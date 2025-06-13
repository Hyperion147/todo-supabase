import { useEffect } from 'react';
import gsap from 'gsap';

const Loading = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onComplete();
        }, 300)
      }
    })

    gsap.set('.loading-content', { opacity: 0, y: 20 });
    gsap.set('.loading-image', { opacity: 0, scale: 0.8 });
    gsap.set('.loading-bar', { width: 0 });

    tl.to('.loading-content', { opacity: 1, y: 0, duration: 0.4 })
      .to('.loading-image', { opacity: 1, scale: 1, duration: 0.3 }, '-=0.2')
      .to('.loading-bar', { width: '100%', duration: 0.6, ease: 'power2.out' }, '-=0.1');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className='fixed inset-0 z-50 text-gray-100 flex flex-col items-center justify-center gap-4'>
      <div className='loading-content flex items-center gap-4'>
        <img 
          src="/apple-touch-icon.png" 
          alt="Todo App"
          className='loading-image w-16 h-16 object-contain'
        />
        <h1 className='text-4xl font-bold font-mono tech'>TODO APP</h1>
      </div>
      
      <div className='w-[280px] h-[2px] bg-blue-200 rounded relative overflow-hidden'>
        <div className='loading-bar h-full bg-purple-500 shadow-[0_0_15px_#3b82f6]'></div>
      </div>
    </div>
  );
};

export default Loading;