import {get, writable} from 'svelte/store';
import {AudioRecorder} from '../services/audioRecorder';
import {analyzeVoice} from '../services/voiceApi';
import type {VoiceAnalysisResponse} from '../types/voice';

interface VoiceRecorderState {
    isRecording: boolean;
    isProcessing: boolean;
    error: string | null;
    result: VoiceAnalysisResponse | null;
}

export function createVoiceRecorder() {
    const audioRecorder = new AudioRecorder();
    const state = writable<VoiceRecorderState>({
        isRecording: false,
        isProcessing: false,
        error: null,
        result: null
    });

    async function startRecording() {
        try {
            await audioRecorder.start();
            state.update(s => ({...s, isRecording: true, error: null, result: null}));
        } catch (err) {
            handleError(err);
        }
    }

    async function stopRecording() {
        try {

            state.update(s => ({...s, isProcessing: true}));
            const audioBlob = await audioRecorder.stop();
            const result = await analyzeVoice(audioBlob);

            state.update(s => ({
                ...s,
                isRecording: false,
                result
            }));

            return result;
        } catch (err) {
            handleError(err);
        } finally {
            state.update(s => ({...s, isProcessing: false}));
        }
    }

    async function toggleRecording() {
        const currentState = get(state);
        if (currentState.isRecording) {
            return await stopRecording();
        } else {
            await startRecording();
        }
    }

    function handleError(err: any) {
        console.error('Recording error:', err);
        state.update(s => ({
            ...s,
            error: err.message || 'An error occurred while recording',
            isRecording: false,
            isProcessing: false
        }));
    }

    return {
        ...state,
        toggleRecording
    };
}
