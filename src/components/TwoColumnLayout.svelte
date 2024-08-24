<script>
    export let leftContent = '';
    export let rightContent = '';

    let pages = []
    
</script>

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
</style>

<div class="container">
    <div class="left-column">
        <slot name="left">
            {leftContent}
        </slot>
    </div>
    <div class="right-column">
        <slot name="right">
            {rightContent}
        </slot>
    </div>
</div>