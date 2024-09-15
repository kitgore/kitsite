<script>
    import { onMount } from 'svelte';
  
    export let href = '#';
    export let onClick = () => {};
  
    let linkElement;
    let isHovered = false;
    let expandedRect = { top: 0, bottom: 0, left: 0, right: 0 };
  
    onMount(() => {
        updateExpandedRect();
        window.addEventListener('resize', updateExpandedRect);
        return () => window.removeEventListener('resize', updateExpandedRect);
    });
  
    function updateExpandedRect() {
      if (linkElement) {
        const rect = linkElement.getBoundingClientRect();
        const extraHeight = rect.height;
        expandedRect = {
          top: rect.top - extraHeight,
          bottom: rect.bottom + extraHeight,
          left: rect.left,
          right: rect.right
        };
      }
    }
  
    function handleMouseMove(event) {
        const { clientX, clientY } = event;
        isHovered = clientX >= expandedRect.left && clientX <= expandedRect.right &&
                    clientY >= expandedRect.top && clientY <= expandedRect.bottom;
        
    }
  
    function handleClick(event) {
      if (isHovered) {
        event.preventDefault();
        onClick(event);
      }
    }
  </script>
  
  <svelte:window on:mousemove={handleMouseMove} on:click={handleClick} />
  
  <a 
    bind:this={linkElement}
    {href}
    class="distorted-link"
    class:hovered={isHovered}
    on:click|preventDefault
  >
    <slot></slot>
  </a>
  
  <style>
    .distorted-link {
      position: relative;
      display: inline-block;
      color: white;
      text-decoration: none;
      transition: all 0s ease-out;
    }
    .hovered {
      color: black;
      background-color: rgb(240, 250, 255);
      box-shadow: 0 0 10px rgb(165, 183, 243);
    }
  </style>