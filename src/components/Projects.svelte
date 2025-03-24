<script>
    import DotBox from "./DotBox.svelte";
</script>

<DotBox>
    <div class="header-container">
        <h2>lyrictype.com</h2>
        <span class="badge">SVELTE</span>
    </div>
    <p>a typing test website for song lyrics</p>
    <p>features a mac classic ui</p>
    <p>built with svelte</p>
</DotBox>

<style>
    pre {
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
        font-size: calc(.5 * var(--font-size-scale));
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: black;
        background-color: rgb(var(--text-color));
        box-shadow: 0 0 calc(5px * var(--glow-intensity)) rgb(145, 194, 237);
        padding-top: calc(0.25 * var(--font-size-scale));
        padding-bottom: calc(0.25 * var(--font-size-scale));
        height: 1.3em;
        box-sizing: border-box;
    }
</style>