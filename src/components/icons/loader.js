import React from 'react';

const FancyLoader = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="120px"
    height="120px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" r="32" stroke="#1d3f72" strokeWidth="8" fill="none">
      <animate
        attributeName="stroke-dashoffset"
        dur="1.5s"
        repeatCount="indefinite"
        from="0"
        to="502"
      />
      <animate
        attributeName="stroke-dasharray"
        dur="1.5s"
        repeatCount="indefinite"
        values="150.6 100.4;1 250;150.6 100.4"
      />
    </circle>
  </svg>
);

export default FancyLoader;
