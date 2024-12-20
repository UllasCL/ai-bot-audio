<div class="recording-animation">
    <div class="pulse-ring"></div>
    <div class="wave-container">
        {#each Array(5) as _, i}
            <div class="wave-bar" style="--delay: {i * 0.1}s"></div>
        {/each}
    </div>
    <div class="ripple"></div>
</div>

<style>
    .recording-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .pulse-ring {
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-radius: 50%;
        border: 2px solid #dc3545;
        animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    .wave-container {
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 2px;
        padding: 3px 6px;
        background: rgba(220, 53, 69, 0.15);
        border-radius: 10px;
    }

    .wave-bar {
        width: 2px;
        height: 8px;
        background: #dc3545;
        border-radius: 1px;
        animation: wave 0.5s ease-in-out infinite;
        animation-delay: var(--delay);
    }

    .ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: rgba(220, 53, 69, 0.2);
        animation: ripple 2s linear infinite;
    }

    @keyframes pulse-ring {
        0% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.2);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 0.5;
        }
    }

    @keyframes wave {
        0%, 100% { height: 8px; }
        50% { height: 16px; }
    }

    @keyframes ripple {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
        }
        100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
        }
    }
</style>
