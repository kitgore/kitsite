<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import TwoColumnLayout from '../components/TwoColumnLayout.svelte';
    import Home from '../components/Home.svelte';

    let innerHeight;
    let innerWidth;
    let baseFontSize = 20; // Base font size in pixels
    let fontSizeScale;
    let blurAmount = 0;
    let glowIntensity = 1; // Base intensity multiplier
    let isFlickering = false;
    let nextFlickerTime = 0;
    let flickerCount = 0;
    let maxFlickers = 0;

    $: if (browser) {
        updateFilterScaling(innerHeight, innerWidth);
        updateFontSize(innerHeight);
    }

    function updateFilterScaling(height, width) {
        if (!browser) return;

        const baseHeight = 1080;
        const baseWidth = 1920;  
        const scaleFactor = Math.min(height / baseHeight, width / baseWidth);
        
        document.documentElement.style.setProperty('--scale-factor', scaleFactor.toString());

        // Update SVG filter parameters
        requestAnimationFrame(() => {
            const filter = document.getElementById('motion-blur-filter');
            if (filter) {
                const displacementMap = filter.querySelector('#displacement-map');
                if (displacementMap) {
                    const mapWidth = 200 * scaleFactor;
                    const mapHeight = 200 * scaleFactor;
                    displacementMap.setAttribute('width', `${mapWidth}%`);
                    displacementMap.setAttribute('height', `${mapHeight}%`);
                    displacementMap.setAttribute('x', `-${mapWidth / 2}%`);
                    displacementMap.setAttribute('y', `-${mapHeight / 2 + 5}%`);
                }

                const displacementEffect = filter.querySelector('#displacement-effect');
                if (displacementEffect) {
                    const newScale = 35 * scaleFactor;
                    displacementEffect.setAttribute('scale', newScale.toString());
                }

                const blurEffect = filter.querySelector('#blur-effect');
                if (blurEffect) {
                    const newBlur = `${30 * scaleFactor} ${0.2 * scaleFactor}`;
                    blurEffect.setAttribute('stdDeviation', newBlur);
                }
            }
        });
    }

    function updateFontSize(height) {
        if (!browser) return;

        const baseHeight = 1080; // Base height for scaling (e.g., 1080p)
        fontSizeScale = height / baseHeight;
        
        // Update CSS custom property for font size scaling
        document.documentElement.style.setProperty('--font-size-scale', fontSizeScale.toString());
    }

    function createFlickerBurst(timestamp) {
        // Create a burst of flickers with variable length
        // More natural flicker patterns with occasional deeper flickers
        
        // Choose a flicker pattern type (regular, severe, or brief)
        const patternType = Math.random();
        
        if (patternType < 0.1) {
            // Regular flicker burst
            maxFlickers = 3 + Math.floor(Math.random() * 4); // 3-6 flickers
            flickerCount = 0;
            
            // Start flickering with standard intensity
            toggleFlicker('regular');
        } 
        else if (patternType < 0.15) {
            // Severe flicker - deeper color change and more flickers
            maxFlickers = 3 + Math.floor(Math.random() * 3); // 5-9 flickers
            flickerCount = 0;
            
            // Start flickering with higher intensity
            toggleFlicker('severe');
        }
        else if (patternType < 0.25) {
            // Brief flash - just 1-2 quick flickers
            maxFlickers = 1 + Math.floor(Math.random()); // 1-2 flickers
            flickerCount = 0;
            
            // Start flickering with minimal intensity
            toggleFlicker('brief');
        }
    }

    function toggleFlicker(flickerType = 'regular') {
        flickerCount++;
        
        // Calculate intensity based on flicker type and count
        if (flickerCount % 2 === 1) {
            // During flicker: reduce glow and change colors
            let reductionFactor, greyValue;
            
            switch(flickerType) {
                case 'severe':
                    // Severe flickers have more extreme color/glow changes
                    reductionFactor = 0.2 + Math.random() * 0.3; // 10-40% of normal glow
                    greyValue = Math.floor(100 + Math.random() * 70); // Darker grey (100-170)
                    break;
                    
                case 'brief':
                    // Brief flickers have subtle changes
                    reductionFactor = 0.5 + Math.random() * 0.3; // 50-80% of normal glow
                    greyValue = Math.floor(180 + Math.random() * 50); // Lighter grey (180-230)
                    break;
                    
                case 'regular':
                default:
                    // Regular flickers
                    reductionFactor = 0.3 + Math.random() * 0.4; // 30-70% of normal glow
                    greyValue = Math.floor(150 + Math.random() * 50); // Medium grey (150-200)
                    break;
            }
            
            // Update both glow and colors
            updateGlowAndColors(reductionFactor, greyValue);
        } else {
            // Between flickers: restore normal glow and color
            updateGlowAndColors(1.0, 255);
        }
        
        // Calculate next flicker timing based on type
        let nextDelay;
        switch(flickerType) {
            case 'severe':
                nextDelay = 20 + Math.random() * 150; // Faster flickers (20-100ms)
                break;
                
            case 'brief':
                nextDelay = 50 + Math.random() * 70; // Medium speed (50-120ms)
                break;
                
            case 'regular':
            default:
                nextDelay = 30 + Math.random() * 90; // Normal speed (30-120ms)
                break;
        }
        
        if (flickerCount < maxFlickers * 2) { // *2 because each on/off is one count
            // Schedule next toggle
            setTimeout(() => toggleFlicker(flickerType), nextDelay);
        } else {
            // End of burst, reset to normal
            updateGlowAndColors(1.0, 255);
            
            // Schedule next burst based on flicker type (severe flickers might happen in clusters)
            let nextBurstDelay;
            if (flickerType === 'severe' && Math.random() < 0.4) {
                // 40% chance that a severe flicker is followed by another one soon
                nextBurstDelay = 1000 + Math.random() * 2000; // 1-3 seconds
            } else {
                // Normal timing between bursts
                nextBurstDelay = 2000 + Math.random() * 6000; // 2-8 seconds
            }
            
            nextFlickerTime = performance.now() + nextBurstDelay;
        }
    }

    // Add a new function to update both glow intensity and colors

    function updateGlowAndColors(intensity, colorValue) {
        // Update glow intensity
        document.documentElement.style.setProperty('--glow-intensity', intensity.toString());
        
        // Update text and border colors
        document.documentElement.style.setProperty('--text-color', `${colorValue}, ${colorValue}, ${colorValue}`);
        document.documentElement.style.setProperty('--border-color', `${colorValue}, ${colorValue}, ${colorValue}`);
        
        // Update SVG elements if any
        updateSvgColors(colorValue);
    }
    
    // Function to update the global glow intensity
    function updateGlowIntensity(intensity) {
        document.documentElement.style.setProperty('--glow-intensity', intensity.toString());
    }

    function updateSvgColors(colorValue) {
        // Get all SVG elements that might need color updates
        const svgElements = document.querySelectorAll('svg path, svg rect, svg circle, svg line, svg polygon, svg polyline');
        
        // Create a color string
        const colorStr = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        
        // Update fill and stroke attributes
        svgElements.forEach(element => {
            // Only modify elements that have white fill or stroke
            const fill = element.getAttribute('fill');
            const stroke = element.getAttribute('stroke');
            
            if (fill === '#fff' || fill === '#ffffff' || fill === 'white') {
                element.setAttribute('fill', colorStr);
            }
            
            if (stroke === '#fff' || stroke === '#ffffff' || stroke === 'white') {
                element.setAttribute('stroke', colorStr);
            }
        });
    }
    
    onMount(() => {
        if (browser) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    innerHeight = entry.contentRect.height;
                    innerWidth = entry.contentRect.width;
                }
            });

            resizeObserver.observe(document.body);
            
            // Initialize animation timing with lower frame rate
            let start;
            let lastFrameTime = 0;
            const FRAME_INTERVAL = 100; // Update every 100ms (10fps) instead of 60fps
            
            function animateBlur(timestamp) {
                if (start === undefined) start = timestamp;
                
                // Only update if enough time has passed
                if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
                    const elapsed = (timestamp - start) / 1000; // time in seconds
                    blurAmount = 33 + 8 * (Math.sin(elapsed * 0.5)); // slower oscillation, reduced intensity
                    
                    // Handle flickering logic
                    if (timestamp > nextFlickerTime) {
                        if (!isFlickering) {
                            // Start a new flicker sequence
                            createFlickerBurst(timestamp);
                        }
                    }
                    
                    lastFrameTime = timestamp;
                }
                
                requestAnimationFrame(animateBlur);
            }
            
            // Start the animation
            requestAnimationFrame(animateBlur);

            // Return cleanup function
            return () => {
                resizeObserver.disconnect();
            };
        }
    });

    let pages = [
        { id: 'twoColumn', component: TwoColumnLayout }
    ];
    let currentPage = pages[0];

    function setPage(id) {
        currentPage = pages.find(page => page.id === id);
    }
