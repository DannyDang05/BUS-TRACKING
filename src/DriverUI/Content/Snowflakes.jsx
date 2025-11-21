import React, { useEffect, useState } from 'react';

const winterStyles = `
  @keyframes snowfall {
    0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh) translateX(100px); opacity: 0; }
  }
  .snowflake {
    position: fixed;
    top: -10vh;
    color: #fff;
    font-size: 1.5em;
    font-family: Arial;
    text-shadow: 0 0 5px rgba(200, 220, 255, 0.8);
    z-index: 9999;
    user-select: none;
    pointer-events: none;
    animation: snowfall linear infinite;
  }
`;

const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = winterStyles;
    document.head.appendChild(style);

    const flakes = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 0.8 + Math.random() * 0.6
    }));
    setSnowflakes(flakes);

    return () => style.remove();
  }, []);

  return (
    <>
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            fontSize: `${flake.size}em`
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};

export default Snowflakes;
