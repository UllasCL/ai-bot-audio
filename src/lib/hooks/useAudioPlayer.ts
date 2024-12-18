import { writable, derived } from 'svelte/store';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
}

export function createAudioPlayer(audioUrl: string) {
  const state = writable<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    error: null
  });

  const audio = new Audio();

  function setupAudioEvents() {
    audio.src = audioUrl;
    audio.preload = 'metadata';

    audio.onplay = () => updateState({ isPlaying: true });
    audio.onpause = () => updateState({ isPlaying: false });
    audio.onended = () => updateState({ isPlaying: false, currentTime: 0 });
    audio.onloadedmetadata = () => updateState({ duration: audio.duration });
    audio.ontimeupdate = () => updateState({ currentTime: audio.currentTime });
    audio.onerror = () => {
      const errorMessage = audio.error 
        ? `Error code: ${audio.error.code}, message: ${audio.error.message}`
        : 'Unknown playback error';
      
      updateState({ 
        error: errorMessage,
        isPlaying: false 
      });
    };
  }

  function updateState(newState: Partial<AudioPlayerState>) {
    state.update(s => ({ ...s, ...newState }));
  }

  async function togglePlay() {
    try {
      updateState({ error: null });
      
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error('Playback error:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Playback failed',
        isPlaying: false 
      });
    }
  }

  function cleanup() {
    audio.pause();
    audio.src = '';
    audio.remove();
  }

  setupAudioEvents();

  return {
    isPlaying: derived(state, $state => $state.isPlaying),
    currentTime: derived(state, $state => $state.currentTime),
    duration: derived(state, $state => $state.duration),
    error: derived(state, $state => $state.error),
    togglePlay,
    cleanup
  };
}