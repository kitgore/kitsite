import { onMount } from 'svelte';

// WebGL shader programs
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  
  uniform sampler2D u_image;
  uniform sampler2D u_bubbleMap;
  uniform vec2 u_resolution;
  uniform float u_scale;
  
  varying vec2 v_texCoord;
  
  void main() {
    // Displacement mapping
    vec4 displacement = texture2D(u_bubbleMap, v_texCoord);
    vec2 distortedCoord = v_texCoord + (displacement.rg - 0.5) * 0.1 * u_scale;
    
    // Sample the texture with fisheye distortion
    vec4 color = texture2D(u_image, distortedCoord);
    
    // Blue shift and dim
    mat4 colorMatrix = mat4(
      0.02, 0.0,  0.0,  0.0,
      0.0,  0.3,  0.0,  0.0,
      0.0,  0.0,  0.4,  0.0,
      0.0,  0.0,  0.0,  0.4
    );
    
    // Apply horizontal blur
    float blurAmount = 0.01;
    vec4 blur = vec4(0.0);
    for(float i = -4.0; i <= 4.0; i++) {
      vec2 offset = vec2(i * blurAmount, 0.0);
      blur += texture2D(u_image, distortedCoord + offset) * (1.0 - abs(i) / 5.0);
    }
    blur /= 9.0;
    
    // Combine effects
    vec4 finalColor = colorMatrix * mix(color, blur, 0.5);
    finalColor += vec4(0.1, 0.2, 0.3, 0.0) * texture2D(u_image, distortedCoord).a;
    
    gl_FragColor = finalColor;
  }
`;

export function createWebGLFilter(canvas, videoElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) return null;

  // Create shader program
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  // Set up buffers and attributes
  const positionBuffer = gl.createBuffer();
  const texCoordBuffer = gl.createBuffer();
  
  // Create textures
  const videoTexture = createTexture(gl);
  const bubbleTexture = createBubbleTexture(gl);

  // Set up uniforms
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const scaleLocation = gl.getUniformLocation(program, 'u_scale');

  function render() {
    // Update video texture
    updateTexture(gl, videoTexture, videoElement);
    
    // Draw
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(scaleLocation, 40.0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    requestAnimationFrame(render);
  }

  // Start render loop
  render();

  return {
    updateSize(width, height) {
      canvas.width = width;
      canvas.height = height;
    }
  };
}

// Helper functions for shader compilation and texture creation
function createShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  return program;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

function createBubbleTexture(gl) {
  // Create a temporary canvas to generate the bubble texture
  const bubbleCanvas = document.createElement('canvas');
  const ctx = bubbleCanvas.getContext('2d');
  bubbleCanvas.width = 256;
  bubbleCanvas.height = 256;
  
  // Generate bubble pattern
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(1, 'black');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  
  const texture = createTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bubbleCanvas);
  return texture;
}