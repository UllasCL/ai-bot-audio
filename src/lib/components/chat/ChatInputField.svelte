<script lang="ts">
  export let value: string;
  export let onSubmit: () => void;
  export let disabled = false;
</script>

<input
  type="text"
  bind:value
  {disabled}
  placeholder="Ask your query..."
  on:keydown={(e) => e.key === 'Enter' && onSubmit()}
/>

<style>
  input {
    flex: 1;
    min-width: 0;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 24px;
    font-size: 16px;
    color: #3154b3;
    background-color: white;
    transition: opacity 0.2s;
  }

  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  input::placeholder {
    color: #888;
  }
</style>