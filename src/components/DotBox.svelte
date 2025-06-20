<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { get } from 'svelte/store'
  import { fontSizeScale } from './store';
  
  export let containerWidth = '99%';
  export let dotSizeInput = 25;
  export let horizontalPadding = 50;  // Renamed from paddingInput to be more explicit
  export let topPadding = 50;         // New parameter for top content padding
  export let bottomPadding = 1;     // Renamed from bottomRatio and adjusted for actual padding
  export let topMargin = 0;
  export let bottomMargin = 0;
  export let isFirst = false;
  
  let container;
  let content;
  let resizeObserver;
  $: dotSize = $fontSizeScale * dotSizeInput;
  $: scaledHorizontalPadding = $fontSizeScale * horizontalPadding;
  $: scaledTopPadding = $fontSizeScale * topPadding;
  $: scaledBottomPadding = $fontSizeScale * bottomPadding;
  
  function createDotBorder() {
    if (!container || !content) return;
    
    const oldDots = container.querySelectorAll('.dot');
    oldDots.forEach(dot => dot.remove());
    
    const contentRect = content.getBoundingClientRect();
    const baseHeight = contentRect.height + scaledTopPadding + scaledBottomPadding;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    
    // Calculate spacing based on horizontal dots
    const horizontalDots = Math.ceil((width - dotSize) / dotSize) + 1;
    const dotSpacing = (width - dotSize) / (horizontalDots - 1);
    
    // Calculate how many vertical dots we need and adjust height to make spacing perfect
    const verticalDots = Math.ceil((baseHeight - dotSize) / dotSpacing);
    const adjustedHeight = (verticalDots - 1) * dotSpacing + dotSize;
    
    container.style.height = `${adjustedHeight}px`;
    content.style.marginTop = `-${isFirst ? 0 : dotSpacing}px`
    
    // Place horizontal dots
    for (let i = 0; i < horizontalDots; i++) {
        const x = i * dotSpacing;
        if (isFirst){
          createDot(x, 0);
        }
        createDot(x, adjustedHeight - dotSize);
    }
    
    // Place vertical dots
    for (let i = 1; i < verticalDots; i++) {
        const y = i * dotSpacing;
        createDot(0, y);
        createDot(width - dotSize, y);
    }
  }
  
  function createDot(x, y) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.fontSize = `${dotSize}px`;
    dot.textContent = '.';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    container.appendChild(dot);
  }
  
  onMount(() => {
    createDotBorder();
    
    resizeObserver = new ResizeObserver(() => {
      createDotBorder();
    });
    
    resizeObserver.observe(container);
    resizeObserver.observe(content);
    window.addEventListener('resize', createDotBorder);
  });
  
  afterUpdate(() => {
    createDotBorder();
  });
  
  onDestroy(() => {
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener('resize', createDotBorder);
  });
</script>

<div class="container-wrapper" style="width: {containerWidth}; margin-top: {topMargin}px; margin-bottom: {bottomMargin}px;">
<div class="container" bind:this={container}>
  <div class="content" bind:this={content} style="padding: {scaledTopPadding}px {scaledHorizontalPadding}px {scaledBottomPadding}px {scaledHorizontalPadding}px;">
    <slot></slot>
  </div>
</div>
</div>

<style>
  .container {
    position: relative;
    height: auto;
    box-sizing: border-box;
    border: none !important;
    min-height: 100px;
    overflow: visible;
  }
  
  .content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    overflow: visible;
  }
  
  :global(.dot) {
    position: absolute;
    font-size: 20px;
    line-height: 1;
    z-index: 1;
    overflow: visible;
  }
</style>