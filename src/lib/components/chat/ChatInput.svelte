<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { isLoading } from '../../stores/loading';
    import ChatInputField from './ChatInputField.svelte';
    import SendButton from './SendButton.svelte';

    const dispatch = createEventDispatcher();
    let message: string = '';

    function handleSubmit() {
        if (message.trim() && !$isLoading) {
            dispatch('send', { type: 'text', content: message });
            message = '';
        }
    }

    function handleAudioReady(event: CustomEvent<{ audioUrl: string; text: string }>) {
        const { audioUrl, text } = event.detail;
        dispatch('send', {
            type: 'voice',
            content: text,
            audioUrl
        });
    }

    function handleError(event: CustomEvent<string>) {
        dispatch('error', event.detail);
    }
</script>

<div class="input-container">
    <ChatInputField
            bind:value={message}
            onSubmit={handleSubmit}
            disabled={$isLoading}
    />

    <VoiceRecorder
            disabled={$isLoading}
            on:audioReady={handleAudioReady}
            on:error={handleError}
    />

    <SendButton
            on:click={handleSubmit}
            disabled={!message.trim() || $isLoading}
    />
</div>

<style>
    .input-container {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: white;
        border-top: 1px solid #eee;
    }

    @media (max-width: 480px) {
        .input-container {
            padding: 8px;
        }
    }
</style>
