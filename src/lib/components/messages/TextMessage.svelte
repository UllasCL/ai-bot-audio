<script lang="ts">
  import MessageContainer from './MessageContainer.svelte';
  export let text: string;
  export let isBot: boolean;
</script>

<MessageContainer {isBot}>
  {#each text.split('\n') as line}
    <p class="message-text">{line}</p>
  {/each}
</MessageContainer>

<style>
  .message-text {
    margin: 0;
    line-height: 1.4;
  }
</style>
