import React from "react";

export default function BlueShaderBackground() {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden bg-[#020617]">
      {/* 
        Hero Background Image 
        - animate-pulse-slow: Adds a subtle breathing effect (zoom/scale)
        - object-cover: Ensures image covers screen
        - opacity-60: Blends with the dark background color for a moody look
      */}
      <div className="absolute inset-0 w-full h-full">
        <img 
            src="https://res.cloudinary.com/dxhlvrach/image/upload/v1763831510/backgroundgalo_a9ds1q.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80 animate-pulse-slow transform scale-105"
            style={{ animationDuration: '15s' }} 
        />
      </div>

      {/* 
        Professional Overlays 
        1. Radial Gradient: Focuses attention on the center/top
        2. Bottom Fade: Seamlessly blends the image into the rest of the page content
        3. Blue Tint: Reinforces the brand identity
      */}
      
      {/* Vignette / Darken Edges */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020617]/60 to-[#020617] mix-blend-multiply"></div>

      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>

      {/* Subtle Blue Tint Overlay */}
      <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Grain Texture for Cinematic Feel */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}