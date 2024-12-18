<!-- Loading spinner component -->
<script lang="ts">
  export let size: number = 24;
</script>

<div class="loader" style="width: {size}px; height: {size}px;">
  <div class="spinner"></div>
</div>

<style>
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
  }

  .spinner {
    width: 100%;
    height: 100%;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4169E1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>