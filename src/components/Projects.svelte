<script>
    import DotBox from "./DotBox.svelte";
</script>

<div class="dotBoxContainer">
<DotBox isFirst=true topMargin={0}>
    <div class="image-group">
        <img src="dithered/nights.png" alt="codagotchi" class="project-image">
        <img src="dithered/settings.png" alt="codagotchi" class="project-image">
    </div>
    <div class="header-container">
        <p class="title">lyrictype.com</p>
        <span class="badge">SVELTE</span>
        <span class="badge">FIREBASE</span>
        <span class="badge">VITE</span>
    </div>
    <p>a typing test website for song lyrics</p>
    <p>features a mac classic ui</p>
    <p>built with svelte</p>
</DotBox>
<DotBox>
    <div class="image-group">
        <img src="dithered/codagotchi1.png" alt="codagotchi" class="project-image">
        <img src="dithered/codagotchi2.png" alt="codagotchi" class="project-image">
        <img src="dithered/codagotchi3.png" alt="codagotchi" class="project-image">
    </div>
    <div class="header-container">
        <p class="title">codagotchi</p>
        <span class="badge">SVELTE</span>
        <span class="badge">TYPESCRIPT</span>
        <span class="badge">FIREBASE</span>
    </div>
    <p>a virtual pet vscode extension to reward regular coding</p>
    <p>features collectable items, pet and room customizations and multiplayer</p>
    <p>built with svelte</p>
</DotBox>
</div>


<style>
    p, pre {
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
        line-height: calc(var(--font-size-scale) * 1.15);
    }
    
    .header-container {
        display: flex;
        align-items: center;
        gap: 2%; /* Adds spacing between the h2 and badge */
        margin-bottom: -2%;
    }
    
    .badge {
        font-size: calc(var(--base-font-size2) * var(--font-size-scale));
        display: inline-flex;
        align-items: end;
        justify-content: center;
        color: black;
        background-color: rgb(var(--text-color));
        box-shadow: 0 0 calc(5px * var(--glow-intensity)) rgb(145, 194, 237);
        padding-top: calc(0.25 * var(--font-size-scale));
        padding-bottom: calc(0.25 * var(--font-size-scale));
        height: 1.15em;
        box-sizing: border-box;
        transition: 
            background-color 50ms ease-out,
            box-shadow 50ms ease-out,
            color 50ms ease-out;
    }
    
    .title{
        text-decoration: underline;
    }

    .dotBoxContainer{
        height: 100%;
        overflow-y: auto;
        scrollbar-width: none; /* Hide scrollbar for Firefox */
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        padding-bottom: 3%;
        padding-left: 1%;
        padding-right: 1%;
        padding-top: 1%;
    }

    /* Hide scrollbar for webkit browsers */
    .dotBoxContainer::-webkit-scrollbar {
        display: none;
    }

    .project-image {
        max-height: calc(14em * var(--font-size-scale));
        height: auto;
        object-fit: contain;
        transition: filter 50ms ease-out;
        position: relative;
        z-index: 1;
        flex: 1;
        min-width: 0; /* Prevents flex items from overflowing */
    }

    .image-group {
        display: flex;
        gap: 1em;
        margin: .25em 0;
        position: relative;
        z-index: 1;
        justify-content: stretch;
        align-items: flex-start;
        width: 100%;
    }
</style>