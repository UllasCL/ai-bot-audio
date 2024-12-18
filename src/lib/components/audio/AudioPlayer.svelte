<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createAudioPlayer } from '../../hooks/useAudioPlayer';
  import AudioControls from './AudioControls.svelte';
  import AudioProgress from './AudioProgress.svelte';

  export let audioUrl: string;
  
  const { 
    isPlaying, 
    currentTime,
    duration,
    error,
    togglePlay, 
    cleanup 
  } = createAudioPlayer(audioUrl);

  let retryCount = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  async function handlePlayError() {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying playback (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      await togglePlay();
    }
  }

  $: if ($error && retryCount < MAX_RETRIES) {
    handlePlayError();
  }
  
  onDestroy(cleanup);
</script>

<div class="audio-player">
  {#if $error && retryCount >= MAX_RETRIES}
    <div class="error-message">
      Failed to play audio. Please try again later.
    </div>
  {:else}
    <AudioControls 
      isPlaying={$isPlaying} 
      onToggle={togglePlay} 
    />
    {#if $duration > 0}
      <AudioProgress 
        currentTime={$currentTime} 
        duration={$duration} 
      />
    {/if}
  {/if}
</div>

<style>
  .audio-player {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-radius: 8px;
    width: fit-content;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.875rem;
    padding: 0.5rem;
  }
</style>