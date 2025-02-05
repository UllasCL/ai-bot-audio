<script>
    import {onMount} from "svelte";
    import ChatBot from './Discount.svelte';

    // onMount(() => {
    //     const script = document.createElement("script");
    //     script.async = true;
    //     script.src = "https://api.lindy.ai/api/lindyEmbed/lindyEmbed.js?a=ee898bf1-e59a-4935-aa39-1413939315c5";
    //     script.crossOrigin = "use-credentials";
    //     document.head.appendChild(script);
    // });
</script>

<!--<div id="lindy-embedded-messenger-container" style="width: 100%; height: 100%;"></div>-->

<main>
    <h1>AI Chat Assistant</h1>
    <ChatBot/>
</main>

<style>
    #lindy-embedded-messenger-container {
        width: 400px;
        height: 600px;
        border: 1px solid #ccc;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f9f9f9;
    }

    #lindy-embedded-messenger-container iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
