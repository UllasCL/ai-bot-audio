<script lang="ts">
  import TextMessage from './messages/TextMessage.svelte';
  import VoiceMessage from './messages/VoiceMessage.svelte';
  
  export let text: string;
  export let isBot: boolean;
  export let audioUrl: string | undefined = undefined;
  export let type: 'text' | 'voice' | 'error' = 'text';
</script>

{#if type === 'voice' && audioUrl}
  <VoiceMessage {text} {audioUrl} {isBot} />
{:else}
  <TextMessage {text} {isBot} />
{/if}