<script>
    import { onMount } from "svelte";

    let isSessionActive = false;
    let events = [];
    let dataChannel = null;
    let peerConnection = null;
    let audioElement = null;

    async function startSession() {
        try {
            peerConnection = new RTCPeerConnection();
            audioElement = new Audio();
            audioElement.autoplay = true;

            peerConnection.ontrack = (e) => {
                audioElement.srcObject = e.streams[0];
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            peerConnection.addTrack(mediaStream.getTracks()[0]);

            dataChannel = peerConnection.createDataChannel("oai-events");
            dataChannel.onmessage = (event) => {
                events = [JSON.parse(event.data), ...events];
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const response = await fetch(`http://127.0.0.1:8000/realtime`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    "Content-Type": "text/plain",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to get SDP answer from server:", errorText);
                alert("Failed to start session: " + errorText);
                return;
            }

            const sdpAnswer = await response.text();
            console.log("Received SDP Answer:", sdpAnswer);

            // Validate SDP before setting it
            if (!sdpAnswer.startsWith("v=")) {
                console.error("Invalid SDP format received:", sdpAnswer);
                alert("Invalid SDP received. Check the backend.");
                return;
            }

            const answer = { type: "answer", sdp: sdpAnswer };
            await peerConnection.setRemoteDescription(answer);

            isSessionActive = true;
        } catch (error) {
            console.error("Error starting session:", error);
        }
    }

    function stopSession() {
        if (dataChannel) dataChannel.close();
        if (peerConnection) peerConnection.close();
        peerConnection = null;
        isSessionActive = false;
    }
</script>

<!-- UI Code -->
<div>
    <button on:click={startSession}>Start Session</button>
    <button on:click={stopSession}>Stop Session</button>
    <div>
        {#each events as event}
            <p>{event.type}: {JSON.stringify(event)}</p>
        {/each}
    </div>
</div>
