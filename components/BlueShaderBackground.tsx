import React, { useEffect, useRef, useState } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iClickPos;
  uniform float iClickTime;

  // Smooth noise function
  float noise(vec2 p) {
    // Fixed smoothstep range from user snippet (likely typo 80.9 -> 0.9 or 1.0)
    return smoothstep(-0.5, 1.0, sin((p.x - p.y) * 5.0) * sin(p.y * 4.0)) - 0.4;
  }

  // Fabric texture generator
  float fabric(vec2 p) {
    // Standard rotation matrix for silk shaders
    mat2 m = mat2(0.6, 0.2, 0.2, -0.6);
    float f = 0.2 * noise(p);
    f += 0.3 * noise(p = m * p);
    f += 0.1 * noise(p = m * p);
    return f + 0.1 * noise(m * p);
  }

  // Main silk pattern
  float silk(vec2 uv, float t) {
    float s = sin(5.0 * (uv.x + uv.y + cos(2.0 * uv.x + 5.0 * uv.y)) + sin(19.0 * (uv.x + uv.y)) - t);
    s = 0.7 + 1.2 * (s * s * 0.05 + s);
    s *= 0.8 - 0.2 * fabric(uv * min(iResolution.x, iResolution.y) * 0.0006);
    return s * 0.8 + 0.5;
  }

  // Derivative/Edge function for "Bloodline" style sharpness
  float silkd(vec2 uv, float t) {
    float xy = uv.x + uv.y;
    float d = (-1.0 * (1.0 - 2.0 * sin(20.0 * uv.x + -5.0 * uv.y)) + 14.0 * cos(12.0 * xy)) * 
              cos(5.0 * (cos(-8.0 * uv.x + 5.0 * uv.y) + xy) + sin(-1.0 * xy) - t);
    return 0.1 * d * (sign(d) * -2.0);
  }

  void main() {
    float mr = min(iResolution.x, iResolution.y);
    vec2 uv = gl_FragCoord.xy / mr;
    float t = iTime * 0.5; // Speed control
    
    // Dynamic movement
    uv.y += 0.001 * sin(2.0 * uv.x - t);
    
    // Interaction Ripple
    float timeSinceClick = iTime - iClickTime;
    if (timeSinceClick < 3.0 && iClickTime > 0.0) {
      vec2 clickUv = iClickPos / mr;
      float dist = distance(clickUv, uv);
      float ripple = sin(dist * 40.0 - timeSinceClick * 5.0) * exp(-dist * 10.0 - timeSinceClick * 2.0);
      uv += normalize(uv - clickUv) * ripple * 0.05;
    }
    
    // Base Silk Calculation
    float s = silk(uv, t);
    s = max(0.0, s); // Prevent NaN in sqrt
    s = sqrt(s);
    
    // Detail/Derivative
    float d = silkd(uv, t);
    
    // Color Composition
    vec3 c = vec3(s);
    
    // Add Blue/Cyan Tints based on derivative
    // Original Red: c += 0.7 * vec3(1.0, -0.83, -4.6) * d;
    // Blue Adaptation: Boost Blue (z), Maintain Green/Cyan (y), Suppress Red (x)
    c += 0.5 * vec3(-2.0, 0.2, 1.5) * d;
    
    // Contrast
    c *= 1.0 - max(0.0, 1.5 * d);
    
    // Final Grading (Dark Mode)
    // pow(c, vec3(R, G, B)) -> Lower exponent = Brighter channel
    // We want bright Blue, medium Green, dark Red
    c = max(vec3(0.0), c); // Safety clamp before pow
    c = pow(c, vec3(1.8, 0.9, 0.5)); 
    
    // Slight boost to overall brightness for visibility
    c += vec3(0.02, 0.05, 0.1);

    gl_FragColor = vec4(c, 1.0);
  }
`;

export default function BlueShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iClickPosLocation = gl.getUniformLocation(program, 'iClickPos');
    const iClickTimeLocation = gl.getUniformLocation(program, 'iClickTime');

    const clickPos = { x: 0, y: 0 };
    let clickTime = 0;
    const startTime = Date.now();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const handleMouseDown = (e: MouseEvent) => { 
      const dpr = window.devicePixelRatio || 1;
      clickPos.x = e.clientX * dpr;
      clickPos.y = (window.innerHeight - e.clientY) * dpr;
      clickTime = (Date.now() - startTime) / 1000;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleMouseDown);

    let animationId: number;
    const render = () => {
      // Ensure viewport is correct every frame in case of unforeseen resizes
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, (Date.now() - startTime) / 1000);
      gl.uniform2f(iClickPosLocation, clickPos.x, clickPos.y);
      gl.uniform1f(iClickTimeLocation, clickTime);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      // Clean up GL resources if needed, though usually context loss handles it on refresh
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none bg-black" 
      style={{ display: 'block' }} 
    />
  );
}
