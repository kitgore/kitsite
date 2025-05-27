<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    export let src = ''; // URL to the ASCII art file
    export let content = ''; // Direct content of the ASCII art file
    export let fps = 10; // Frames per second
    export let lineHeight = 1.2; // Line height multiplier
    export let height = 18; // Height of each frame in lines
    
    let container;
    let frames = [];
    let currentFrame = 0;
    let isPlaying = true;
    let frameWidth = 0;
    let frameHeight = 0;
    let animationFrame;
    let lastFrameTime = 0;
    
    // Parse the ASCII art file into frames
    function parseFrames(text) {
        // Split by double newlines to get potential frames
        const potentialFrames = text.split(/\n\s*\n/).filter(frame => frame.trim());
        if (potentialFrames.length === 0) return;
        
        // Process each potential frame
        frames = potentialFrames.map(frame => {
            const lines = frame.split('\n');
            // Pad with empty lines if needed
            while (lines.length < height) {
                lines.push('');
            }
            // Trim to exact height
            return lines.slice(0, height).join('\n');
        });
        
        // Get dimensions from first frame
        const firstFrame = frames[0].split('\n');
        frameHeight = firstFrame.length;
        frameWidth = Math.max(...firstFrame.map(line => line.length));
        
        // Validate all frames have same dimensions
        for (const frame of frames) {
            const lines = frame.split('\n');
            if (lines.length !== frameHeight) {
                console.error('All frames must have the same height');
                return;
            }
            if (Math.max(...lines.map(line => line.length)) !== frameWidth) {
                console.error('All frames must have the same width');
                return;
            }
        }
    }
    
    // Load the ASCII art file
    async function loadAsciiArt() {
        try {
            if (src) {
                const response = await fetch(src);
                if (!response.ok) throw new Error('Failed to load ASCII art file');
                content = await response.text();
            }
            parseFrames(content);
        } catch (error) {
            console.error('Error loading ASCII art:', error);
        }
    }
    
    // Animation loop
    function animate(timestamp) {
        if (!isPlaying) return;
        
        if (!lastFrameTime) lastFrameTime = timestamp;
        const elapsed = timestamp - lastFrameTime;
        
        if (elapsed > (1000 / fps)) {
            currentFrame = (currentFrame + 1) % frames.length;
            lastFrameTime = timestamp;
        }
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Toggle play/pause
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            lastFrameTime = 0;
            animationFrame = requestAnimationFrame(animate);
        }
    }
    
    // Calculate font size to fit container width
    function updateFontSize() {
        if (!container || !frameWidth) return;
        
        const containerWidth = container.clientWidth;
        const charWidth = containerWidth / frameWidth;
        container.style.fontSize = `${charWidth}px`;
        container.style.lineHeight = `${charWidth * lineHeight}px`;
    }
    
    // Handle resize
    function handleResize() {
        updateFontSize();
    }
    
    onMount(async () => {
        if (!browser) return;
        
        await loadAsciiArt();
        if (frames.length > 0) {
            updateFontSize();
            window.addEventListener('resize', handleResize);
            animationFrame = requestAnimationFrame(animate);
        }
    });
    
    onDestroy(() => {
        if (!browser) return;
        
        window.removeEventListener('resize', handleResize);
        if (animationFrame) cancelAnimationFrame(animationFrame);
    });
</script>

<div class="ascii-player" bind:this={container}>
    {#if frames.length > 0}
<pre class="ascii-art">

{frames[currentFrame]}
</pre>
    {:else}
        <!-- <div class="error">No frames loaded</div> -->
    {/if}
</div>

<style>
    .ascii-player {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    pre {
        margin: 0;
        white-space: pre;
        font-family: inherit;
    }
    
    .play-pause {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .play-pause:hover {
        background: rgba(0, 0, 0, 0.7);
    }
    
    .error {
        color: red;
        text-align: center;
    }
</style> 