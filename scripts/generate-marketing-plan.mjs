import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

/* ---------- Paleta ---------- */
const RED = '#E11D48';
const INK = '#101012';
const DARK = '#0C0C0C';
const GRAY = '#3F3F46';
const BODY = '#52525B';
const LIGHT = '#71717A';
const LINE = '#E4E4E7';

const OUT_DIR = path.resolve('docs');
const OUT_FILE = path.join(OUT_DIR, 'Inkepilef_Plan_de_Marketing.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  bufferPages: true,
  margins: { top: 64, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'Inkepilef — Plan de Marketing y Crecimiento',
    Author: 'Equipo de Desarrollo',
    Subject: 'Estrategia de marketing digital, redes sociales y captación de clientes',
  },
});

doc.pipe(fs.createWriteStream(OUT_FILE));

const PAGE_W = doc.page.width;
const ML = doc.page.margins.left;
const MR = doc.page.margins.right;
const CONTENT_W = PAGE_W - ML - MR;
const BOTTOM = doc.page.height - doc.page.margins.bottom;

/* ---------- Helpers ---------- */
const ensure = (h) => {
  if (doc.y + h > BOTTOM) doc.addPage();
};

let sectionNum = 0;
const sectionTitle = (text) => {
  sectionNum += 1;
  if (doc.y > doc.page.margins.top + 6) doc.addPage();
  const y = doc.y;
  doc.save();
  doc.rect(ML, y, CONTENT_W, 34).fill(INK);
  doc.rect(ML, y, 5, 34).fill(RED);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(15).text(`${sectionNum}.  ${text}`, ML + 16, y + 9);
  doc.restore();
  doc.y = y + 46;
  doc.fillColor(BODY).font('Helvetica').fontSize(10.5);
};

const subhead = (text) => {
  ensure(30);
  doc.moveDown(0.3);
  doc.fillColor(RED).font('Helvetica-Bold').fontSize(11.5).text(text, ML, doc.y, { width: CONTENT_W });
  doc.moveDown(0.3);
  doc.fillColor(BODY).font('Helvetica').fontSize(10.5);
};

const para = (text, opts = {}) => {
  doc.fillColor(opts.color || BODY).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(opts.size || 10.5);
  const h = doc.heightOfString(text, { width: CONTENT_W, align: 'justify', lineGap: 2.5 });
  ensure(h + 4);
  doc.text(text, ML, doc.y, { width: CONTENT_W, align: 'justify', lineGap: 2.5 });
  doc.moveDown(opts.gap ?? 0.55);
};

const bullets = (items, opts = {}) => {
  doc.font('Helvetica').fontSize(opts.size || 10.5);
  for (const it of items) {
    const label = Array.isArray(it) ? it[0] : null;
    const body = Array.isArray(it) ? it[1] : it;
    const text = label ? `${label}: ${body}` : body;
    const h = doc.heightOfString(text, { width: CONTENT_W - 16, lineGap: 2 });
    ensure(h + 6);
    const yy = doc.y;
    doc.save().rect(ML + 1, yy + 4.5, 3.5, 3.5).fill(RED).restore();
    if (label) {
      doc.fillColor(INK).font('Helvetica-Bold').text(label, ML + 14, yy, { continued: true, width: CONTENT_W - 14, lineGap: 2 });
      doc.fillColor(BODY).font('Helvetica').text(`: ${body}`, { width: CONTENT_W - 14, lineGap: 2 });
    } else {
      doc.fillColor(BODY).font('Helvetica').text(body, ML + 14, yy, { width: CONTENT_W - 14, lineGap: 2 });
    }
    doc.moveDown(0.32);
  }
  doc.moveDown(0.25);
};

