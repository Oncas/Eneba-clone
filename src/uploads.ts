import path from 'path';

// Uploaded images live in <project root>/uploads and are served at /uploads.
// The database stores only the public path, e.g. /uploads/<name>.jpg.
export const UPLOAD_DIR = path.join(__dirname, '../uploads');
export const UPLOAD_URL_PATH = '/uploads';
