import React from 'react';

const ColorBox = ({ color }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color}`);
  };

  return (
    <div
      className="w-32 h-32 rounded-xl cursor-pointer shadow-lg"
      onClick={copyToClipboard}
      style={{ backgroundColor: color }}
      title="Click to copy"
    >
      <p className="text-sm text-white text-center pt-28 font-bold drop-shadow-lg">
        {color}
      </p>
    </div>
  );
};

export default ColorBox;