const steps = (items) => {
  doc.font('Helvetica').fontSize(10.5);
  items.forEach((it, i) => {
    const label = Array.isArray(it) ? it[0] : null;
    const body = Array.isArray(it) ? it[1] : it;
    const text = label ? `${label} — ${body}` : body;
    const h = doc.heightOfString(text, { width: CONTENT_W - 26, lineGap: 2 });
    ensure(h + 10);
    const yy = doc.y;
    doc.save();
    doc.circle(ML + 8, yy + 6, 8.5).fill(RED);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(String(i + 1), ML + 4.5, yy + 2.5, { width: 8, align: 'center' });
    doc.restore();
    if (label) {
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(10.5).text(label, ML + 26, yy, { continued: true, width: CONTENT_W - 26, lineGap: 2 });
      doc.fillColor(BODY).font('Helvetica').text(` — ${body}`, { width: CONTENT_W - 26, lineGap: 2 });
    } else {
      doc.fillColor(BODY).font('Helvetica').fontSize(10.5).text(body, ML + 26, yy, { width: CONTENT_W - 26, lineGap: 2 });
    }
    doc.moveDown(0.4);
  });
  doc.moveDown(0.2);
};

const callout = (title, text) => {
  const innerW = CONTENT_W - 28;
  doc.font('Helvetica-Bold').fontSize(10.5);
  const th = doc.heightOfString(title, { width: innerW });
  doc.font('Helvetica').fontSize(10);
  const bh = doc.heightOfString(text, { width: innerW, lineGap: 2 });
  const boxH = th + bh + 24;
  ensure(boxH + 8);
  const y = doc.y;
  doc.save();
  doc.roundedRect(ML, y, CONTENT_W, boxH, 6).fill('#FCF0F3');
  doc.rect(ML, y, 4, boxH).fill(RED);
  doc.fillColor(RED).font('Helvetica-Bold').fontSize(10.5).text(title, ML + 16, y + 10, { width: innerW });
  doc.fillColor('#7A1F32').font('Helvetica').fontSize(10).text(text, ML + 16, doc.y + 2, { width: innerW, lineGap: 2 });
  doc.restore();
  doc.y = y + boxH + 8;
};

/* ================= PORTADA ================= */
doc.save();
doc.rect(0, 0, PAGE_W, doc.page.height).fill(DARK);
doc.rect(0, 0, PAGE_W, 6).fill(RED);
doc.fillColor('#A1A1AA').font('Helvetica-Bold').fontSize(11).text('TATTOO STUDIO · MAIPÚ, SANTIAGO', ML, 140, { characterSpacing: 2 });
doc.fillColor(RED).font('Helvetica-Bold').fontSize(58).text('INK', ML, 172, { continued: true });
doc.fillColor('#F4F4F5').text('EPILEF');
doc.fillColor('#F4F4F5').font('Helvetica-Bold').fontSize(26).text('Plan de Marketing y Crecimiento', ML, 250);
doc.fillColor('#71717A').font('Helvetica').fontSize(13).text(
  'Estrategia paso a paso para conseguir más clientes, reservas, seguidores y alcance — con foco en Instagram, TikTok, Facebook y publicidad local.',
  ML, 288, { width: CONTENT_W - 40, lineGap: 3 }
);

const cardY = 372;
doc.roundedRect(ML, cardY, CONTENT_W, 150, 8).fillAndStroke('#141417', '#27272A');
const metaRows = [
  ['Preparado para', 'Felipe I. Reyes V. — Inkepilef Tattoo Studio'],
  ['Objetivo', 'Crecimiento de clientes, reservas y comunidad'],
  ['Canales', 'Instagram · TikTok · Facebook · Web · Google'],
  ['Versión', 'Plan 1.0 · Hoja de ruta 30-60-90 días'],
  ['Uso', 'Guía de implementación para el estudio'],
];
let ry = cardY + 20;
for (const [k, v] of metaRows) {
  doc.fillColor('#71717A').font('Helvetica-Bold').fontSize(9.5).text(k.toUpperCase(), ML + 20, ry, { width: 120 });
  doc.fillColor('#F4F4F5').font('Helvetica').fontSize(10.5).text(v, ML + 150, ry, { width: CONTENT_W - 170 });
  ry += 25;
}
doc.fillColor('#52525B').font('Helvetica').fontSize(9).text(
  'Documento estratégico. Las cifras de presupuesto y frecuencia son recomendaciones ajustables a la realidad del estudio.',
  ML, doc.page.height - 92, { width: CONTENT_W }
);
doc.restore();

