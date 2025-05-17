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
        <h1>Welcome to my website</h1>
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