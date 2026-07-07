import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

/* ---------- Paleta ---------- */
const RED = '#E11D48';
const INK = '#101012';
const DARK = '#0C0C0C';
const BODY = '#52525B';
const LIGHT = '#71717A';
const LINE = '#E4E4E7';
const GREEN = '#15803D';

const OUT_DIR = path.resolve('docs');
const OUT_FILE = path.join(OUT_DIR, 'Inkepilef_Guia_Primera_Campana.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  bufferPages: true,
  margins: { top: 64, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'Inkepilef — Guía de Acción: Primera Campaña',
    Author: 'Dirección de Marketing',
    Subject: 'Plan operativo paso a paso para lanzar las campañas del estudio',
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
const sectionTitle = (text, opts = {}) => {
  if (!opts.noNum) sectionNum += 1;
  if (doc.y > doc.page.margins.top + 6) doc.addPage();
  const y = doc.y;
  doc.save();
  doc.rect(ML, y, CONTENT_W, 34).fill(INK);
  doc.rect(ML, y, 5, 34).fill(RED);
  const label = opts.noNum ? text : `${sectionNum}.  ${text}`;
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(14.5).text(label, ML + 16, y + 10);
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

const check = (items) => {
  doc.font('Helvetica').fontSize(10.5);
  for (const it of items) {
    const label = Array.isArray(it) ? it[0] : null;
    const body = Array.isArray(it) ? it[1] : it;
    const text = label ? `${label}: ${body}` : body;
    const h = doc.heightOfString(text, { width: CONTENT_W - 22, lineGap: 2 });
    ensure(h + 8);
    const yy = doc.y;
    doc.save();
    doc.rect(ML + 1, yy + 1.5, 9, 9).lineWidth(1.1).stroke(RED);
    doc.restore();
    if (label) {
      doc.fillColor(INK).font('Helvetica-Bold').text(label, ML + 20, yy, { continued: true, width: CONTENT_W - 20, lineGap: 2 });
      doc.fillColor(BODY).font('Helvetica').text(`: ${body}`, { width: CONTENT_W - 20, lineGap: 2 });
    } else {
      doc.fillColor(BODY).font('Helvetica').text(body, ML + 20, yy, { width: CONTENT_W - 20, lineGap: 2 });
    }
    doc.moveDown(0.35);
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

const callout = (title, text, color = RED, bg = '#FCF0F3', fg = '#7A1F32') => {
  const innerW = CONTENT_W - 28;
  doc.font('Helvetica-Bold').fontSize(10.5);
  const th = doc.heightOfString(title, { width: innerW });
  doc.font('Helvetica').fontSize(10);
  const bh = doc.heightOfString(text, { width: innerW, lineGap: 2 });
  const boxH = th + bh + 24;
  ensure(boxH + 8);
  const y = doc.y;
  doc.save();
  doc.roundedRect(ML, y, CONTENT_W, boxH, 6).fill(bg);
  doc.rect(ML, y, 4, boxH).fill(color);
  doc.fillColor(color).font('Helvetica-Bold').fontSize(10.5).text(title, ML + 16, y + 10, { width: innerW });
  doc.fillColor(fg).font('Helvetica').fontSize(10).text(text, ML + 16, doc.y + 2, { width: innerW, lineGap: 2 });
  doc.restore();
  doc.y = y + boxH + 8;
};

const script = (title, text) => {
  const innerW = CONTENT_W - 28;
  doc.font('Helvetica-Bold').fontSize(9.5);
  const th = doc.heightOfString(title, { width: innerW });
  doc.font('Courier').fontSize(9.5);
  const bh = doc.heightOfString(text, { width: innerW, lineGap: 2.5 });
  const boxH = th + bh + 26;
  ensure(boxH + 8);
  const y = doc.y;
  doc.save();
  doc.roundedRect(ML, y, CONTENT_W, boxH, 6).fillAndStroke('#F6F6F7', '#E4E4E7');
  doc.fillColor(LIGHT).font('Helvetica-Bold').fontSize(9.5).text(title.toUpperCase(), ML + 14, y + 9, { width: innerW, characterSpacing: 0.5 });
  doc.fillColor('#27272A').font('Courier').fontSize(9.5).text(text, ML + 14, doc.y + 3, { width: innerW, lineGap: 2.5 });
  doc.restore();
  doc.y = y + boxH + 8;
};

/* ================= PORTADA ================= */
doc.save();
doc.rect(0, 0, PAGE_W, doc.page.height).fill(DARK);
doc.rect(0, 0, PAGE_W, 6).fill(RED);
doc.fillColor('#A1A1AA').font('Helvetica-Bold').fontSize(11).text('TATTOO STUDIO · PROVIDENCIA, SANTIAGO', ML, 130, { characterSpacing: 2 });
doc.fillColor(RED).font('Helvetica-Bold').fontSize(54).text('INK', ML, 162, { continued: true });
doc.fillColor('#F4F4F5').text('EPILEF');
doc.fillColor('#F4F4F5').font('Helvetica-Bold').fontSize(24).text('Guía de Acción — Primera Campaña', ML, 236);
doc.fillColor('#71717A').font('Helvetica').fontSize(12.5).text(
  'Manual operativo paso a paso: desde cero hasta la campaña encendida. Qué preparar, qué configurar (clic por clic), qué escribir en WhatsApp y qué medir cada día.',
  ML, 272, { width: CONTENT_W - 30, lineGap: 3 }
);

const cardY = 360;
doc.roundedRect(ML, cardY, CONTENT_W, 172, 8).fillAndStroke('#141417', '#27272A');
const metaRows = [
  ['Fase 0', 'Preparación completa (gratis) — 1 a 2 días'],
  ['Fase 1', 'Campaña TEST: CLP $5.000 — 2 días'],
  ['Fase 2', 'Campaña núcleo: CLP $25.000/semana continuos'],
  ['Zona', 'Providencia + radio (estudio del cliente)'],
  ['Destino', 'WhatsApp +56 9 9094 0050 → reserva con abono'],
  ['Ejecuta', 'Tú (Jean) · Aprueba y atiende: Felipe'],
];
let ry = cardY + 18;
for (const [k, v] of metaRows) {
  doc.fillColor('#71717A').font('Helvetica-Bold').fontSize(9.5).text(k.toUpperCase(), ML + 20, ry, { width: 90 });
  doc.fillColor('#F4F4F5').font('Helvetica').fontSize(10.5).text(v, ML + 120, ry, { width: CONTENT_W - 140 });
  ry += 25;
}
doc.fillColor('#52525B').font('Helvetica').fontSize(9).text(
  'Basado en la consultoría de adquisición de 30 días (docs/Inkepilef_Consultoria_Ads_30dias.md). Los montos y reglas de decisión provienen de ese análisis.',
  ML, doc.page.height - 96, { width: CONTENT_W, lineGap: 2 }
);
doc.restore();

/* ================= CONTENIDO ================= */

sectionTitle('El mapa del camino (léelo en 1 minuto)');
para(
  'Este plan tiene tres fases. La Fase 0 no cuesta dinero y es OBLIGATORIA: si el embudo no está listo, la publicidad quema plata. La Fase 1 gasta $5.000 en probar que todo funciona de punta a punta. La Fase 2 enciende la campaña real con los $25.000 semanales y no se apaga.'
);
steps([
  ['FASE 0 · Preparación (día 1–2, $0)', 'WhatsApp Business + Instagram profesional + Business Suite + Google Business + material creativo listo.'],
  ['FASE 1 · Test de humo (día 3–4, $5.000)', 'una mini-campaña que valida: anuncio aprobado, clic abre WhatsApp, conversaciones llegan y se responden.'],
  ['FASE 2 · Campaña núcleo (día 5 en adelante, $25.000/semana)', 'una sola campaña SIEMPRE encendida a ~$3.500/día, con dos anuncios compitiendo. Se recarga cada viernes.'],
]);
callout(
  'Cambio importante respecto al plan anterior',
  'El estudio de Felipe está en PROVIDENCIA (las citas se atienden sí o sí allá). Por lo tanto TODA la segmentación geográfica de esta guía es Providencia + radio 7 km — no Maipú. Esto es mejor para la campaña: zona densa, céntrica y con alto poder adquisitivo.'
);

sectionTitle('FASE 0 · Checklist A — WhatsApp Business (30 min)');
para('El dinero de los anuncios termina aquí. Sin esto listo, no se enciende nada.');
check([
  ['Instalar', 'app WhatsApp Business (gratis) en el teléfono de Felipe, con el número +56 9 9094 0050.'],
  ['Perfil', 'nombre "Inkepilef Tattoo Studio", foto = logo, descripción "Tatuajes en negro y grises · Realismo · Blackwork · Fine Line · Providencia, solo con cita", horario, y el link de la web.'],
  ['Mensaje de bienvenida', 'activar en Herramientas de empresa → Mensaje de bienvenida (texto exacto en la sección 8).'],
  ['Respuestas rápidas', 'crear /cotiza /abono /cuidados /ubicacion /seguimiento (textos exactos en la sección 8).'],
  ['Etiquetas', 'crear: Nuevo · Cotizado · Abonado · Tatuado · Frío. Es tu CRM.'],
  ['Notificaciones', 'activadas y con sonido. Regla de oro: responder en menos de 15 minutos en horario hábil.'],
]);

sectionTitle('FASE 0 · Checklist B — Instagram y Business Suite (45 min)');
check([
  ['Cuenta profesional', 'Instagram → Configuración → Tipo de cuenta → Cambiar a cuenta profesional → Empresa. Categoría: Tatuador/a.'],
  ['Nombre buscable', 'en el campo "Nombre" poner: Inkepilef | Tatuajes Blackwork & Realismo.'],
  ['Bio (3 líneas)', 'Tatuajes en negro y grises · Realismo · Blackwork · Fine Line / Providencia, Santiago · +7 años · Solo con cita y abono / Reserva tu hora ↓'],
  ['Link', 'el enlace de la bio apunta a la AGENDA de la web (jeolayadev.github.io/felipe_tatuaje).'],
  ['Destacados', 'Agenda · Abono · Estilos · Cicatrización · Testimonios (portadas sobrias, mismo estilo).'],
  ['Página de Facebook', 'si no existe: crearla con el mismo nombre y logo (es requisito técnico para la pauta).'],
  ['Business Suite', 'entrar a business.facebook.com con la cuenta de Felipe → conectar la página de FB y el IG.'],
  ['Vincular WhatsApp', 'Business Suite → Configuración → WhatsApp → conectar el +56 9 9094 0050 (llega un código al teléfono). SIN esto no existen los anuncios que abren WhatsApp.'],
]);

sectionTitle('FASE 0 · Checklist C — Google Business + material (45 min)');
check([
  ['Google Business Profile', 'business.google.com → crear ficha "Inkepilef Tattoo Studio" como ÁREA DE SERVICIO (Providencia), sin dirección exacta visible. Categoría: Estudio de tatuajes.'],
  ['Reseñas', 'pedir a 3–5 ex-clientes reales que dejen reseña con foto. Enviarles el link directo.'],
  ['Elegir 2 creativos', 'los 2 mejores videos/Reels existentes de Felipe: vertical 9:16, idealmente 15–30 s, que muestren proceso y resultado. Si solo hay fotos, elegir las 2 más impactantes (Medusa / floral).'],
  ['Verificar gancho', 'los primeros 2 segundos deben mostrar lo mejor (el resultado o el detalle), no una intro lenta.'],
  ['Cuenta publicitaria', 'Administrador de anuncios (adsmanager.facebook.com) → configurar método de pago (tarjeta o crédito prepago de Meta).'],
  ['Límite de seguridad', 'Configuración de la cuenta publicitaria → Límite de gasto de la cuenta: CLP 30.000. Airbag contra errores.'],
]);

sectionTitle('FASE 1 · La campaña TEST de $5.000 (clic por clic)');
para(
  'Objetivo del test: NO es vender. Es validar que el anuncio se aprueba, que el clic abre WhatsApp con el mensaje precargado, que llegan conversaciones a costo razonable y que Felipe responde a tiempo. Con $5.000 se compran esas certezas antes de arriesgar los $25.000.'
);
subhead('Configuración exacta en el Administrador de Anuncios');
steps([
  ['Crear campaña', 'adsmanager.facebook.com → Crear → Objetivo: "Interacción". Nombre: TEST-CTWA-Providencia.'],
  ['Nivel campaña', 'Presupuesto de campaña (Advantage/CBO): DESACTIVADO. Sin A/B de Meta, sin extras.'],
  ['Conjunto de anuncios', 'Conversión: "Apps de mensajería" → WhatsApp → seleccionar la página de Facebook (con el WhatsApp ya vinculado del Checklist B).'],
  ['Presupuesto', 'Diario: CLP $2.500. Duración: 2 días (inicio hoy, fin en 48 h). Total = $5.000.'],
  ['Geografía', 'Eliminar "Chile". Buscar "Providencia" → soltar el pin → radio 7 km. Opción "Personas que viven o estuvieron hace poco en este lugar".'],
  ['Edad y género', '20 a 45 · Todos. Intereses: NO agregar ninguno (dejarlo amplio; el anuncio filtra solo).'],
  ['Ubicaciones', 'Advantage+ (automáticas). Meta reparte entre Feed, Reels y Stories.'],
  ['Anuncio', 'Formato: un solo video (el mejor Reel). Texto principal y título: usar el COPY A de la sección 7. Llamado a la acción: "Enviar mensaje de WhatsApp".'],
  ['Plantilla de mensaje', 'en la sección "Plantilla de mensajes" del anuncio, definir el mensaje que le llega precargado al cliente: "Hola Felipe 👋 vi tu anuncio y quiero cotizar un tatuaje. Mi idea es:"'],
  ['Publicar y verificar', 'Publicar → esperar aprobación (minutos a horas). Cuando esté activo: buscar el anuncio en el feed (o con la vista previa), hacer clic TÚ MISMO y comprobar que WhatsApp abre con el texto precargado. Responder ese chat de prueba.'],
]);
subhead('Cómo leer el resultado del test (a las 48 h)');
check([
  ['Anuncio aprobado y activo', 'si Meta lo rechaza: revisar que el video no tenga marcas de agua de TikTok ni texto excesivo, y apelar.'],
  ['Llegaron conversaciones', 'en Ads Manager, columna "Resultados" = conversaciones con mensajes iniciadas.'],
  ['Costo por conversación ≤ $2.500', 'columna "Costo por resultado". Si está entre $800 y $2.500: EXCELENTE, luz verde.'],
  ['Respuesta < 15 min', 'auditar la bandeja de WhatsApp: ¿Felipe respondió rápido y con el guion?'],
]);
callout(
  'Decisión al final del test',
  'VERDE (conversaciones a ≤ $2.500 y respondidas): pasar a Fase 2 el viernes. AMARILLO (conversaciones caras > $2.500): pasar a Fase 2 igual, pero cambiando el video por el segundo creativo. ROJO (cero conversaciones o clic no abre WhatsApp): NO gastar más; revisar vínculo de WhatsApp en Business Suite y calidad del gancho del video, repetir test.'
);

sectionTitle('FASE 2 · La campaña núcleo ($25.000/semana, siempre encendida)');
steps([
  ['Duplicar', 'en Ads Manager, duplicar la campaña TEST. Renombrar: NUCLEO-CTWA-Providencia.'],
  ['Presupuesto', 'cambiar el diario a CLP $3.500 y QUITAR la fecha de término (correr sin fin). $3.500 × 7 = $24.500 ≈ los $25.000 del viernes.'],
  ['Dos anuncios', 'dentro del mismo conjunto: Anuncio A (copy directo, sección 7) y Anuncio B (copy emocional). Mismo video o dos videos distintos si hay material.'],
  ['Encender', 'publicar. A partir de aquí la campaña NO SE PAUSA — cada pausa reinicia el aprendizaje de Meta y encarece todo.'],
  ['Recarga semanal', 'cada viernes, verificar que el saldo/método de pago cubre la semana siguiente. La campaña sigue sola.'],
  ['Regla de los 6 días', 'no tocar NADA durante los primeros 6 días salvo que un anuncio gaste $7.000 sin ninguna conversación (en ese caso, apagar SOLO ese anuncio).'],
  ['Optimización semanal (viernes, 20 min)', 'comparar costo por conversación de A vs B: si uno duplica al otro, apagar el caro y dejar todo el gasto en el ganador. Un cambio por semana, máximo.'],
  ['Escalar', 'si el costo por conversación es ≤ $1.500 sostenido y las reservas fluyen: subir el diario en +20% (a $4.200) y esperar 3 días antes de volver a subir.'],
]);

sectionTitle('Los guiones de WhatsApp (copiar y pegar)');
script('Mensaje de bienvenida (automático)', 'Hola! Soy Felipe de Inkepilef 🖤 Gracias por escribir.\nCuentame: 1) Que idea tienes? 2) En que zona del cuerpo?\n3) Tamano aproximado en cm?\nCon eso te doy valor y fechas hoy mismo.');
script('/cotiza — respuesta con rango y fechas', 'Por lo que me describes, va entre $XX.000 y $XX.000.\nTengo [dia] a las [hora] o [dia] a las [hora].\nCual te acomoda?');
script('/abono — cierre de la reserva', 'Para dejar tu hora firme es un abono de $15.000 que se\ndescuenta del total. Puedes pagarlo aqui: [link Mercado Pago].\nAl confirmarse te envio la direccion exacta en Providencia\ny las indicaciones. Quedan pocos cupos esta semana!');
script('/seguimiento — si no responde (+24 h)', 'Hola! Pudiste ver la cotizacion? Sigo teniendo el cupo del\n[dia] 😉 Si prefieres otra fecha, dime y lo cuadramos.');
script('/cuidados — post sesion', 'Gracias por confiar en Inkepilef! Tus cuidados: lava con\njabon neutro 2-3 veces al dia, capa fina de Aquaphor los\nprimeros 3-5 dias, no sol ni piscina hasta cicatrizar.\nGuia completa: [link seccion Cuidados de la web]');
callout(
  'Regla que multiplica todo el plan',
  'Responder en menos de 15 minutos en horario habil. Un lead de anuncio es caliente y efimero: a las 24 horas ya cotizo con otro tatuador. Tres barridos fijos al dia: 9:00, 14:00 y 21:00, mas responder al vuelo cuando suene.'
);

sectionTitle('Copys de los anuncios');
script('COPY A — directo (anuncio principal)', 'TITULO: Tatuajes en negro y grises — Providencia\n\nTEXTO: Llevas meses con la idea en la cabeza?\nRealismo, blackwork y fine line con +7 anos de\nexperiencia. Estudio privado en Providencia, atencion\n1 a 1, higiene certificada. Cupos limitados este mes.\nEscribeme y te respondo hoy con valor y fecha. 👇\n\nCTA: Enviar mensaje de WhatsApp');
script('COPY B — emocional (anuncio alternativo)', 'TITULO: Hay historias que merecen quedarse en la piel\n\nTEXTO: Un recuerdo, una persona, una etapa. Diseno tu\ntatuaje desde cero para que cuente exactamente TU\nhistoria — en negro y grises, con el detalle que merece.\nCuentame tu idea por WhatsApp; la conversamos sin\ncompromiso.\n\nCTA: Enviar mensaje');
para('El A ataca la objeción "seguro ni contestan" prometiendo respuesta hoy; el B apela al motivo de compra #1 del rubro (tatuajes con significado). Compiten en la misma campaña y Meta reparte el gasto al que mejor rinde.');

sectionTitle('Rutina diaria y semanal (checklist)');
subhead('Todos los días (30–45 min)');
check([
  '09:00 — Barrido de WhatsApp: responder TODO. Etiquetar (Nuevo/Cotizado/Abonado).',
  '09:15 — 1 story en IG: proceso de hoy, cupo disponible, o pregunta-respuesta.',
  '14:00 — Segundo barrido de WhatsApp + seguimientos de +24 h.',
  '21:00 — Tercer barrido + dejar programado el contenido de mañana (Business Suite).',
]);
subhead('Cadencia semanal');
check([
  ['Lunes', 'publicar Reel #1 (proceso). Anunciar cupos de la semana en stories.'],
  ['Martes', 'revisar métricas de la campaña (15 min): costo por conversación de A y B.'],
  ['Miércoles', 'Reel #2 (resultado/antes-después). Grabar clips en la sesión del día.'],
  ['Jueves', 'foto o carrusel de pieza terminada. Seguimientos +72 h (última llamada).'],
  ['Viernes', 'RECARGA de los $25.000 + revisión completa (20 min): matar/escalar según reglas. Story "quedan X cupos".'],
  ['Sábado', 'Reel #3. Pedir reseña de Google a los tatuados de la semana.'],
  ['Domingo', 'descanso o repost. Planificar contenido de la semana siguiente.'],
]);

sectionTitle('Los números que importan (y dónde verlos)');
para('En Ads Manager, configura las columnas: Configurar columnas → Personalizar → agregar "Resultados", "Costo por resultado", "Importe gastado", "CTR" e "Impresiones".');
check([
  ['Costo por conversación (CPL)', 'OBJETIVO: $800–$2.500. Es LA métrica. Todo lo demás es secundario.'],
  ['CTR', 'sano si ≥ 1%. Si está bajo 0,8%, el gancho del video no funciona: cambiar los primeros 2 segundos.'],
  ['Conversación → Reserva', 'OBJETIVO: 10–25%. Se mide contando etiquetas de WhatsApp (Abonado ÷ Nuevo). Si está bajo, el problema es el chat, no el anuncio.'],
  ['Reservas por semana', 'el número final. Con $25.000/semana, esperar 2–4 reservas semanales en régimen (rango del análisis de consultoría).'],
]);
callout(
  'Semáforo del día 10 (desde el inicio de la Fase 2)',
  'VERDE: CPL ≤ $2.000 y ≥ 2 reservas acumuladas → escalar +20%. AMARILLO: CPL $2.000–3.000 → cambiar gancho del video ganador. ROJO: sin conversaciones o sin respuestas < 1 h → pausar solo si el embudo está roto (WhatsApp desvinculado), corregir y reencender. La campaña no se apaga por ansiedad.',
  GREEN, '#EFF9F1', '#14532D'
);

sectionTitle('Errores prohibidos');
check([
  'Pausar la campaña "para ver qué pasa" → reinicia el aprendizaje de Meta y encarece todo.',
  'Crear 3 campañas con el mismo presupuesto → ninguna aprende. UNA campaña, dos anuncios.',
  'Poner intereses "tatuajes" + 10 filtros → sube el costo sin mejorar el lead. Amplio + geografía.',
  'Responder WhatsApp a las 5 horas → el lead ya cotizó con otro. 15 minutos.',
  'Responder "¿precio? → $90.000" seco → siempre rango + pregunta + 2 fechas para elegir.',
  'Optimizar por likes o alcance → el objetivo de campaña es SIEMPRE mensajes/WhatsApp.',
  'Juzgar el rendimiento en 48 horas → mínimo 4–6 días de datos antes de decidir.',
  'Publicar la dirección exacta del estudio → la dirección va por WhatsApp tras el abono.',
]);

sectionTitle('Calendario de los primeros 30 días');
check([
  ['Días 1–2', 'FASE 0 completa (checklists A, B y C). Nada de pauta todavía.'],
  ['Días 3–4', 'FASE 1: test de $5.000 corriendo. Verificación del embudo con clic propio.'],
  ['Día 5 (viernes)', 'decisión del test → encender FASE 2 con $3.500/día y los 2 anuncios.'],
  ['Días 5–11', 'no tocar la campaña. Rutina diaria + 3 Reels. Viernes: recarga + revisión.'],
  ['Días 12–18', 'primera optimización real: matar el anuncio caro si duplica al barato. Semáforo del día 10.'],
  ['Días 19–25', 'si hay verde: escalar +20%. Anunciar Flash Day para la semana final (10 diseños, precio fijo, con abono).'],
  ['Días 26–30', 'Flash Day + recuperación de fríos por lista de difusión ("se abrió un cupo el [día]"). Cierre de métricas: CPL, reservas, CAC, ingreso vs gasto → decidir presupuesto del mes 2 con datos reales.'],
]);
para(
  'Cierre: si al día 30 la campaña generó al menos 6–8 reservas con abono (escenario esperado del análisis), la publicidad se paga sola varias veces — y la decisión correcta será reinvertir parte de esos ingresos en subir el presupuesto diario del mes 2.',
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
  doc.text('INKEPILEF · Guía de Acción — Primera Campaña', ML, footY + 6, { width: CONTENT_W / 2, lineBreak: false });
  doc.text(`Página ${i - range.start} de ${range.count - 1}`, ML + CONTENT_W / 2, footY + 6, {
    width: CONTENT_W / 2,
    align: 'right',
    lineBreak: false,
  });
}

doc.end();
console.log('PDF generado en', OUT_FILE);
