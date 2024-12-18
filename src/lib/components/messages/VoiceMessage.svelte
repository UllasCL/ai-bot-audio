<script lang="ts">
  import MessageContainer from './MessageContainer.svelte';
  import AudioPlayer from '../audio/AudioPlayer.svelte';
  
  export let text: string;
  export let audioUrl: string;
  export let isBot: boolean;
</script>

<MessageContainer {isBot}>
  <div class="voice-message">
    <p class="message-text">{text}</p>
    <div class="audio-player-container">
      <AudioPlayer {audioUrl} />
    </div>
  </div>
</MessageContainer>

<style>
  .voice-message {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .message-text {
    margin: 0;
    line-height: 1.4;
  }

  .audio-player-container {
    margin-top: 4px;
  }
</style>