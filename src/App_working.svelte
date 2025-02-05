<script>
    import annyang from "annyang";
    import ChatBot from "./lib/components/ChatBot.svelte";

    let isListening = false;

    if (annyang) {
        const commands = {
            "open settings": () => alert("Opening settings..."),
            "play music": () => alert("Playing music..."),
        };

        annyang.addCommands(commands);

        function startListening() {
            isListening = true;
            annyang.start();
        }

        function stopListening() {
            isListening = false;
            annyang.abort();
        }
    } else {
        alert("Your browser does not support Annyang!");
    }
</script>
<!-- UI Code -->
<div>
    <ChatBot/>
</div>
