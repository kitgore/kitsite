<!-- Main HTML structure -->
<div id="content-container">
  <div class="terminal glowtext">
      <pre>
       __   ____                      
      / /__/_/ /_____  ____  ________ 
     / / _/ / __/ __ `/ __ \/ ___/ _ \
    /   \/ / /_/ /_/ / /_/ / /  /  __/
   /_/|_/_/\__/\__  /\____/_/   \___/ 
              /____/                  
      </pre>
  </div>
</div>

<!-- SVG filter definitions -->
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute; width:0; height:0;">
  <defs>
      <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
          <feOffset in="SourceGraphic" dx="30" dy="0" result="offsetRight"/>
          <feGaussianBlur in="offsetRight" stdDeviation="15, 2" result="blurredRight" id="blurRight"/>
          
          <feOffset in="SourceGraphic" dx="-30" dy="0" result="offsetLeft"/>
          <feGaussianBlur in="offsetLeft" stdDeviation="15, 2" result="blurredLeft" id="blurLeft"/>
          
          <feMerge result="mergedBlurs">
              <feMergeNode in="blurredRight"/>
              <feMergeNode in="blurredLeft"/>
          </feMerge>
          
          <feColorMatrix in="mergedBlurs" type="matrix"
              values="0.04 0   0   0   0
                      0   0.28  0   0   0
                      0   0   0.34  0   0
                      0   0   0   .6   0 " result="blueTint"/>
          
          <feComposite in="SourceGraphic" in2="blueTint" operator="atop" />
      </filter>

      <filter id="fisheye-effect" x="0" y="0" width="100%" height="100%">
        <feImage result="ripple" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAACUFjqXAAAAXklEQVR42mJgQAMWwmcYGRlmAgwbYwYGBm8RBmIC2N9DeYD2PxT4AGYDJMNgGLyMIJ5H6n+GEkTmgMwpIZAiPEYtCSaDJANoxMhAmwdzMBTEZ2ACwzgzFR7s6Il1sJZkNgAAAABJRU5ErkJggg==" />
        <feDisplacementMap in="SourceGraphic" in2="ripple" scale="100" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>

<!-- Svelte script tag with animation logic -->
<script>
  import { onMount } from 'svelte';

  onMount(() => {
      const terminal = document.querySelector('.terminal');
      const blurRight = document.getElementById('blurRight');
      const blurLeft = document.getElementById('blurLeft');
      let start;

      function animateBlur(timestamp) {
          if (start === undefined) start = timestamp;
          const elapsed = (timestamp - start) / 1000; // time in seconds
          const stdDev = 13 + 4 * (Math.sin(elapsed)); // oscillate stdDeviation between 5 and 15
          
          blurRight.setAttribute('stdDeviation', `${stdDev}, ${1 + stdDev/6}`);
          blurLeft.setAttribute('stdDeviation', `${stdDev}, ${1 + stdDev/6}`);
          // console.log(Math.sin(elapsed) + 10);
          requestAnimationFrame(animateBlur);
      }

      requestAnimationFrame(animateBlur);
      
      if (terminal) {
          // Clone the terminal
          const blurCopy = terminal.cloneNode(true);

          // Copy computed styles
          const computedStyle = window.getComputedStyle(terminal);
          for (let property of computedStyle) {
              blurCopy.style[property] = computedStyle[property];
          }

          // Apply the blur filter to the cloned copy
          blurCopy.style.filter = 'url(#fisheye-effect)';
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