/* ================= CONTENIDO ================= */

sectionTitle('Resumen ejecutivo');
para(
  'Este plan convierte la presencia digital de Inkepilef en una máquina constante de reservas. El estudio ya tiene lo más difícil: trabajo de calidad en negro y grises (realismo, blackwork, fine line y tradicional), más de 7 años de experiencia y una comunidad en redes. Lo que falta es un sistema: publicar con intención, aparecer ante gente nueva de la zona, y transformar seguidores en clientes que agendan y pagan su abono.'
);
para(
  'La estrategia se apoya en tres motores: (1) contenido de video corto (Reels y TikTok) para ganar alcance y seguidores nuevos; (2) un perfil de Instagram ordenado que convierte visitas en reservas; y (3) publicidad local de bajo costo para acelerar. Todo apunta a un mismo destino: la agenda de reservas del sitio web.'
);
subhead('Objetivos medibles (primeros 90 días)');
bullets([
  ['Alcance', 'duplicar las visualizaciones mensuales publicando video corto de forma constante.'],
  ['Comunidad', 'crecer seguidores reales y locales (no números vacíos), enfocados en Santiago.'],
  ['Reservas', 'aumentar consultas por DM/WhatsApp y convertirlas en citas con abono.'],
  ['Reputación', 'sumar reseñas y testimonios que generen confianza y recomendación.'],
]);
callout('Idea central', 'El contenido atrae, el perfil convierte y el abono confirma. Cada pieza que publiques debe empujar a la persona un paso más cerca de agendar. Sin ese sistema, más seguidores no significan más ingresos.');

sectionTitle('Marca y posicionamiento');
para(
  'Antes de publicar hay que tener claro qué vende Inkepilef y a quién. Un mensaje claro hace que el contenido y la publicidad funcionen mucho mejor.'
);
subhead('Propuesta de valor (lo que te hace elegible)');
bullets([
  ['Especialista, no generalista', 'negro y grises con dominio de realismo, blackwork, fine line y tradicional. La especialización atrae mejores clientes y permite cobrar más.'],
  ['Experiencia comprobable', '+7 años y recorrido en Santiago Centro, malls e Iquique. Es prueba de confianza: muéstralo.'],
  ['Piezas personalizadas', 'cada diseño se adapta a la idea, anatomía y personalidad. Es tu diferenciador frente a estudios "de catálogo".'],
  ['Higiene y acompañamiento', 'estándares estrictos y seguimiento desde el diseño hasta la cicatrización. La seguridad es un argumento de venta, sobre todo para primerizos.'],
]);
subhead('Público objetivo');
bullets([
  ['Primario', 'personas de 20 a 40 años en Santiago (foco poniente: Maipú, Cerrillos, Estación Central, Pudahuel) que buscan tatuajes en negro y grises de calidad.'],
  ['Secundario', 'clientes de piezas grandes (brazos, espaldas) dispuestos a varias sesiones; y primerizos que valoran la seguridad y la asesoría.'],
]);
subhead('Tono y estética de marca');
para(
  'Elegante, oscuro, profesional y cercano. Coherencia visual: fotos bien iluminadas sobre fondos limpios, edición sobria (no saturar filtros), y siempre el mismo estilo de portada en Reels. La marca "INKEPILEF" (INK en rojo + EPILEF) debe verse igual en la web, el perfil y las miniaturas.'
);

