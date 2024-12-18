export const AudioConfig = {
  RECORDING: {
    MIME_TYPE: 'audio/webm',
    CHANNEL_COUNT: 1, // Mono recording
    SAMPLE_RATE: 44100,
    BITS_PER_SECOND: 128000,
    CHUNK_INTERVAL: 100 // ms
  },
  API: {
    SUPPORTED_FORMATS: ['audio/mpeg', 'audio/webm']
  }
} as const;