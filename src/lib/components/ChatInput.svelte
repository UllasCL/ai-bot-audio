<!--<script lang="ts">-->
<!--    import {createEventDispatcher} from 'svelte';-->
<!--    import {isLoading} from '../stores/loading';-->
<!--    import {createVoiceRecorder} from '../hooks/useVoiceRecorder';-->
<!--    import ChatInputField from './chat/ChatInputField.svelte';-->
<!--    import SendButton from './chat/SendButton.svelte';-->
<!--    import VoiceRecorder from "./VoiceRecorder/index.svelte";-->

<!--    const dispatch = createEventDispatcher();-->
<!--    let message: string = '';-->

<!--    const {-->
<!--        isRecording,-->
<!--        isProcessing,-->
<!--        error,-->
<!--        toggleRecording-->
<!--    } = createVoiceRecorder();-->

<!--    function handleSubmit() {-->
<!--        if (message.trim() && !$isLoading) {-->
<!--            dispatch('send', {type: 'text', content: message});-->
<!--            message = '';-->
<!--        }-->
<!--    }-->

<!--    async function handleVoiceClick() {-->
<!--        if ($isLoading) return;-->

<!--        try {-->
<!--            const result = await toggleRecording();-->
<!--            dispatch('send', {-->
<!--                type: 'voice',-->
<!--                content: 'Voice message',-->
<!--                audioUrl: URL.createObjectURL(result.audioBlob)-->
<!--            });-->

<!--            if (result?.result.audioUrl) {-->
<!--                dispatch('send', {-->
<!--                    type: 'voice',-->
<!--                    content: result.result.text || 'Voice message',-->
<!--                    audioUrl: result.result.audioUrl-->
<!--                });-->
<!--            }-->
<!--        } catch (err) {-->
<!--            if (err instanceof Error) {-->
<!--                dispatch('error', err.message);-->
<!--            }-->
<!--        }-->
<!--    }-->

<!--    $: if (error) {-->
<!--        dispatch('error', error);-->
<!--    }-->
<!--</script>-->

<!--<div class="input-container">-->
<!--    <ChatInputField-->
<!--            bind:value={message}-->
<!--            onSubmit={handleSubmit}-->
<!--            disabled={$isLoading}-->
<!--    />-->

<!--    <VoiceRecorder-->
<!--            isRecording={$isRecording}-->
<!--            isProcessing={$isProcessing || $isLoading}-->
<!--            disabled={$isLoading}-->
<!--            on:click={handleVoiceClick}-->
<!--    />-->

<!--    <SendButton-->
<!--            on:click={handleSubmit}-->
<!--            disabled={!message.trim() || $isLoading}-->
<!--    />-->
<!--</div>-->

<!--<style>-->
<!--    .input-container {-->
<!--        display: flex;-->
<!--        gap: 8px;-->
<!--        padding: 12px;-->
<!--        background: white;-->
<!--        border-top: 1px solid #eee;-->
<!--    }-->

<!--    @media (max-width: 480px) {-->
<!--        .input-container {-->
<!--            padding: 8px;-->
<!--        }-->
<!--    }-->
<!--</style>-->