sectionTitle('Auditoría y optimización de Instagram');
para(
  'Instagram es tu vitrina principal y donde tienes más seguidores. Esta sección es la que puedes enviar directo al estudio: es una lista concreta de qué revisar y corregir. El objetivo es que cualquiera que llegue al perfil entienda en 5 segundos qué haces, dónde y cómo agendar.'
);
subhead('A) Perfil y biografía');
bullets([
  ['Cuenta profesional', 'cambiar a cuenta de Empresa/Creador (gratis) para acceder a estadísticas, botones de contacto y promociones. Ajustes > Tipo de cuenta.'],
  ['Nombre (campo buscable)', 'poner "Inkepilef | Tatuajes Blackwork & Realismo" — Instagram busca por el campo "Nombre", así que incluir el estilo y no solo el @ ayuda a que te encuentren.'],
  ['Foto de perfil', 'el logotipo INKEPILEF sobre fondo oscuro, legible en tamaño pequeño. Que sea igual en todas las redes para reconocimiento.'],
  ['Bio en 3 líneas', 'línea 1: qué haces (Blackwork · Realismo · Fine Line). Línea 2: dónde y cómo (Maipú, Santiago · Solo con cita y abono). Línea 3: llamado a la acción (Agenda aquí ↓).'],
  ['Enlace', 'usar un enlace único (Instagram permite varios o un Linktree) que lleve a: Agendar en la web, WhatsApp, y cuidados. El primer enlace debe ser la AGENDA del sitio.'],
  ['Botones de acción', 'activar botones de Contacto, WhatsApp y (si aplica) Reservar. Zona/dirección aproximada sin exponer el domicilio exacto (ver sección de estudio en casa).'],
  ['Categoría', 'elegir "Tatuador/a" o "Artista" para que el perfil muestre la etiqueta profesional.'],
]);
callout('Fórmula de bio lista para copiar', 'INKEPILEF — Tatuajes en negro y grises\nBlackwork · Realismo · Fine Line · Tradicional\nMaipú, Santiago · +7 años · Solo con cita y abono\nReserva tu hora ↓');

subhead('B) Historias destacadas (Highlights)');
para(
  'Los destacados son tu "menú" permanente. Ordénalos con portadas del mismo estilo (íconos simples en rojo/negro) y en este orden:'
);
bullets([
  ['Agenda / Reservas', 'cómo agendar paso a paso, horarios, y el link. Es el destacado más importante.'],
  ['Abono', 'explicar el abono de $15.000, que se descuenta del total y la política de cambios con 3 días. Evita malentendidos y filtra clientes serios.'],
  ['Estilos', 'ejemplos separados por Blackwork, Realismo, Fine Line, Tradicional.'],
  ['Cicatrización', 'los cuidados con Aquaphor (ya están en la web: enlázalos). Da confianza y reduce consultas repetidas.'],
  ['Ubicación', 'referencia de la zona (Maipú), cómo llegar y estacionamiento, sin publicar la dirección exacta hasta confirmar la cita.'],
  ['Testimonios', 'capturas de mensajes de clientes felices y fotos ya cicatrizadas.'],
]);

subhead('C) Feed y calidad de las fotos');
bullets([
  ['Consistencia visual', 'mantener una edición pareja (mismo contraste y temperatura) para que el perfil se vea como una marca, no como una galería suelta.'],
  ['Cómo fotografiar', 'luz natural o un aro de luz, fondo limpio (tela negra o piel sin distracciones), enfocar el detalle, y tomar la foto apenas termina la sesión (antes de la inflamación fuerte). Limpiar el exceso de tinta y crema para que no brille.'],
  ['Foto + contexto', 'sube la pieza cicatrizada cuando puedas: demuestra que el trabajo aguanta en el tiempo (tu propio eslogan).'],
  ['Portadas de Reels', 'diseñar miniaturas con un texto corto (ej: "Blackwork brazo completo") para que el feed se vea ordenado y cada Reel invite a entrar.'],
]);
callout('Errores comunes a corregir', 'Fotos oscuras o borrosas, feed sin identidad, bio sin llamado a la acción, no responder DMs a tiempo, no tener destacado de "cómo agendar", y publicar solo el resultado sin mostrar proceso ni persona detrás.');

