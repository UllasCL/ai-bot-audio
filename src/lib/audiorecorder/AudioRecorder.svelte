<!-- App.svelte -->
<script>
    import {onMount} from 'svelte';

    let isRecording = false;
    let socket;
    let mediaRecorder;
    let audioChunks = [];

    onMount(() => {
        // Initialize WebSocket connection
        socket = new WebSocket('wss://4ad0-27-59-32-13.ngrok-free.app/ws');

        socket.onmessage = async (event) => {
            // print(event.data)
            if (typeof event.data === 'string') {
                const utterance = new SpeechSynthesisUtterance(event.data);
                window.speechSynthesis.speak(utterance);
            }
        };
    });

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        isRecording = true;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                e.data.arrayBuffer().then(buffer => {
                    socket.send(buffer);
                });
            }
        };

        mediaRecorder.onstop = () => {
            isRecording = false;
        };
    }

    function stopRecording() {
        mediaRecorder.stop();
    }
</script>

<button on:click={isRecording ? stopRecording : startRecording}>
    {isRecording ? 'Stop Recording' : 'Start Recording'}
</button>
