import { AudioConfig } from '../config/audio';
import type { AudioConversionError } from '../types/errors';
import { Mp3Encoder } from 'lamejs';

export async function convertToMP3(audioBlob: Blob): Promise<Blob> {
  try {
    const audioData = await extractAudioData(audioBlob);
    const mp3Data = await encodeMp3(audioData);
    return new Blob([mp3Data], { type: 'audio/mp3' });
  } catch (error) {
    console.error('Audio conversion error:', error);
    throw createConversionError(error);
  }
}

async function extractAudioData(audioBlob: Blob): Promise<{
  samples: Int16Array;
  sampleRate: number;
  channels: number;
}> {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const samples = convertToMono(audioBuffer);
  return {
    samples,
    sampleRate: audioBuffer.sampleRate,
    channels: 1 // We convert to mono
  };
}

function convertToMono(audioBuffer: AudioBuffer): Int16Array {
  const samples = audioBuffer.getChannelData(0);
  const monoSamples = new Int16Array(samples.length);
  
  for (let i = 0; i < samples.length; i++) {
    // Convert Float32 to Int16
    const sample = Math.max(-1, Math.min(1, samples[i]));
    monoSamples[i] = Math.round(sample * 0x7FFF);
  }
  
  return monoSamples;
}

async function encodeMp3(audioData: {
  samples: Int16Array;
  sampleRate: number;
  channels: number;
}): Promise<Uint8Array> {
  const encoder = new Mp3Encoder(
    audioData.channels,
    audioData.sampleRate,
    AudioConfig.MP3.BIT_RATE
  );

  const mp3Data: Uint8Array[] = [];
  const sampleBlockSize = 1152; // Must be 1152 for MP3
  
  for (let i = 0; i < audioData.samples.length; i += sampleBlockSize) {
    const sampleChunk = audioData.samples.subarray(i, i + sampleBlockSize);
    const mp3Buffer = encoder.encodeBuffer(sampleChunk);
    if (mp3Buffer.length > 0) {
      mp3Data.push(new Uint8Array(mp3Buffer));
    }
  }
  
  const finalBuffer = encoder.flush();
  if (finalBuffer.length > 0) {
    mp3Data.push(new Uint8Array(finalBuffer));
  }
  
  return concatenateBuffers(mp3Data);
}

function concatenateBuffers(buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const buffer of buffers) {
    result.set(buffer, offset);
    offset += buffer.length;
  }
  
  return result;
}

function createConversionError(error: unknown): AudioConversionError {
  return {
    message: 'Failed to convert audio to MP3',
    originalError: error
  };
}