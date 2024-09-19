<script>
    import Home from './Home.svelte';
    import About from './About.svelte';

    let pages = [
        { id: 'home', component: Home },
        { id: 'about', component: About }
    ];
    let currentPage = pages[0]

    function setPage(id) {
        currentPage = pages.find(page => page.id === id)
    }
    
</script>



<div class="container">
    <div class="left-column">
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
     ∭     ∭
 ⌛ ∞ ♡ 

 <a class="link" href="#" on:click={()=> setPage("about")}> about</a>
 
 <a class="link" href="#" on:click={()=> setPage("home")}> projects </a>

 <a class="link" href="#" on:click={()=> setPage("design")}> design</a>

    </pre>
    <img src="cat.png" alt="bubble" class="bubble" /> 
    <img src="cat.png" alt="bubble" class="bubble" />  
    <img src="cat.png" alt="bubble" class="bubble" />   

    
</div>
<div class="right-column">
    <!-- Content for the right column -->
    {#if currentPage}
        <svelte:component this={currentPage.component} />
    {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        width: 100%;
        height: 100%;
    }
    
    .left-column {
        width: 33%;
        padding-left: .4rem;
        box-sizing: border-box;
        border-right: 3px solid white;
    }
    
    .right-column {
        width: 67%;
        padding: 1rem;
        box-sizing: border-box;
    }

    .size2{
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
    }

    .link {
        color: white;
        text-decoration: none;
        transition: all 0s ease-out;
        position: relative;
        display: inline-block;
        z-index: 1;
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
    }

    .link::before {
        content: '';
        position: absolute;
        top: 1em; /* Adjust these values to change the hitbox size */
        left: -1em;
        right: -1em;
        bottom: -1em;
        z-index: -1;
    }

    .link:hover {
        color: black;
        background-color: rgb(240, 250, 255);
        box-shadow: 0 0 10px rgb(165, 183, 243);
    }
    .bubble {
        width: calc(100px * var(--scale-factor));
        height: auto;
    }
</style>