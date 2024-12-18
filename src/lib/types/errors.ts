export interface BaseError {
  message: string;
  originalError?: unknown;
}

export interface RecordingError extends BaseError {
  details: string;
}

export interface AudioConversionError extends BaseError {}

export interface ApiError extends BaseError {
  endpoint: string;
}