<script>
    import TwoColumnLayout from './TwoColumnLayout.svelte';
</script>

<TwoColumnLayout>
    <div slot="left">
    <pre>
    __   ____                      
   / /__/_/ /_____  ____  ________ 
  / / _/ / __/ __ `/ __ \/ ___/ _ \
 /   \/ / /_/ /_/ / /_/ / /  /  __/
/_/|_/_/\__/\__  /\____/_/   \___/ 
       /____/                  
    </pre>
    <pre class="size2">
developer / creative

        ♥ ♦ Ü  
    ∭ ⌛ ∞ ♡ 

 about

 projects 

 design
        </pre>
        <img src="cat.png" alt="bubble" class="bubble" /> 
        <img src="cat.png" alt="bubble" class="bubble" />  
        <img src="cat.png" alt="bubble" class="bubble" />   
        <a class="link" href="#">test</a>
        <a class="link" href="#">test</a>
    </div>
    <div slot="right">
        <!-- Content for the right column -->
        <pre class="size2">
bruhbruh
bru bruhbruh bruh bruh 
        </pre>
    </div>
</TwoColumnLayout>

<!-- MOVE THIS / CENTRALIZE -->
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