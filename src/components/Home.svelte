<script>
    import AsciiPlayer from './AsciiPlayer.svelte';
</script>

<div>
    <br>
    <br>
    <br>
    <AsciiPlayer 
        src="/danceascii.txt"
        fps={20}
        lineHeight={1.2}
        height={18}
    />
    <div class="center-text">
        <br>
        <br>
        <p>welcome to my website</p>
        <p></p>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <p class="center-text">this site is part of the <a class="link underline" href="#" on:click={() => {}}>M0SS</a> webring</p>
        <p class="center-text">
            <a class="link underline" href="#" on:click={() => {}}>prev</a> 
            <a class="link underline" href="#" on:click={() => {}}>next</a> 
        </p>
    </div>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
    .center-text {
        text-align: center;
    }
</style>