import React from "react";

export default function BlueShaderBackground() {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden">
      {/* 
        Gradiente Animado 
        - animate-gradient-xy: Move a posição do background
        - bg-[length:400%_400%]: Aumenta o tamanho para permitir o movimento
      */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-[#0c2a4d] to-[#020617] bg-[length:400%_400%] animate-gradient-xy opacity-100"></div>
      
      {/* Overlay de Ruído/Textura opcional para dar aspecto mais profissional (opacidade bem baixa) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}