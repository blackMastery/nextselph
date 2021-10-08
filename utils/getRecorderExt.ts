// https://github.com/collab-project/videojs-record/issues/464

const Mimetypes = {
  "video/ogg": "ogv",
  "video/mp4": "mp4",
  "video/x-matroska": "mkv",
  "video/webm": "webm",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
  "audio/aac": "aac",
  "audio/x-caf": "caf",
  "audio/flac": "flac",
  "audio/ogg": "oga",
  "video/quicktime": "mov",
  "audio/wav": "wav",
  "audio/webm": "webm",
  "application/x-mpegURL": "m3u8",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;

export const mimeToExt = (type: string) => {
  const match = EXTRACT_TYPE_REGEXP.exec(type);
  const result = match && match[1].toLowerCase();
  return Mimetypes[result];
};