sectionTitle('Estrategia de contenido');
para(
  'La regla de oro: publicar contenido que sirva a la audiencia, no solo fotos del trabajo. Mezcla estos cuatro pilares para no aburrir y para atraer distintos tipos de personas.'
);
subhead('Los 4 pilares de contenido');
bullets([
  ['Mostrar (40%)', 'proceso y resultados: timelapse de la sesión, antes/después, detalle de línea y sombra. Es lo que genera "quiero uno así".'],
  ['Enseñar (25%)', 'cuidados, cómo elegir un diseño, qué duele más/menos, mitos, cómo se prepara la piel. Posiciona a Felipe como experto.'],
  ['Conectar (20%)', 'la persona detrás: el estudio, la rutina, por qué tatúa, responder preguntas. La gente reserva con quien le da confianza.'],
  ['Vender (15%)', 'cupos disponibles, cómo agendar, promociones puntuales, recordar el abono. Directo pero sin saturar.'],
]);
subhead('Calendario semanal sugerido (sostenible)');
bullets([
  ['3 a 5 Reels por semana', 'es el formato que más alcance da hoy. Prioriza cantidad sostenible sobre perfección.'],
  ['1 a 2 carruseles', 'antes/después o "3 estilos que trabajo", que se guardan y comparten.'],
  ['Stories diarias (2 a 5)', 'proceso del día, encuestas, cupos, repost de clientes. Mantienen la cuenta "viva".'],
  ['1 publicación de valor', 'un post educativo o de testimonio que puedas fijar o usar en destacados.'],
]);
subhead('Hashtags y descubrimiento');
bullets([
  ['Mezcla de tamaños', 'combina hashtags grandes (#tattoo #blackwork), medianos (#tatuajeschile #realismochile) y locales/nicho (#tatuajesmaipu #tattoosantiago #tatuadorchileno). 5 a 10 bien elegidos.'],
  ['Geolocalización', 'siempre etiquetar la ubicación (Maipú / Santiago) en posts y stories: ayuda a que te vea gente cercana.'],
  ['Texto con intención', 'la primera línea del pie debe enganchar (una pregunta o afirmación potente), no empezar por hashtags.'],
]);

sectionTitle('Reels y TikTok: el motor de crecimiento');
para(
  'El video corto es hoy la forma más rápida y barata de llegar a personas que aún no te siguen. TikTok e Instagram Reels muestran tu contenido a desconocidos según el interés, no según cuántos seguidores tienes. Por eso un estudio nuevo puede explotar con un solo buen video. Publica el mismo video en ambas plataformas (descarga sin marca de agua).'
);
subhead('Tipos de video que funcionan para tatuadores');
bullets([
  ['Timelapse del proceso', 'de la piel en blanco al resultado final en 15-30 segundos. El clásico que nunca falla.'],
  ['Antes / después', 'coberturas (tapar un tatuaje viejo) y transformaciones: altísimo impacto.'],
  ['Detalle satisfactorio', 'primer plano de la línea, el sombreado o el difuminado en negro y grises.'],
  ['Historia de la pieza', 'el cliente cuenta qué significa su tatuaje (con permiso): conecta emocionalmente y se comparte.'],
  ['Detrás de escena', 'preparación, higiene, montaje del estudio: transmite profesionalismo y seguridad.'],
  ['Educativo rápido', '"3 cosas antes de tu primer tatuaje", "cómo cuidarlo", "por qué pido abono". Responde dudas reales.'],
]);
subhead('Reglas para que el video rinda');
bullets([
  ['Gancho en 2 segundos', 'el primer instante decide si se quedan. Empieza por el momento más impactante o un texto potente en pantalla.'],
  ['Audios en tendencia', 'usar sonidos que están sonando (aparecen con una flecha ↗ en TikTok/Reels) multiplica el alcance.'],
  ['Vertical y buena luz', '9:16, enfoque estable (trípode o soporte) e iluminación pareja.'],
  ['Texto en pantalla', 'subtítulos y frases cortas: la mayoría ve sin sonido.'],
  ['Constancia', 'mejor 1 video diario imperfecto que 1 perfecto al mes. El algoritmo premia la frecuencia.'],
  ['Llamado final', 'cierra con "agenda por DM" o "link en la bio" para convertir la vista en consulta.'],
]);

