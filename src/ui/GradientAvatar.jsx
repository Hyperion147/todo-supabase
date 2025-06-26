//Created with AI

export const GradientAvatar = ({width, height}) => {
  const randomHue = () => Math.floor(Math.random() * 360);
  const color1 = `hsl(${randomHue()}, 70%, 60%)`;
  const color2 = `hsl(${randomHue()}, 70%, 60%)`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full shadow-md bg-border"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#gradient)" />
    </svg>
  );
};