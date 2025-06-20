import { createCanvas, loadImage } from 'canvas';
import { readdir, mkdirSync, existsSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Color configuration
const DITHER_COLORS = {
    dark: '#013B42',   // Dark teal
    light: '#DCF9FF'   // Light blue
};

// Blur amount (pixels)
const BLUR_RADIUS = 1;
const BLUR_PASSES = 3;  // Multiple passes for stronger effect

// Convert hex color to RGB object
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Convert RGB to grayscale value (0-255)
function rgbToGrayscale(r, g, b) {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function boxBlur(imageData, radius) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    
    // Horizontal blur
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0;
            let count = 0;
            
            for (let i = -radius; i <= radius; i++) {
                const px = x + i;
                if (px >= 0 && px < width) {
                    const idx = (y * width + px) * 4;
                    rSum += data[idx];
                    gSum += data[idx + 1];
                    bSum += data[idx + 2];
                    count++;
                }
            }
            
            const outIdx = (y * width + x) * 4;
            output[outIdx] = rSum / count;
            output[outIdx + 1] = gSum / count;
            output[outIdx + 2] = bSum / count;
            output[outIdx + 3] = data[outIdx + 3];
        }
    }
    
    // Vertical blur
    const temp = new Uint8ClampedArray(output);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let rSum = 0, gSum = 0, bSum = 0;
            let count = 0;
            
            for (let i = -radius; i <= radius; i++) {
                const py = y + i;
                if (py >= 0 && py < height) {
                    const idx = (py * width + x) * 4;
                    rSum += temp[idx];
                    gSum += temp[idx + 1];
                    bSum += temp[idx + 2];
                    count++;
                }
            }
            
            const outIdx = (y * width + x) * 4;
            data[outIdx] = rSum / count;
            data[outIdx + 1] = gSum / count;
            data[outIdx + 2] = bSum / count;
            data[outIdx + 3] = temp[outIdx + 3];
        }
    }
    
    return imageData;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, '..', 'static');
const outputDir = join(__dirname, '..', 'static', 'dithered');

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

function floydSteinbergDither(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Convert hex colors to RGB once before the loop
    const darkColor = hexToRgb(DITHER_COLORS.dark);
    const lightColor = hexToRgb(DITHER_COLORS.light);
    
    // Create a separate buffer for grayscale values to avoid corrupting the error diffusion
    const grayscaleBuffer = new Float32Array(width * height);
    
    // First convert to grayscale
    for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        grayscaleBuffer[i] = rgbToGrayscale(data[idx], data[idx + 1], data[idx + 2]);
    }
    
    // Now perform dithering on the grayscale buffer
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * width + x;
            const oldPixel = grayscaleBuffer[i];
            
            // Determine if we should use light or dark color
            const useLight = oldPixel > 127;
            const newColor = useLight ? lightColor : darkColor;
            
            // Set the color in the original buffer
            const idx = i * 4;
            data[idx] = newColor.r;
            data[idx + 1] = newColor.g;
            data[idx + 2] = newColor.b;
            
            // Calculate error
            const error = oldPixel - (useLight ? 255 : 0);
            
            // Distribute error
            if (x < width - 1) {
                grayscaleBuffer[i + 1] += error * 7/16;
            }
            if (y < height - 1) {
                if (x > 0) {
                    grayscaleBuffer[i + width - 1] += error * 3/16;
                }
                grayscaleBuffer[i + width] += error * 5/16;
                if (x < width - 1) {
                    grayscaleBuffer[i + width + 1] += error * 1/16;
                }
            }
        }
    }
    
    return imageData;
}

async function ditherImage(inputPath) {
    const filename = basename(inputPath);
    const outputPath = join(outputDir, filename);

    try {
        // Load the image
        const image = await loadImage(inputPath);
        
        // Create canvas
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        // Draw image
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply Floyd-Steinberg dithering
        floydSteinbergDither(imageData);
        
        // Apply multiple passes of box blur for a stronger Gaussian-like effect
        for (let i = 0; i < BLUR_PASSES; i++) {
            boxBlur(imageData, BLUR_RADIUS);
        }
        
        // Put the processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Save the image
        const buffer = canvas.toBuffer('image/png');
        writeFileSync(outputPath, buffer);
        
        console.log(`Processed: ${filename}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

// Process all images in the input directory
readdir(inputDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            ditherImage(join(inputDir, file));
        }
    });
}); 