sectionTitle('Facebook y presencia local');
para(
  'Facebook llega a un público algo mayor y es fuerte para lo local. No requiere tanto esfuerzo si reutilizas el contenido de Instagram, pero abre puertas que IG no.'
);
bullets([
  ['Vincular con Instagram', 'conectar ambas cuentas en Meta Business Suite para publicar y programar una sola vez en los dos lados.'],
  ['Grupos locales', 'participar (aportando, no spameando) en grupos de compra/venta y comunidad de Maipú y comunas vecinas. Responder cuando alguien pregunta por tatuadores.'],
  ['Marketplace y eventos', 'publicar disponibilidad de cupos y flash days como si fueran "productos"/eventos locales.'],
  ['Reseñas en la página', 'pedir a clientes que dejen recomendación en la página de Facebook: suma prueba social.'],
]);

sectionTitle('Publicidad pagada (Meta Ads)');
para(
  'Cuando el contenido orgánico ya funciona, la publicidad acelera. Con poco presupuesto se puede llegar a cientos de personas de la zona. Empieza simple y escala lo que funcione. Se gestiona desde Meta Business Suite / Administrador de anuncios (cubre Instagram y Facebook a la vez).'
);
subhead('Cómo empezar (sin desperdiciar plata)');
steps([
  ['Promociona lo que ya gustó', 'toma tu Reel o post con mejor rendimiento orgánico y ponle presupuesto. Ya está validado, así que rinde más.'],
  ['Objetivo correcto', 'para captar reservas usa el objetivo "Mensajes" (que escriban por WhatsApp/DM) o "Tráfico" hacia la agenda de la web. Evita "Interacciones", que trae likes vacíos.'],
  ['Segmentación local', 'ubicación: Maipú + radio de 10-15 km. Edad 20-40. Intereses: tatuajes, arte corporal, estudios de tatuajes. Empieza amplio y deja que la plataforma optimice.'],
  ['Presupuesto de prueba', 'partir con un monto bajo diario y sostenido por 4-7 días (mejor constante que un golpe único). Medir costo por conversación/clic.'],
  ['Creatividad que convierte', 'video corto vertical + texto claro: "Agenda tu tatuaje en Maipú. Reserva con abono, cupos limitados". CTA visible.'],
  ['Medir y escalar', 'apagar lo que trae consultas caras, subir presupuesto a lo que trae consultas baratas. Repetir cada semana.'],
]);
callout('Regla de oro de la pauta', 'Nunca pauses tráfico frío directo a "comprar". El camino es: video que llama la atención → perfil o web que genera confianza → conversación por DM/WhatsApp → reserva con abono. La publicidad solo acelera un embudo que ya funciona orgánicamente.');

sectionTitle('De seguidor a reserva: conversión');
para(
  'Muchos estudios pierden clientes no por falta de seguidores, sino por un proceso de reserva confuso o lento. Este es el punto que más ingresos genera si lo ordenas bien.'
);
subhead('El embudo ideal');
steps([
  ['Descubre', 'la persona ve un Reel o un anuncio.'],
  ['Confía', 'entra al perfil ordenado, ve trabajos, cuidados y testimonios.'],
  ['Consulta', 'escribe por DM o WhatsApp con su idea (respuesta rápida = más cierres).'],
  ['Reserva', 'se le envía el link de la agenda del sitio y se confirma con el abono.'],
  ['Fideliza', 'post-sesión: cuidados, foto del resultado y recordatorio para la próxima pieza.'],
]);
subhead('Herramientas de conversión');
bullets([
  ['WhatsApp Business', 'con catálogo, respuestas rápidas guardadas y mensaje de bienvenida. Es donde se cierra la mayoría de las citas en Chile.'],
  ['Respuestas guardadas', 'plantillas para "precios", "cómo agendar", "cuidados" y "abono": responder en segundos aumenta el cierre.'],
  ['Agenda web + abono', 'usar el sitio de Inkepilef para mostrar disponibilidad y formalizar. El abono filtra curiosos y reduce las inasistencias.'],
  ['Tiempo de respuesta', 'responder dentro de la primera hora sube muchísimo la tasa de reserva. Activar notificaciones.'],
]);
callout('Plantilla de respuesta a "¿cuánto cuesta?"', '"¡Hola! Gracias por escribir a Inkepilef. El valor depende del tamaño, zona y detalle. ¿Me cuentas tu idea y me envías una referencia? Con eso te doy un valor y coordinamos. Se reserva con un abono de $15.000 que se descuenta del total."');

