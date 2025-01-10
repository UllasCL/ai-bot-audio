<script lang="ts">

    import ChatBot from "./lib/components/ChatBot.svelte";

    let isSessionActive = false;
    let events = [];
    let dataChannel = null;
    let peerConnection = null;
    let audioElement = null;

    const systemPrompt = "Please respond in Hindi style. Use idioms, phrases, and tones typical of Hindi where appropriate.";
    let clientSecret: string | null = null;

    interface SessionPayload {
        model: string;
        voice: string;
        instructions: string;
    }

    async function fetchSession(): Promise<string | null> {
        try {
            const url: string = "https://api.openai.com/v1/realtime/sessions";
            const headers: Record<string, string> = {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
            };

            const payload: SessionPayload = {
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "verse",
                instructions: "Please respond in Indian English accent. Use idioms, phrases, and tones typical of Indian English where appropriate. If user speaks hindi then only respond in hindi otherwise speak in english",
            };

            const response: Response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                clientSecret = data.client_secret?.value || null;
                return clientSecret;
            } else {
                return clientSecret;
            }
        } catch (err) {
            console.error('Error fetching session:', err);
            return clientSecret;
        }
    }

    async function startSession() {
        const token = await fetchSession();

        peerConnection = new RTCPeerConnection();
        audioElement = new Audio();
        audioElement.autoplay = true;

        peerConnection.ontrack = (e) => {
            audioElement.srcObject = e.streams[0];
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
        peerConnection.addTrack(mediaStream.getTracks()[0]);

        dataChannel = peerConnection.createDataChannel("oai-events");
        dataChannel.onmessage = (event) => {
            events = [JSON.parse(event.data), ...events];
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        let modifiedSDP = offer.sdp;
        modifiedSDP += `\na=prompt:${systemPrompt.replace(/\n/g, "\\n")}\n`;

        const response = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
            method: "POST",
            body: modifiedSDP,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/sdp",
                // "X-System-Prompt": systemPrompt,
            },
        });

        const answer = {type: "answer", sdp: await response.text()};
        console.log("answer", answer)
        await peerConnection.setRemoteDescription(answer);

        isSessionActive = true;
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
    <ChatBot/>
</div>
