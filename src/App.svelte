<script>
  import { onMount } from "svelte";

  let isSessionActive = false;
  let events = [];
  let dataChannel = null;
  let peerConnection = null;
  let audioElement = null;

  async function startSession() {
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

    const response = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ek_676819f260788190923761c2d678fa0d`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = { type: "answer", sdp: await response.text() };
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
  <button on:click={startSession}>Start Session</button>
  <button on:click={stopSession}>Stop Session</button>
  <div>
    {#each events as event}
      <p>{event.type}: {JSON.stringify(event)}</p>
    {/each}
  </div>
</div>
