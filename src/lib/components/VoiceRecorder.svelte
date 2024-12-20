<script lang="ts">
    import {createEventDispatcher, onDestroy} from 'svelte';
    import RecordButton from './RecordButton.svelte';
    import AudioPlayer from './AudioPlayer.svelte';
    import {AudioRecorder} from '../services/audioRecorder';
    import {analyzeVoice} from '../services/voiceApi';
    import type {VoiceAnalysisResponse} from '../types/voice';
    import type {BaseError} from '../types/errors';

    let isRecording = false;
    let audioURL: string | null = null;
    let audioRecorder = new AudioRecorder();
    let analysisResult: VoiceAnalysisResponse | null = null;
    let error: string | null = null;
    let isProcessing = false;

    const dispatch = createEventDispatcher();

    onDestroy(() => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
    });

    async function toggleRecording() {
        try {
            error = null;

            if (isRecording) {
                await stopRecording();
            } else {
                await startRecording();
            }
        } catch (err) {
            handleError(err as BaseError);
        } finally {
            isProcessing = false;
        }
    }

    async function startRecording() {
        await audioRecorder.start();
        isRecording = true;
        analysisResult = null;
    }

    async function stopRecording() {
        isProcessing = true;
        const audioBlob = await audioRecorder.stop();
        isRecording = false;

        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }

        audioURL = URL.createObjectURL(audioBlob);


        try {
            analysisResult = await analyzeVoice(audioBlob);
        } catch (err) {
            throw err;
        }
    }

    $: if (audioURL){
        dispatch('send', {
            type: 'voice',
            content: 'Voice message',
            audioUrl: audioURL
        });
        dispatch('send', {
            type: 'text',
            content: 'Voice message',
            audioUrl: audioURL
        });
    }
  function handleError(err: BaseError) {
    console.error('Recording error:', err);
    error = err.message;
    isRecording = false;
  }
</script>

<div class="voice-recorder">
    <RecordButton
            {isRecording}
            disabled={isProcessing}
            on:click={toggleRecording}
    />

  {#if audioURL}
    <AudioPlayer {audioURL} />
  {/if}

  {#if analysisResult?.audioUrl}
    <AudioPlayer audioURL={analysisResult.audioUrl} />
  {/if}
</div>

<style>
    .voice-recorder {
        position: relative;
        min-width: 4px;
        height: 44px;
        padding: 0;
        background: #4169E1;
        color: white;
        border: none;
        border-radius: 22px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
        overflow: visible;
    }
</style>
