<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createAudioPlayer } from '../../hooks/useAudioPlayer';

  export let audioURL: string;
  
  const { isPlaying, togglePlay, cleanup } = createAudioPlayer(audioURL);
  
  onDestroy(cleanup);
</script>

<div class="audio-player">
  <button 
    class="play-button" 
    class:playing={$isPlaying}
    on:click={togglePlay}
    aria-label={$isPlaying ? 'Pause' : 'Play'}
  >
    {#if $isPlaying}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    {/if}
  </button>
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

  .play-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #4169E1;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .play-button:hover {
    background: #3154b3;
  }

  .play-button.playing {
    background: #3154b3;
  }
</style>