sectionTitle('Reputación, reseñas y boca a boca');
para(
  'La recomendación sigue siendo la mayor fuente de clientes de un tatuador. Hay que provocarla de forma sistemática, no esperar a que ocurra.'
);
bullets([
  ['Google Business Profile', 'crear la ficha del estudio (ver nota de estudio en casa) para aparecer en Google Maps y recibir reseñas. Muchas personas buscan "tatuajes Maipú" en Google.'],
  ['Pedir reseñas', 'al terminar y cuando el cliente manda foto feliz, pedir reseña en Google/Instagram. Facilitar el link directo.'],
  ['Programa de referidos', 'descuento al cliente que trae a un amigo (y al amigo). Convierte cada cliente en promotor.'],
  ['Testimonios en video', 'un cliente contando su experiencia vale más que mil fotos. Pídelo con permiso.'],
  ['Colaboraciones', 'canjes con microinfluencers locales o modelos: un tatuaje a cambio de contenido y difusión real a su audiencia.'],
]);

sectionTitle('Estudio en casa: cómo manejarlo');
para(
  'Tener el estudio en casa es una ventaja (menos costos, ambiente íntimo) pero exige cuidar la privacidad y transmitir profesionalismo y seguridad.'
);
bullets([
  ['Dirección por privado', 'no publicar el domicilio exacto. Mostrar la comuna (Maipú) y enviar la ubicación exacta solo al confirmar la cita con abono.'],
  ['Google Business como "área de servicio"', 'se puede crear la ficha sin mostrar la dirección exacta, indicando la zona que atiendes. Así apareces en búsquedas locales sin exponer tu casa.'],
  ['Ambiente profesional', 'mostrar en contenido un rincón ordenado, limpio e higiénico. La percepción de seguridad es clave cuando no es un local comercial.'],
  ['Seguridad y confianza', 'reforzar higiene, materiales sellados y acompañamiento. Los testimonios ayudan a vencer la duda de "es en una casa".'],
]);

sectionTitle('Métricas: qué medir cada semana');
para(
  'Lo que no se mide, no mejora. Dedica 15 minutos por semana a revisar estos números desde las estadísticas de Instagram/TikTok y del administrador de anuncios.'
);
bullets([
  ['Alcance y visualizaciones', '¿cuántas personas nuevas te vieron? Es el termómetro del crecimiento.'],
  ['Guardados y compartidos', 'mejor señal de calidad que los likes: indican contenido útil o deseable.'],
  ['Visitas al perfil y clics al enlace', 'miden cuántos pasaron de "ver" a "interesarse".'],
  ['Conversaciones iniciadas', 'DMs y WhatsApp nuevos por semana: la antesala de la reserva.'],
  ['Reservas y abonos', 'el número que importa. Anota de dónde llegó cada cliente (Reel, anuncio, referido) para invertir en lo que funciona.'],
]);

sectionTitle('Caja de herramientas recomendada');
subhead('Edición de video (Reels/TikTok)');
bullets([
  ['CapCut', 'edición vertical, plantillas, subtítulos automáticos y acceso a audios en tendencia. Gratis y estándar del rubro.'],
  ['InShot', 'alternativa simple para recortar y ajustar clips rápido.'],
]);
subhead('Diseño gráfico (portadas, destacados, flyers)');
bullets([
  ['Canva', 'portadas de Reels, íconos de destacados, flyers de cupos y placas de precios. Guarda plantillas con la marca para mantener coherencia.'],
]);
subhead('Programación y gestión');
bullets([
  ['Meta Business Suite', 'programar y publicar en Instagram y Facebook, ver estadísticas y responder mensajes desde un solo lugar. Gratis.'],
  ['Metricool o Later', 'programar en varias redes (incluido TikTok) y analizar el mejor horario para publicar.'],
]);
subhead('Atención y reservas');
bullets([
  ['WhatsApp Business', 'catálogo, respuestas rápidas y etiquetas de clientes.'],
  ['Agenda web Inkepilef', 'disponibilidad y formalización con abono (ya desarrollada).'],
  ['Google Business Profile', 'presencia en Maps y reseñas.'],
]);

