<script>
    import { onMount } from 'svelte';
  
    export let webmSrc = ''; // Path to WebM file
    export let fallbackSrc = ''; // Path to fallback video file (e.g., MP4)
    
    let videoElement;
    let isVideoLoaded = false;
    let useCanvas = false;
  
    onMount(() => {
      if (videoElement) {
        videoElement.addEventListener('loadeddata', () => {
          isVideoLoaded = true;
          console.log('Video loaded successfully');
        });
  
        videoElement.addEventListener('error', (e) => {
          console.error('Error loading video:', e);
        });
  
        // Attempt to play the video
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Video playback started successfully');
          }).catch(error => {
            console.error('Video playback failed:', error);
            // If video playback fails, fall back to canvas
            useCanvas = true;
          });
        }
      }
    });
  
    function drawCanvas() {
      if (useCanvas && videoElement && isVideoLoaded) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        
        function render() {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(render);
        }
        render();
  
        document.body.appendChild(canvas);
        canvas.className = 'video-background';
      }
    }
  
    $: if (useCanvas && isVideoLoaded) drawCanvas();
  </script>
  
  <video
    bind:this={videoElement}
    class="video-background"
    autoplay
    loop
    muted
    playsinline
    style="display: {useCanvas ? 'none' : 'block'};"
  >
    <source src={webmSrc} type="video/webm">
    <source src={fallbackSrc} type="video/mp4">
    Your browser does not support the video tag.
  </video>
  
  <style>
    .video-background {
      position: fixed;
      right: 0;
      bottom: 0;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      z-index: -1;
      object-fit: cover;
    }
  </style>