import React, { useRef, useState } from 'react';
import ColorThief from 'color-thief-browser';

const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const generateCircles = () => {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: generateRandomColor(),
    top: Math.random() * 100,
    left: Math.random() * 90,
    size: 30 + Math.random() * 70,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
  }));
};

const App = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [circles] = useState(generateCircles());
  const [imagePreview, setImagePreview] = useState(null);
  const [palette, setPalette] = useState([]);
  const imageRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const extractColors = async () => {
    try {
      const thief = new ColorThief();
      const colors = await thief.getPalette(imageRef.current, 6);
      const hexColors = colors.map(([r, g, b]) =>
        `#${((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)}`
      );
      setPalette(hexColors);
    } catch (error) {
      console.error("Color extraction failed:", error);
    }
  };

  return (
    <div className="w-screen h-screen max-w-full bg-blue-950 relative overflow-hidden text-white font-chillax">
      {/* Animated background circles */}
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full opacity-70 animate-blink pointer-events-none"
          style={{
            top: `${circle.top}%`,
            left: `${circle.left}%`,
            backgroundColor: circle.color,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            animationDelay: `${circle.delay}s`,
            animationDuration: `${circle.duration}s`,
          }}
        />
      ))}

      {/* Content container scrollable if needed */}
      <div className="absolute inset-0 overflow-y-auto">
        {!showUploader ? (
          <div className="h-screen w-full flex flex-col items-center justify-center z-10 relative text-center bg-black/30 backdrop-blur-sm px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🎨 Magic Color Palette</h1>
            <p className="mb-6 text-md md:text-lg text-gray-200">
              Upload an image to reveal its beautiful palette
            </p>
            <button
              onClick={() => setShowUploader(true)}
              className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition drop-shadow-md text-sm md:text-base"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="w-full h-screen flex items-center justify-center z-10 p-4">
            <div className="overflow-y-auto max-h-[90vh] backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-xl text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Upload an Image</h1>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4 w-full text-sm text-gray-200"
              />
              {imagePreview && (
                <>
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Uploaded"
                    crossOrigin="anonymous"
                    className="w-full max-w-xs max-h-[300px] object-cover rounded-xl mx-auto mb-4 border border-white/20 shadow-lg"
                  />
                  <button
                    onClick={extractColors}
                    className="bg-white text-blue-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold text-sm md:text-base"
                  >
                    Extract Colors 🎨
                  </button>
                </>
              )}

              {palette.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3">Extracted Palette:</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {palette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-inner border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                        <p className="mt-2 text-xs md:text-sm">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
