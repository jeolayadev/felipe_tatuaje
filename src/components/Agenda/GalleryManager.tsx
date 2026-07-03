import { useState, type ChangeEvent } from 'react';
import { useGallery } from '../../hooks/useGallery';
import { fileToDataUrl } from '../../utils/image';
import styles from './GalleryManager.module.scss';

/**
 * Panel del tatuador para administrar las imágenes del portafolio y el carrusel.
 * Todo se guarda en el navegador (beta); con Firebase pasará a la nube.
 */
export const GalleryManager = () => {
  const {
    images,
    carouselCount,
    autoplayMs,
    addImage,
    updateImage,
    removeImage,
    moveImage,
    setCarouselCount,
    setAutoplayMs,
    resetGallery,
  } = useGallery();

  const [newSrc, setNewSrc] = useState('');
  const [newTitulo, setNewTitulo] = useState('');
  const [newCategoria, setNewCategoria] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  const categorias = Array.from(new Set(images.map((i) => i.categoria)));

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg('');
    try {
      const src = await fileToDataUrl(file);
      setNewSrc(src);
      if (!newTitulo) setNewTitulo(file.name.replace(/\.[^.]+$/, '').slice(0, 40));
    } catch {
      setMsg('No se pudo procesar la imagen. Prueba con otra foto (JPG o PNG).');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const add = () => {
    if (!newSrc) {
      setMsg('Primero sube una foto.');
      return;
    }
    const ok = addImage({
      src: newSrc,
      titulo: newTitulo.trim() || 'Sin título',
      categoria: newCategoria.trim() || 'General',
      alt: newTitulo.trim() || 'Tatuaje del estudio',
    });
    if (!ok) {
      setMsg('No queda espacio en el navegador para más fotos (límite de la beta). Elimina alguna o usa imágenes más livianas.');
      return;
    }
    setNewSrc('');
    setNewTitulo('');
    setNewCategoria('');
    setMsg('Imagen agregada. Ya aparece en la vista cliente.');
  };

  const startEdit = (id: string, titulo: string, categoria: string) => {
    setEditingId(id);
    setEditTitulo(titulo);
    setEditCategoria(categoria);
    setMsg('');
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateImage(editingId, {
      titulo: editTitulo.trim() || 'Sin título',
      categoria: editCategoria.trim() || 'General',
      alt: editTitulo.trim() || 'Tatuaje del estudio',
    });
    setEditingId(null);
    setMsg('Cambios guardados.');
  };

  const remove = (id: string) => {
    const ok = removeImage(id);
    if (!ok) setMsg('Debe quedar al menos una imagen en la galería.');
  };

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <div>
          <span className={styles.eyebrow}>Contenido</span>
          <h3>Galería y carrusel</h3>
          <p>Administra las fotos del portafolio, cuántas se muestran y a qué velocidad giran. Los cambios se reflejan al instante en la vista cliente.</p>
        </div>
        <button type="button" className={styles.reset} onClick={() => { resetGallery(); setMsg('Galería restaurada a las fotos originales.'); }}>
          Restaurar
        </button>
      </header>

      {/* Ajustes del carrusel */}
      <div className={styles.settings}>
        <div className={styles.setting}>
          <label>Fotos en el carrusel</label>
          <div className={styles.stepper}>
            <button type="button" onClick={() => setCarouselCount(carouselCount - 1)} aria-label="Menos fotos" disabled={carouselCount <= 1}>−</button>
            <strong>{carouselCount}</strong>
            <button type="button" onClick={() => setCarouselCount(carouselCount + 1)} aria-label="Más fotos" disabled={carouselCount >= images.length}>+</button>
          </div>
          <small>de {images.length} disponibles</small>
        </div>

        <div className={styles.setting}>
          <label>Velocidad del carrusel</label>
          <input
            type="range"
            min={1500}
            max={9000}
            step={500}
            value={autoplayMs}
            onChange={(e) => setAutoplayMs(Number(e.target.value))}
          />
          <small>{(autoplayMs / 1000).toFixed(1)} s por foto {autoplayMs <= 3000 ? '(rápido)' : autoplayMs >= 7000 ? '(lento)' : ''}</small>
        </div>
      </div>

      {/* Agregar imagen */}
      <div className={styles.addBox}>
        <div className={styles.addPreview}>
          {newSrc ? <img src={newSrc} alt="Vista previa" /> : <span>{busy ? 'Procesando…' : 'Sin foto'}</span>}
        </div>
        <div className={styles.addFields}>
          <label className={styles.fileLabel}>
            {busy ? 'Procesando…' : 'Subir foto'}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
          </label>
          <input
            type="text"
            placeholder="Título (ej: Medusa en brazo)"
            value={newTitulo}
            onChange={(e) => setNewTitulo(e.target.value)}
            maxLength={50}
          />
          <input
            type="text"
            list="gal-cats"
            placeholder="Estilo (ej: Realismo)"
            value={newCategoria}
            onChange={(e) => setNewCategoria(e.target.value)}
            maxLength={30}
          />
          <datalist id="gal-cats">
            {categorias.map((c) => <option key={c} value={c} />)}
          </datalist>
          <button type="button" className={styles.addBtn} onClick={add} disabled={!newSrc}>
            Agregar
          </button>
        </div>
      </div>

      {msg && <p className={styles.msg} aria-live="polite">{msg}</p>}

      {/* Lista de imágenes */}
      <div className={styles.list}>
        {images.map((img, i) => {
          const shown = i < carouselCount;
          const editing = editingId === img.id;
          return (
            <article key={img.id} className={`${styles.item} ${shown ? '' : styles.hidden}`}>
              <img className={styles.thumb} src={img.src} alt={img.alt || img.titulo} />

              {editing ? (
                <div className={styles.itemEdit}>
                  <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} maxLength={50} placeholder="Título" />
                  <input type="text" list="gal-cats" value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} maxLength={30} placeholder="Estilo" />
                </div>
              ) : (
                <div className={styles.itemInfo}>
                  <strong>{img.titulo}</strong>
                  <span>{img.categoria}</span>
                  {!shown && <em>Oculta (fuera del carrusel)</em>}
                </div>
              )}

              <div className={styles.itemActions}>
                <button type="button" onClick={() => moveImage(img.id, -1)} disabled={i === 0} aria-label="Subir" title="Subir">↑</button>
                <button type="button" onClick={() => moveImage(img.id, 1)} disabled={i === images.length - 1} aria-label="Bajar" title="Bajar">↓</button>
                {editing ? (
                  <>
                    <button type="button" className={styles.save} onClick={saveEdit}>Guardar</button>
                    <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => startEdit(img.id, img.titulo, img.categoria)}>Modificar</button>
                    <button type="button" className={styles.del} onClick={() => remove(img.id)}>Eliminar</button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className={styles.note}>
        Beta: las fotos se guardan en este navegador. Con la próxima etapa (Firebase) quedarán en la nube y visibles desde cualquier dispositivo.
      </p>
    </section>
  );
};

export default GalleryManager;
