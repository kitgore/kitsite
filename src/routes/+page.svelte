<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute; width:0; height:0;">
  <defs>
    <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
      <!-- Offset to the right -->
      <feOffset in="SourceGraphic" dx="30" dy="0" result="offsetRight"/>
      <!-- Blur the offset to the right -->
      <feGaussianBlur in="offsetRight" stdDeviation="15, 1" result="blurredRight"/>
      
      <!-- Offset to the left -->
      <feOffset in="SourceGraphic" dx="-30" dy="0" result="offsetLeft"/>
      <!-- Blur the offset to the left -->
      <feGaussianBlur in="offsetLeft" stdDeviation="15, 1" result="blurredLeft"/>
      
      <!-- Merge the two blurs back together -->
      <feMerge result="mergedBlurs">
        <feMergeNode in="blurredRight"/>
        <feMergeNode in="blurredLeft"/>
      </feMerge>
      
      <!-- Color matrix to apply a blue tint -->
      <feColorMatrix in="mergedBlurs" type="matrix"
        values="0.04 0   0   0   0
                0   0.28  0   0   0
                0   0   0.34  0   0
                0   0   0   .6   0 " result="blueTint"/>
      
      <!-- Composite the original graphic over the blue tint -->
      <feComposite in="SourceGraphic" in2="blueTint" operator="atop" />
    </filter>
  </defs>
</svg>
  
<div id="content-container">
    <div class="terminal glowtext">
        <p>Div Test</p>
        <!-- More test text or elements can go here -->
    </div>
    <!-- <img src="coda.png", style="filter: url(#fisheye-filter);"/> -->
</div>

<script>
    import { onMount } from 'svelte';
  
    onMount(() => {
      const terminal = document.querySelector('.terminal');
      
      if (terminal) {
        // Clone the terminal
        const blurCopy = terminal.cloneNode(true);
  
        // Copy computed styles
        const computedStyle = window.getComputedStyle(terminal);
        for (let property of computedStyle) {
          blurCopy.style[property] = computedStyle[property];
        }

        // Apply the blur filter to the cloned copy
        blurCopy.style.filter = 'url(#motion-blur-filter)';
        blurCopy.style.position = 'absolute';
        blurCopy.style.zIndex = '1'; // Just below the terminal's z-index
        blurCopy.id = 'blurred-terminal'; // Assign a new ID to avoid duplicates
  
        // Adjust position to account for any offsets (e.g., if terminal is not exactly centered)
        blurCopy.style.top = terminal.offsetTop + 'px';
        blurCopy.style.left = terminal.offsetLeft + 'px';
  
        // Insert the blurred copy behind the original terminal
        terminal.parentNode.insertBefore(blurCopy, terminal);
      }
    });
  </script>