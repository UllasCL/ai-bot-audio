<script>
    let command = ""; // Captured voice command
    let isListening = false;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition!");
    } else {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        // Start listening
        function startListening() {
            isListening = true;
            recognition.start();
        }

        // Stop listening
        function stopListening() {
            isListening = false;
            recognition.stop();
        }

        // Handle recognition results
        recognition.onresult = (event) => {
            command = event.results[0][0].transcript; // Capture the recognized speech
            handleCommand(command);
        };

        // Handle voice commands
        function handleCommand(command) {
            if (command.toLowerCase().includes("open settings")) {
                alert("Opening settings...");
                // Add your custom action here
            } else if (command.toLowerCase().includes("play music")) {
                alert("Playing music...");
                // Add your custom action here
            } else {
                alert(`Command not recognized: "${command}"`);
            }
        }
    }
</script>

<main>
    <h1>Voice Control with Svelte</h1>
    <button on:click={startListening} disabled={isListening}>Start Listening</button>
    <button on:click={stopListening} disabled={!isListening}>Stop Listening</button>
    <p>Command: {command}</p>
</main>

<style>
    main {
        text-align: center;
        margin: 2rem auto;
        max-width: 500px;
    }
</style>
