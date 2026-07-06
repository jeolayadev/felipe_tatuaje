import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Subida y borrado de imágenes de la galería en Firebase Storage.
 * Las imágenes llegan como data URL (ya redimensionadas por utils/image.ts)
 * y se guardan en gallery/<id>.jpg; en Firestore solo viaja la URL pública.
 */
export const uploadGalleryImage = async (dataUrl: string, id: string): Promise<string> => {
  if (!storage) throw new Error('Storage no está configurado.');
  const objectRef = ref(storage, `gallery/${id}.jpg`);
  await uploadString(objectRef, dataUrl, 'data_url');
  return getDownloadURL(objectRef);
};

/** Borra la imagen si es un objeto nuestro de Storage (best effort). */
export const deleteGalleryImage = async (src: string): Promise<void> => {
  if (!storage || !src.includes('firebasestorage')) return;
  try {
    const url = new URL(src);
    // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path-encoded>?...
    const encoded = url.pathname.split('/o/')[1];
    if (!encoded) return;
    await deleteObject(ref(storage, decodeURIComponent(encoded)));
  } catch {
    /* objeto ya inexistente o sin permiso: no bloquear el flujo */
  }
};
