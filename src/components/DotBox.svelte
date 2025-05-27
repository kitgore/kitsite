<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { get } from 'svelte/store'
  import { fontSizeScale } from './store';
  
  export let containerWidth = '99%';
  export let dotSizeInput = 40;
  export let paddingInput = 50;
  export let heightRatio = .9;
  
  let container;
  let content;
  let resizeObserver;
  $: dotSize = $fontSizeScale * dotSizeInput;
  $: padding = $fontSizeScale * paddingInput

  $: console.log("PADDING: ", padding)
  
  function createDotBorder() {
    if (!container || !content) return;
    
    const oldDots = container.querySelectorAll('.dot');
    oldDots.forEach(dot => dot.remove());
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    // const contentHeight = content.scrollHeight;
    // const height = contentHeight + (padding * 2);
    const height = rect.height  * heightRatio;
    
    container.style.height = `${height}px`;
    
    // Calculate horizontal dots for top/bottom
    const horizontalDots = Math.ceil((width - dotSize) / dotSize) + 1;
    const stepX = (width - dotSize) / (horizontalDots - 1);
    
    for (let i = 0; i < horizontalDots; i++) {
      const x = i * stepX;
      createDot(x, (dotSize - dotSize * heightRatio)); // Top
      createDot(x, height - dotSize); // Bottom
    }
    
    // Calculate vertical dots for left/right
    const availableVerticalSpace = height - 2 * dotSize;
    if (availableVerticalSpace > 0) {
      const verticalDots = Math.ceil(availableVerticalSpace / dotSize);
      const stepY = availableVerticalSpace / verticalDots;
      
      for (let i = 0; i < verticalDots; i++) {
        const y = dotSize + (i * stepY);
        createDot(0, y); // Left
        createDot(width - dotSize, y); // Right
      }
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

<div class="container-wrapper" style="width: {containerWidth};">
<div class="container" bind:this={container}>
  <div class="content" bind:this={content} style="padding: {padding}px;">
    <slot></slot>
  </div>
</div>
</div>

<style>
  .container-wrapper {
    margin-top: -1%;
  }
  
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