</script>

<!-- Main HTML structure -->
<video class="background-video" autoplay loop muted>
    <source src="CEVnoise8.mp4" type="video/mp4">
</video>
<div id="content-wrapper">
    <div id="content-container">
        <div class="terminal glowtext">
            {#if currentPage}
                <svelte:component this={currentPage.component} />
            {/if}
        </div>
    </div>
</div>

<!-- SVG filter definitions -->
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute; width:0; height:0;">
    <defs>
        <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
            <feOffset in="SourceGraphic" dx={blurAmount} dy="0" result="offsetRight"/>
            <feGaussianBlur in="offsetRight" stdDeviation="{blurAmount}, {(48-blurAmount)/4}" result="blurredRight" id="blurRight"/>
            
            <feOffset in="SourceGraphic" dx={-blurAmount} dy="0" result="offsetLeft"/>
            <feGaussianBlur in="offsetLeft" stdDeviation="{blurAmount}, {(48-blurAmount)/4}" result="blurredLeft" id="blurLeft"/>
            
            <feMerge result="mergedBlurs">
                <feMergeNode in="blurredRight"/>
                <feMergeNode in="blurredLeft"/>
            </feMerge>
            
            <feColorMatrix in="mergedBlurs" type="matrix"
                values="0.02 0   0   0   0
                    0   0.3  0   0   0
                    0   0    0.4 0   0
                    0   0    0   0.4 0" result="blueTint"/>
            
            <feComposite in="SourceGraphic" in2="blueTint" operator="over" />
        </filter>
    </defs>
</svg>

<style>
    @font-face {
        font-family: 'bigBlue';
        src: url('PrintChar21.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    /* Make sure all text elements transition color */
    :global(pre), :global(p), :global(span), :global(h1), :global(h2), :global(h3), :global(h4), :global(h5), :global(h6), :global(div) {
        transition: color 50ms ease-out;
        color: rgb(var(--text-color));
    }
    
    /* Make sure all border elements transition color */
    :global([class*="border"]), :global(hr), :global(table), :global(th), :global(td) {
        transition: border-color 50ms ease-out;
        border-color: rgb(var(--border-color));
    }
    
    /* Handle any elements with explicit white color */
    :global([style*="color: white"]), :global([style*="color:#fff"]), :global([style*="color: #ffffff"]) {
        color: rgb(var(--text-color)) !important;
        transition: color 50ms ease-out;
    }

    :global(:root) {
        --base-font-size: 18px;
        --base-font-size2: 24px;
        --font-size-scale: 1;
        --scale-factor: 1;
        --glow-intensity: 1; /* Glow intensity control */
        --text-color: 255, 255, 255; /* RGB values for text color */
        --border-color: 255, 255, 255; /* RGB values for border color */
    }

    :global(body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        /* background-color: black; */
        color: white;
        font-family: 'bigBlue', monospace;
        font-size: calc(var(--base-font-size) * var(--font-size-scale));
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        /* filter: url(#motion-blur-filter) */
    }

    :global(pre) {
        margin: 0;
        padding: 0;
        font-family: 'bigBlue', monospace;
        font-size: calc(var(--base-font-size) * var(--font-size-scale));
    }

    /* Terminal Text Container */
    .terminal {
        width: 80vw;
        height: 85vh;
        border: 3px solid rgb(var(--border-color));
        padding: 0px;
        box-sizing: border-box;
        overflow-y: hidden;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 calc(5px * var(--glow-intensity)) rgb(145, 194, 237);
        transition: box-shadow 50ms ease-out, border-color 50ms ease-out;
    }

    .glowtext {
        color: rgb(var(--text-color));
        text-shadow: 0 0 calc(5px * var(--glow-intensity)) rgb(145, 194, 237);
        transition: text-shadow 50ms ease-out, color 50ms ease-out;
    }

    .background-video {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
    }

    :global(.link) {
        color: rgb(var(--text-color));
        text-decoration: none;
        transition: color 50ms ease-out, background-color 50ms ease-out;
        position: relative;
        display: inline-block;
        z-index: 1;
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
    }

    :global(.link:hover) {
        color: black;
        background-color: rgb(var(--text-color));
        text-shadow: 0 0 calc(5px * var(--glow-intensity)) rgb(145, 194, 237);
    }
</style>