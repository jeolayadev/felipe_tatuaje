import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve('./public/gallery');
const ORIGINALS = path.join(ROOT, 'originals');
const WEB = path.join(ROOT, 'web');
const THUMBS = path.join(ROOT, 'thumbs');

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
}

async function main() {
  await ensureDir(WEB);
  await ensureDir(THUMBS);

  const entries = await fs.readdir(ORIGINALS);
  const images = entries.filter(f => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of images) {
    const inPath = path.join(ORIGINALS, file);
    const outWeb = path.join(WEB, file);
    const outThumb = path.join(THUMBS, file);

    try {
      const img = sharp(inPath).rotate();

      // Web version: max width 1600
      await img.resize({ width: 1600, withoutEnlargement: true }).toFile(outWeb);

      // Thumbnail: max width 500
      await sharp(inPath).resize({ width: 500, withoutEnlargement: true }).toFile(outThumb);
    } catch (err) {
      console.error('Error processing', file, err.message);
    }
  }

  // Ensure credits.csv exists
  const credits = path.join(ROOT, 'credits.csv');
  try {
    await fs.access(credits);
  } catch {
    await fs.writeFile(credits, 'filename,source,url,license,model_release,notes\n');
  }

  console.log('Procesado completado:', images.length, 'imágenes');
}

main().catch(err => { console.error(err); process.exit(1); });
