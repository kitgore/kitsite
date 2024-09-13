<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import TwoColumnLayout from '../components/TwoColumnLayout.svelte';
    import Home from '../components/Home.svelte';
    import About from '../components/About.svelte';

    let innerHeight;
    let innerWidth;
    let baseFontSize = 20; // Base font size in pixels
    let fontSizeScale;

    $: if (browser) {
        updateFilterScaling(innerHeight, innerWidth);
        updateFontSize(innerHeight);
    }

    function updateFilterScaling(height, width) {
        if (!browser) return;

        const baseHeight = 1080;
        const baseWidth = 1920;  
        const scaleFactor = Math.min(height / baseHeight, width / baseWidth);
        
        // Update CSS custom property for general scaling
        document.documentElement.style.setProperty('--scale-factor', scaleFactor.toString());

        // Update SVG filter parameters
        const filter = document.getElementById('motion-blur-filter');
        if (filter) {
            // Scale the displacement map (feImage)
            const displacementMap = filter.querySelector('#displacement-map');
            if (displacementMap) {
                const mapWidth = 200 * scaleFactor;
                const mapHeight = 200 * scaleFactor;
                displacementMap.setAttribute('width', `${mapWidth}%`);
                displacementMap.setAttribute('height', `${mapHeight}%`);
                displacementMap.setAttribute('x', `-${mapWidth / 2}%`);
                displacementMap.setAttribute('y', `-${mapHeight / 2 + 5}%`);
            }

            // Scale the displacement effect (feDisplacementMap)
            const displacementEffect = filter.querySelector('#displacement-effect');
            if (displacementEffect) {
                const newScale = 35 * scaleFactor;
                displacementEffect.setAttribute('scale', newScale.toString());
            }

            // Scale the blur effect
            const blurEffect = filter.querySelector('#blur-effect');
            if (blurEffect) {
                const newBlur = `${30 * scaleFactor} ${0.2 * scaleFactor}`;
                blurEffect.setAttribute('stdDeviation', newBlur);
            }
        }
    }

    function updateFontSize(height) {
        if (!browser) return;

        const baseHeight = 1080; // Base height for scaling (e.g., 1080p)
        fontSizeScale = height / baseHeight;
        
        // Update CSS custom property for font size scaling
        document.documentElement.style.setProperty('--font-size-scale', fontSizeScale.toString());
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

            return () => {
                resizeObserver.disconnect();
            };
        }
    });

    let pages = [
        { id: 'home', component: Home },
        { id: 'about', component: About }
    ];
    let currentPage = pages[0];

    function setPage(id) {
        currentPage = pages.find(page => page.id === id);
    }

</script>

<!-- Main HTML structure -->
<div id="content-container">
    {#if currentPage}
        <div class="terminal glowtext" >
            <svelte:component this={currentPage.component} />
        </div>
    {/if}
</div>



<!-- SVG filter definitions -->
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute; width:0; height:0;">
    <defs>
        <filter id="motion-blur-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feImage xlink:href="bubble.png" result="map" x="-50%" y="-55%" width="200%" height="200%" preserveAspectRatio="none"/>
            <feDisplacementMap in="SourceGraphic" in2="map" scale=40 xChannelSelector="R" yChannelSelector="G" result="fisheye"/>

            <feGaussianBlur in="fisheye" stdDeviation="30 .2" result="blur"/>
      
            <feColorMatrix in="blur" type="matrix" 
            values="0.02 0   0   0   0
                    0   0.3  0   0   0
                    0   0    0.4 0   0
                    0   0    0   0.4 0" result="dimBlueShift"/>
            <feGaussianBlur in="dimBlueShift" stdDeviation="25 0" result="blurred"/>
            <!-- <feOffset in="blurred" dx="2" dy="0" result="offsetBlur"/> -->
            <feComposite in="blurred" in2="colored" operator="over" result="horizontalGlow"/>
            
            <!-- Blend glow with original -->
            <feBlend in="fisheye" in2="horizontalGlow" mode="screen" result="finalEffect"/>
            

            <feBlend in="fisheye" in2="screenGlow" mode="screen"/>
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

    :global(:root) {
        --base-font-size: 18px;
        --base-font-size2: 24px;
        --font-size-scale: 1;
        --scale-factor: 1;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background-color: black;
        background-image: url("CEVnoise4.gif");
        color: white;
        font-family: 'bigBlue', monospace;
        font-size: calc(var(--base-font-size) * var(--font-size-scale));
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        filter: url(#motion-blur-filter)
    }

    :global(pre) {
        margin: 0;
        padding: 0;
        font-family: 'bigBlue', monospace;
        font-size: calc(var(--base-font-size) * var(--font-size-scale));
    }

    .size2{
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
    }

    .link {
        color: white; /* Initial text color */
        text-decoration: none; /* Remove underline */
        transition: all 0s ease-out; /* Smooth transition */
    }

    .link:hover {
        color: black; /* Text color on hover */
        background-color: rgb(240, 250, 255); /* Background color on hover */
        box-shadow: 0 0 10px rgb(165, 183, 243);
    }

    /* Terminal Text Container */
    .terminal {
        width: 80vw; /* Use viewport width (vw) for responsive sizing */
        height: 85vh; /* Use viewport height (vh) for responsive sizing */
        border: 3px solid white;
        padding: 0px;
        box-sizing: border-box;
        overflow-y: hidden; /* Change to hidden if you don't want scrolling */
        position: relative;
        z-index: 2; /* On top of the blurred copy */
    }

    .glowtext {
        color: #fff;
        text-shadow: 0px 0 5px rgb(145, 194, 237);
    }

    .bubble {
        width: calc(100px * var(--scale-factor));
        height: auto;
    }
</style>