sectionTitle('Hoja de ruta 30-60-90 días');
subhead('Días 1-30 — Ordenar la casa');
bullets([
  'Pasar Instagram a cuenta profesional y reescribir la bio con la fórmula de este plan.',
  'Crear/ordenar los destacados (Agenda, Abono, Estilos, Cicatrización, Ubicación, Testimonios).',
  'Configurar WhatsApp Business con respuestas guardadas y enlazar la agenda web en la bio.',
  'Abrir/optimizar TikTok y publicar el primer lote de Reels reutilizando material existente.',
  'Crear la ficha de Google Business como área de servicio (Maipú).',
]);
subhead('Días 31-60 — Constancia y alcance');
bullets([
  'Sostener 3-5 Reels por semana + stories diarias, usando audios en tendencia.',
  'Empezar a pedir reseñas y testimonios de forma sistemática tras cada sesión.',
  'Probar la primera campaña de "Mensajes" con presupuesto bajo hacia público local.',
  'Revisar métricas semanalmente y doblar apuesta en el tipo de contenido que más alcance trae.',
]);
subhead('Días 61-90 — Escalar lo que funciona');
bullets([
  'Escalar el presupuesto de los anuncios que traen consultas baratas; apagar el resto.',
  'Lanzar un programa de referidos y una colaboración con un microinfluencer local.',
  'Sistematizar el contenido en un calendario mensual (lotes de grabación por sesión).',
  'Fijar objetivos del próximo trimestre según los números reales obtenidos.',
]);

sectionTitle('Checklist rápido');
bullets([
  'Bio clara con estilo, zona, abono y llamado a la acción.',
  'Enlace a la agenda web como primer link del perfil.',
  'Destacados ordenados con portadas de marca.',
  'Cuenta profesional activada (IG y TikTok) con estadísticas.',
  '3-5 Reels/semana con gancho en 2 segundos y audio en tendencia.',
  'Mismo video en Instagram y TikTok (sin marca de agua).',
  'Ubicación etiquetada en cada publicación.',
  'WhatsApp Business con respuestas guardadas y tiempo de respuesta < 1 hora.',
  'Reseñas de Google e Instagram pedidas tras cada sesión.',
  'Ficha de Google Business creada (área de servicio).',
  'Métricas revisadas cada semana; presupuesto de ads en lo que convierte.',
  'Dirección exacta solo tras confirmar cita con abono.',
]);
para(
  'Con este sistema, el crecimiento deja de depender de la suerte: cada semana publicas con intención, apareces ante gente nueva de tu zona, y conviertes ese interés en reservas reales. La calidad del trabajo ya está; ahora se trata de que la vea la mayor cantidad de personas correctas.',
  { gap: 1 }
);

/* ---------- Pie de página ---------- */
const range = doc.bufferedPageRange();
const footY = doc.page.height - 42;
for (let i = range.start + 1; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0;
  doc.moveTo(ML, footY).lineTo(ML + CONTENT_W, footY).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor(LIGHT);
  doc.text('INKEPILEF · Plan de Marketing y Crecimiento', ML, footY + 6, { width: CONTENT_W / 2, lineBreak: false });
  doc.text(`Página ${i - range.start} de ${range.count - 1}`, ML + CONTENT_W / 2, footY + 6, {
    width: CONTENT_W / 2,
    align: 'right',
    lineBreak: false,
  });
}

doc.end();
console.log('PDF generado en', OUT_FILE);
