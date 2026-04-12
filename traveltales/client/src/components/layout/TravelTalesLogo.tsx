import React from "react";

type Props = {
  className?: string;
};

const TravelTalesLogo: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 420 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <defs>
        {/* Neon glow for dark mode */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Curved travel path integrated */}
      <path
        d="M40 70 Q140 10 260 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5,5"
        className="opacity-60 dark:opacity-80"
      />

      {/* Airplane at end of path */}
      <g
        transform="translate(255,55) rotate(20)"
        className="dark:[filter:url(#glow)]"
      >
        <path d="M0 0 L16 5 L0 10 L5 5 Z" fill="currentColor" />
      </g>

      {/* Main Logo Text */}
      <text
        x="40"
        y="85"
        fontSize="36"
        fontWeight="600"
        fontFamily="Poppins, Segoe UI, sans-serif"
        fill="currentColor"
        letterSpacing="1"
      >
        Travel
        <tspan className="fill-sky-500 dark:fill-cyan-400">
          Tales
        </tspan>
      </text>
    </svg>
  );
};

export default TravelTalesLogo;