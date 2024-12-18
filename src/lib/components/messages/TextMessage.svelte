<script lang="ts">
  import MessageContainer from './MessageContainer.svelte';
  export let text: string;
  export let isBot: boolean;
</script>

<MessageContainer {isBot}>
  <p class="message-text">{text}</p>
</MessageContainer>

<style>
  .message-text {
    margin: 0;
    line-height: 1.4;
  }
</style>