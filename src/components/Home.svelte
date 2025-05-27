<script>
    import AsciiPlayer from './AsciiPlayer.svelte';
</script>

<div>
    <AsciiPlayer 
        src="/danceascii.txt"
        fps={20}
        lineHeight={1.2}
        height={18}
    />
    <div class="center-text">
        <p>Welcome to my website</p>
        <br>
        <br>
        <br>
        <br>
        <br>
        <p class="center-text">This site is part of the M0SS webring</p>
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