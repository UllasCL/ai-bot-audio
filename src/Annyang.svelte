<script>
    import annyang from "annyang";

    let isListening = false;
    let statusMessage = "Ready for commands.";

    // Check if Annyang is supported
    if (annyang) {
        const commands = {
            "nuclei website": () => openInNewTab("https://gonuclei.com/"),
            "SAAS Marketplace": () => openInNewTab("https://saasmarketplace.gonuclei.com/"),
        };

        annyang.addCommands(commands);

        annyang.addCallback('start', () => {
            statusMessage = "Listening...";
        });

        annyang.addCallback('end', () => {
            statusMessage = "Stopped listening.";
        });

        annyang.addCallback('error', (error) => {
            statusMessage = `Error: ${error.error}`;
        });

        annyang.addCallback('resultNoMatch', () => {
            statusMessage = "Command not recognized. Try again.";
        });
    } else {
        alert("Your browser does not support voice recognition.");
    }

    function openInNewTab(url) {
        window.open(url, '_blank');
    }

    function startListening() {
        if (annyang) {
            isListening = true;
            statusMessage = "Listening...";
            annyang.start();
        }
    }

    function stopListening() {
        if (annyang) {
            isListening = false;
            statusMessage = "Stopped listening.";
            annyang.abort();
        }
    }
</script>

<style>
    /* Background Animation */
    body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(45deg, #6a11cb, #2575fc);
        background-size: 400% 400%;
        animation: gradientBG 10s ease infinite;
    }

    @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    main {
        font-family: Arial, sans-serif;
        text-align: center;
        color: white;
        background: rgba(0, 0, 0, 0.5);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
    }

    button {
        padding: 15px 30px;
        margin: 10px;
        font-size: 18px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background: linear-gradient(45deg, #ff9a9e, #fad0c4);
        color: white;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(255, 154, 158, 0.4);
        transition: all 0.3s ease;
    }

    button:hover {
        background: linear-gradient(45deg, #ff758c, #ff7eb3);
        transform: scale(1.1);
        box-shadow: 0 8px 20px rgba(255, 154, 158, 0.6);
    }

    button:disabled {
        background: #666;
        cursor: not-allowed;
        box-shadow: none;
    }

    /* Glowing Status */
    .status {
        margin-top: 20px;
        font-size: 1.5rem;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    }

    .status.active {
        color: #34d399;
        animation: glow 1s ease infinite;
    }

    .status.error {
        color: #f87171;
    }

    @keyframes glow {
        0%, 100% { text-shadow: 0 0 5px #34d399, 0 0 15px #34d399; }
        50% { text-shadow: 0 0 10px #34d399, 0 0 20px #34d399; }
    }
</style>

<main>
    <h1>Voice Control</h1>
    <button on:click={startListening} disabled={isListening}>Start Listening</button>
    <button on:click={stopListening} disabled={!isListening}>Stop Listening</button>
    <p>Try saying: <strong>"nuclei website"</strong> or <strong>"SAAS Marketplace"</strong>!</p>
    <p class="status" class:active={isListening}>{statusMessage}</p>
</main>
