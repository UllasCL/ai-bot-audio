<script lang="ts">
  export let currentTime: number = 0;
  export let duration: number = 0;

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
</script>

<div class="progress-container">
  <div class="progress-bar">
    <div class="progress" style="width: {progress}%"></div>
  </div>
  <div class="time">
    {formatTime(currentTime)} / {formatTime(duration)}
  </div>
</div>

<style>
  .progress-container {
    flex: 1;
    min-width: 150px;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .progress {
    height: 100%;
    background: #4169E1;
    transition: width 0.1s linear;
  }

  .time {
    font-size: 12px;
    color: #666;
  }
</style>