<script>
    import { Conversation } from '@11labs/client';

    let isCalling = false;
    let callButtonText = 'Start Call';
    let audio = new Audio('/static/sounds/phone-ring.mp3');
    let conversation;

    const AGENT_ID = 'vlm7BH4czcVM9TAnsULl'; // Replace with your agent ID

    async function toggleCall() {
        isCalling = !isCalling;
        callButtonText = isCalling ? 'End Call' : 'Start Call';

        if (isCalling) {
            audio.loop = true;
            audio.play();
            await startConversation();
        } else {
            endCall();
        }
    }

    async function startConversation() {
        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Start the conversation
            conversation = await Conversation.startSession({
                agentId: AGENT_ID,
                onConnect: () => {
                    console.log('✅ Connected to ElevenLabs');
                    audio.pause();
                    audio.currentTime = 0;
                },
                onDisconnect: () => {
                    console.log('🔴 Disconnected');
                    endCall();
                },
                onError: (error) => {
                    console.error('Error:', error);
                    endCall();
                },
                onModeChange: (mode) => {
                    console.log(`Agent is ${mode.mode}`);
                }
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            endCall();
        }
    }

    function endCall() {
        if (conversation) {
            conversation.endSession();
            conversation = null;
        }
        isCalling = false;
        callButtonText = 'Start Call';
        audio.pause();
        audio.currentTime = 0;
    }
</script>

<style>
    .container {
        background-color: #d11a7b;
        color: #fff;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: 'Segoe UI', sans-serif;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #fff;
    }

    .language-button {
        background: #2f3d9e;
        color: #fff;
        padding: 0.4rem 1rem;
        border-radius: 999px;
        font-weight: bold;
        font-size: 0.9rem;
        border: none;
    }

    .center-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 1rem;
    }

    .center-content img {
        width: 120px;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 1.6rem;
        margin: 0.5rem 0;
    }

    p {
        font-size: 1.1rem;
        opacity: 0.9;
    }

    .call-button {
        background: #fff;
        color: #d11a7b;
        border: none;
        padding: 1.2rem 2.4rem;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 999px;
        margin-top: 2rem;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transition: background 0.3s ease;
    }

    .footer {
        padding: 1rem;
        background: #fff;
        text-align: center;
        color: #555;
        font-size: 0.9rem;
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .nuclei-logo {
        height: 1rem;
        vertical-align: middle;
        margin-left: 0.3rem;
    }

    @media screen and (min-width: 768px) {
        .container {
            border-radius: 12px;
            max-width: 430px;
            margin: 2rem auto;
            height: calc(100dvh - 4rem);
            min-height: 600px;
            max-height: 800px;
        }

        body {
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            min-height: 100dvh;
        }
    }
</style>

<div class="container">
    <div class="top-bar">
        <img src="https://www.telekom.com/resource/crblob/1081046/05272d789be738a790edff915a075ec4/favicon-svg-data.svg" alt="Logo" height="28" />
        <!--        <button class="language-button">English</button>-->
    </div>

    <div class="center-content">
        <img src="https://www.telekom.com/resource/crblob/1081046/05272d789be738a790edff915a075ec4/favicon-svg-data.svg" alt="Logo" />
        <h2>Flights support AI Assistant</h2>
        <p>Instant answers for all your Flights needs 24×7</p>
        <button class="call-button" on:click={toggleCall}>📞 {callButtonText}</button>
    </div>

    <div class="footer">
        Demo AI Agent – Powered by <img src="https://cdn.prod.website-files.com/65b08798a478bf4894ad2c71/6646b4ece5993d9b5407a241_Nuclei.svg" alt="Nuclei" class="nuclei-logo" />
    </div>
</div>
