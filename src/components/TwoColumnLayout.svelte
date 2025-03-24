<script>
    import Home from './Home.svelte';
    import About from './About.svelte';
    import Projects from './Projects.svelte';
    import { onMount, tick } from 'svelte';

    let pages = [
        { id: 'home', component: Home },
        { id: 'about', component: About },
        { id: 'projects', component: Projects }
    ];
    let currentPage = pages[0];
    let displayedAscii = currentPage.ascii;
    let animating = false;
    
    async function setPage(id) {
        if (animating) return;
        animating = true;
        
        let targetPage = pages.find(page => page.id === id);
        let targetAscii = targetPage.ascii;
        
        while (displayedAscii !== targetAscii) {
            displayedAscii = animateAscii(displayedAscii, targetAscii);
            await tick();
            await new Promise(resolve => setTimeout(resolve, 50)); // Adjust speed here
        }
        
        currentPage = targetPage;
        animating = false;
    }
    
    function animateAscii(current, target) {
        return current.split('').map((char, index) => {
            if (char === target[index]) return char;
            let currentCode = char.charCodeAt(0);
            let targetCode = target[index].charCodeAt(0);
            if (currentCode < targetCode) return String.fromCharCode(currentCode + 1);
            if (currentCode > targetCode) return String.fromCharCode(currentCode - 1);
            return char;
        }).join('');
    }

    
</script>



<div class="container">
    <div class="left-column">
    <pre class="size1">
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
 
 <a class="link" href="#" on:click={()=> setPage("projects")}> projects </a>

 <a class="link" href="#" on:click={()=> setPage("design")}> design</a>

    </pre>
    <!-- <img src="cat.png" alt="bubble" class="bubble" /> 
    <img src="cat.png" alt="bubble" class="bubble" />  
    <img src="cat.png" alt="bubble" class="bubble" />    -->

    
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
        width: 35%;
        padding-left: .4rem;
        box-sizing: border-box;
        border-right: 3px solid white;
    }
    
    .right-column {
        width: 67%;
        padding: 1rem;
        box-sizing: border-box;
    }
    .size1{
        font-size: calc(var(--base-font-size) * var(--font-size-scale));
    }

    .size2{
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
    }
    .bubble {
        width: calc(100px * var(--scale-factor));
        height: auto;
    }
</style>