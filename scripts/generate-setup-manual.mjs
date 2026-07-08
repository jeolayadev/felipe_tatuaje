import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

const RED = '#E11D48';
const INK = '#101012';
const DARK = '#0C0C0C';
const BODY = '#3F3F46';
const LIGHT = '#71717A';
const LINE = '#E4E4E7';
const BLUE = '#1D4ED8';

const OUT_DIR = path.resolve('docs');
const OUT_FILE = path.join(OUT_DIR, 'Inkepilef_Manual_Configuracion.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  bufferPages: true,
  margins: { top: 64, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'Inkepilef — Manual de Configuración desde Cero',
    Author: 'Dirección de Marketing',
    Subject: 'Guía técnica detallada para dejar listas todas las plataformas y enlaces',
  },
});
doc.pipe(fs.createWriteStream(OUT_FILE));

const PAGE_W = doc.page.width;
const ML = doc.page.margins.left;
const CONTENT_W = PAGE_W - ML - doc.page.margins.right;
const BOTTOM = doc.page.height - doc.page.margins.bottom;
const ensure = (h) => { if (doc.y + h > BOTTOM) doc.addPage(); };

let sectionNum = 0;
const sectionTitle = (text) => {
  sectionNum += 1;
  if (doc.y > doc.page.margins.top + 6) doc.addPage();
  const y = doc.y;
  doc.save();
  doc.rect(ML, y, CONTENT_W, 34).fill(INK);
  doc.rect(ML, y, 5, 34).fill(RED);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(14).text(`${sectionNum}.  ${text}`, ML + 16, y + 10);
  doc.restore();
  doc.y = y + 46;
  doc.fillColor(BODY).font('Helvetica').fontSize(10.5);
};

const subhead = (text) => {
  ensure(30);
  doc.moveDown(0.25);
  doc.fillColor(RED).font('Helvetica-Bold').fontSize(11).text(text, ML, doc.y, { width: CONTENT_W });
  doc.moveDown(0.28);
  doc.fillColor(BODY).font('Helvetica').fontSize(10.5);
};

const where = (text) => {
  ensure(24);
  const y = doc.y;
  doc.font('Helvetica-Bold').fontSize(9);
  const h = doc.heightOfString('DÓNDE: ' + text, { width: CONTENT_W - 16 });
  doc.save();
  doc.roundedRect(ML, y, CONTENT_W, h + 12, 4).fillAndStroke('#EEF2FF', '#C7D2FE');
  doc.fillColor(BLUE).font('Helvetica-Bold').fontSize(9).text('DÓNDE', ML + 10, y + 6, { continued: true });
  doc.fillColor('#3730A3').font('Helvetica').text('  ' + text, { width: CONTENT_W - 20 });
  doc.restore();
  doc.y = y + h + 12 + 6;
};

const para = (text, opts = {}) => {
  doc.fillColor(opts.color || BODY).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(opts.size || 10.5);
  const h = doc.heightOfString(text, { width: CONTENT_W, align: 'justify', lineGap: 2.5 });
  ensure(h + 4);
  doc.text(text, ML, doc.y, { width: CONTENT_W, align: 'justify', lineGap: 2.5 });
  doc.moveDown(opts.gap ?? 0.5);
};

const steps = (items) => {
  doc.font('Helvetica').fontSize(10.5);
  items.forEach((it, i) => {
    const label = Array.isArray(it) ? it[0] : null;
    const bodyTxt = Array.isArray(it) ? it[1] : it;
    const text = label ? `${label} — ${bodyTxt}` : bodyTxt;
    const h = doc.heightOfString(text, { width: CONTENT_W - 26, lineGap: 2 });
    ensure(h + 9);
    const yy = doc.y;
    doc.save();
    doc.circle(ML + 8, yy + 6, 8.5).fill(RED);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(String(i + 1), ML + 4.5, yy + 2.5, { width: 8, align: 'center' });
    doc.restore();
    if (label) {
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(10.5).text(label, ML + 26, yy, { continued: true, width: CONTENT_W - 26, lineGap: 2 });
      doc.fillColor(BODY).font('Helvetica').text(` — ${bodyTxt}`, { width: CONTENT_W - 26, lineGap: 2 });
    } else {
      doc.fillColor(BODY).font('Helvetica').fontSize(10.5).text(bodyTxt, ML + 26, yy, { width: CONTENT_W - 26, lineGap: 2 });
    }
    doc.moveDown(0.38);
  });
  doc.moveDown(0.15);
};

const check = (items) => {
  doc.font('Helvetica').fontSize(10.5);
  for (const it of items) {
    const label = Array.isArray(it) ? it[0] : null;
    const bodyTxt = Array.isArray(it) ? it[1] : it;
    const text = label ? `${label}: ${bodyTxt}` : bodyTxt;
    const h = doc.heightOfString(text, { width: CONTENT_W - 22, lineGap: 2 });
    ensure(h + 8);
    const yy = doc.y;
    doc.save().rect(ML + 1, yy + 1.5, 9, 9).lineWidth(1.1).stroke(RED).restore();
    if (label) {
      doc.fillColor(INK).font('Helvetica-Bold').text(label, ML + 20, yy, { continued: true, width: CONTENT_W - 20, lineGap: 2 });
      doc.fillColor(BODY).font('Helvetica').text(`: ${bodyTxt}`, { width: CONTENT_W - 20, lineGap: 2 });
    } else {
      doc.fillColor(BODY).font('Helvetica').text(bodyTxt, ML + 20, yy, { width: CONTENT_W - 20, lineGap: 2 });
    }
    doc.moveDown(0.32);
  }
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

/* ============ PORTADA ============ */
doc.save();
doc.rect(0, 0, PAGE_W, doc.page.height).fill(DARK);
doc.rect(0, 0, PAGE_W, 6).fill(RED);
doc.fillColor('#A1A1AA').font('Helvetica-Bold').fontSize(11).text('TATTOO STUDIO · PROVIDENCIA, SANTIAGO', ML, 130, { characterSpacing: 2 });
doc.fillColor(RED).font('Helvetica-Bold').fontSize(52).text('INK', ML, 162, { continued: true });
doc.fillColor('#F4F4F5').text('EPILEF');
doc.fillColor('#F4F4F5').font('Helvetica-Bold').fontSize(23).text('Manual de Configuración desde Cero', ML, 232);
doc.fillColor('#71717A').font('Helvetica').fontSize(12.5).text(
  'Guía técnica detallada, clic por clic: cómo dejar listas todas las plataformas, cómo se enlazan entre sí, qué debe hacer Felipe y qué haces tú. Léelo con el computador al lado.',
  ML, 268, { width: CONTENT_W - 30, lineGap: 3 }
);
const cardY = 360;
doc.roundedRect(ML, cardY, CONTENT_W, 150, 8).fillAndStroke('#141417', '#27272A');
const rows = [
  ['Cuentas de Felipe', 'Instagram, Facebook, WhatsApp, Google, Mercado Pago'],
  ['Cuentas que creas', 'Business Manager, Ad Account, Google Business, CapCut'],
  ['Tu rol', 'Administrador: configuras y operas todo'],
  ['Rol de Felipe', 'Dueño de la marca · aprueba, provee material, responde'],
  ['Tiempo estimado', '2 sesiones (1 h con Felipe + 2-3 h tú solo)'],
];
let ry = cardY + 18;
for (const [k, v] of rows) {
  doc.fillColor('#71717A').font('Helvetica-Bold').fontSize(9.5).text(k.toUpperCase(), ML + 20, ry, { width: 135 });
  doc.fillColor('#F4F4F5').font('Helvetica').fontSize(10).text(v, ML + 165, ry, { width: CONTENT_W - 185 });
  ry += 25;
}
doc.fillColor('#52525B').font('Helvetica').fontSize(9).text(
  'Nota: Meta cambia los nombres de sus menús con frecuencia. Si un botón no se llama exactamente igual, busca la opción por su función (te la describo en cada paso).',
  ML, doc.page.height - 92, { width: CONTENT_W, lineGap: 2 }
);
doc.restore();

/* ============ CONTENIDO ============ */

sectionTitle('Cómo encaja todo (el mapa mental)');
para(
  'Antes de tocar nada, entiende cómo se conectan las piezas. Todo el sistema existe para una sola cosa: llevar a un desconocido de Instagram/Facebook hasta un WhatsApp que cierra la reserva. Cada plataforma es un eslabón de esa cadena.'
);
steps([
  ['Instagram + Facebook (de Felipe)', 'son la cara pública y el "combustible" de los anuncios. Deben ser profesionales y estar conectadas entre sí.'],
  ['Meta Business Manager (lo creas tú)', 'es el "panel de control" que agrupa la página, el Instagram, la cuenta publicitaria y el WhatsApp bajo un mismo techo, con permisos claros.'],
  ['Cuenta publicitaria', 'vive dentro del Business Manager; es desde donde se crean y pagan las campañas.'],
  ['WhatsApp Business (teléfono de Felipe)', 'es el destino del anuncio y donde se cierra la venta. Se conecta a la página para que el botón "Enviar mensaje" funcione.'],
  ['Google Business + Mercado Pago + la web', 'refuerzan la conversión: aparecer en Google, cobrar el abono y mostrar la agenda/galería.'],
]);
callout('La regla de propiedad (no la rompas)',
  'Todas las cuentas de MARCA son de Felipe (su Instagram, su Facebook, su WhatsApp, su Mercado Pago, su Google). Tú entras como ADMINISTRADOR invitado. Nunca crees la marca a tu nombre: si algún día se separan, él debe conservar todo. El Business Manager es la herramienta que permite exactamente esto: él es dueño, tú operas.');

sectionTitle('Lo que le pides a Felipe (y cómo lo hace él)');
para('Estas son las cosas que SOLO Felipe puede hacer o entregar. Mándale esta sección tal cual. Idealmente háganlas juntos en una llamada de 1 hora.');
subhead('A) Que te dé acceso a su Instagram y Facebook');
para('No le pidas su contraseña (mala práctica). Que te AGREGUE como administrador. Lo hace así, desde su teléfono:');
steps([
  'En Instagram: perfil → menú ☰ → "Configuración y privacidad".',
  'Más adelante, cuando exista el Business Manager, tú le enviarás una invitación por correo y él solo tendrá que aceptarla (sección 6). Por ahora basta con que confirme que tiene acceso a la página de Facebook del estudio.',
]);
subhead('B) Que confirme sus datos y cuentas');
check([
  ['Correo del estudio', 'inkepilef.1401@gmail.com (ya lo usamos como admin de la web). Confirmar que tiene la contraseña.'],
  ['Número de WhatsApp', '+56 9 9094 0050, en el teléfono donde va a responder a los clientes.'],
  ['Facebook personal', 'Felipe necesita una cuenta personal de Facebook (aunque no la use): Meta exige un perfil real detrás de toda página/negocio. Si no tiene, que cree una.'],
  ['Cuenta bancaria', 'para Mercado Pago (cobrar el abono). A su nombre.'],
]);
subhead('C) Que grabe y te entregue el material');
para('Esto es lo más importante que solo él puede dar: tú no puedes inventar tatuajes. Pídele:');
check([
  ['2 a 4 videos verticales (9:16)', 'de 15 a 30 segundos, de sesiones reales: que se vea el proceso y el resultado final. Grabados con el teléfono en vertical, con buena luz.'],
  ['8 a 12 fotos', 'de trabajos terminados, bien iluminadas, sin desorden de fondo.'],
  ['Que suba sus fotos reales a la web', 'entra a la web → Vista tatuador → inicia sesión → pestaña Galería → sube sus trabajos (ya funciona con la nube). Reemplaza las fotos de referencia.'],
]);

sectionTitle('Instagram profesional (paso a paso)');
callout('¿Sí o sí debe ser profesional?', 'SÍ, obligatorio. Sin cuenta profesional NO se puede: conectar a la página de Facebook, hacer anuncios, ni ver estadísticas. Es gratis y no cambia el aspecto del perfil para los seguidores. Elige tipo "Empresa" (no "Creador"): Empresa es para negocios que venden un servicio; Creador es para influencers.', BLUE, '#EEF2FF', '#3730A3');
where('En la app de Instagram de Felipe (móvil).');
steps([
  'Perfil → menú ☰ (arriba a la derecha) → "Configuración y privacidad".',
  'Buscar "Para profesionales" o "Tipo de cuenta y herramientas" → "Cambiar a cuenta profesional".',
  'Elegir categoría: "Estudio de tatuajes" o "Artista". Marca que la categoría se muestre.',
  'Seleccionar "Empresa" (Business). Confirmar.',
  'Agregar información de contacto: correo, y el número de WhatsApp como botón de contacto.',
]);
subhead('Optimización del perfil (lo haces tú una vez con acceso)');
check([
  ['Nombre (campo buscable)', 'Poner: "Inkepilef | Tatuajes Blackwork & Realismo". Instagram busca por este campo, no por el @.'],
  ['Foto de perfil', 'el logo, legible en pequeño.'],
  ['Bio (3 líneas)', 'Línea 1: Tatuajes en negro y grises · Realismo · Blackwork · Fine Line. Línea 2: Providencia, Santiago · +7 años · Solo con cita y abono. Línea 3: Reserva tu hora ↓'],
  ['Enlace', 'el link de la bio = la agenda de la web (jeolayadev.github.io/felipe_tatuaje).'],
  ['Destacados', 'crear: Agenda · Abono · Estilos · Cicatrización · Testimonios.'],
]);

sectionTitle('Página de Facebook');
para('La página de Facebook es un REQUISITO TÉCNICO de la publicidad, aunque Felipe casi no la use. El anuncio, técnicamente, lo publica la página (y aparece también en Instagram).');
where('En facebook.com o en la app, con la cuenta de Felipe.');
steps([
  'Si ya existe la página del estudio: verificar que Felipe es administrador y que tiene el nombre y logo correctos. Listo.',
  'Si NO existe: menú → Páginas → Crear nueva página → nombre "Inkepilef Tattoo Studio" → categoría "Estudio de tatuajes" → agregar foto (logo) y portada → Crear.',
  'En la página → Configuración → verificar que la cuenta personal de Felipe aparece como administrador con control total.',
]);
callout('Conexión clave #1 (Instagram ↔ Facebook)',
  'La página de Facebook y el Instagram profesional deben quedar CONECTADOS. Se hace desde la página: Configuración → "Cuentas vinculadas" o "Instagram" → conectar cuenta → iniciar sesión con @inkepilef. Esto habilita que un mismo anuncio salga en ambas redes y que el Business Manager los vea juntos.');

sectionTitle('Meta Business Manager (el panel de control)');
para(
  'Aquí es donde se ordena todo con permisos profesionales. Es una capa "por encima" de la página y el Instagram. Lo creas TÚ, pero de forma que Felipe quede como propietario del negocio y tú como administrador. Es gratis.'
);
where('business.facebook.com (desde tu computador). Inicia sesión con TU Facebook personal.');
subhead('A) Crear el portafolio comercial');
steps([
  'Entrar a business.facebook.com → "Crear cuenta" / "Crear un portafolio comercial".',
  'Nombre del negocio: "Inkepilef". Tu nombre y un correo de trabajo. → Crear.',
  'Confirmar el correo (llega un mail de Meta).',
]);
subhead('B) Agregar los activos (Configuración del negocio)');
where('Dentro de business.facebook.com → engranaje ⚙ "Configuración del negocio".');
steps([
  ['Páginas', 'Cuentas → Páginas → Agregar → "Solicitar acceso a una página" (o "Agregar una página" si Felipe te la transfiere). Poner la página de Felipe. Él recibirá una solicitud que debe aprobar desde sus notificaciones de Facebook.'],
  ['Instagram', 'Cuentas → Cuentas de Instagram → Agregar → iniciar sesión con @inkepilef (necesitas que Felipe te dé el acceso o esté presente para poner la clave/confirmar).'],
  ['Cuenta publicitaria', 'Cuentas → Cuentas publicitarias → "Crear una cuenta publicitaria nueva". MUY IMPORTANTE: moneda = Peso chileno (CLP) y zona horaria = Santiago. Esto NO se puede cambiar después.'],
  ['WhatsApp', 'Cuentas → Cuentas de WhatsApp (o se conecta desde Business Suite, sección 7). Deja esto para la sección 7.'],
]);
subhead('C) Agregarte a ti como administrador (o invitar a Felipe)');
para('Si TÚ creaste el portafolio, ya eres admin; entonces debes INVITAR a Felipe. Si lo creó Felipe, él te invita a ti. En cualquier caso:');
steps([
  'Configuración del negocio → Usuarios → Personas → "Agregar" / "Invitar".',
  'Escribir el correo de la otra persona → elegir rol "Administrador de empleado" o "Acceso total".',
  'Asignar los activos: marcar la Página, el Instagram y la Cuenta publicitaria con permiso de administrar.',
  'La persona invitada recibe un correo y debe aceptar. Verificar que aparezca como "Activo".',
]);
callout('Alternativa simple (si el Business Manager te complica)',
  'Para un estudio de una sola persona puedes saltarte parte de esto: que Felipe te agregue como administrador de la Página (Configuración de la página → Accesos → Agregar) y del Instagram, y crear los anuncios desde "Meta Business Suite" (business.facebook.com/latest). Es menos ordenado a largo plazo, pero funciona para empezar rápido. Recomendado: hacer el Business Manager bien desde el inicio.');

sectionTitle('WhatsApp Business + enlace para los anuncios');
subhead('A) Instalar y configurar la app (teléfono de Felipe)');
where('Play Store / App Store → "WhatsApp Business" (es una app distinta a WhatsApp normal).');
steps([
  'Instalar WhatsApp Business con el número +56 9 9094 0050. Si ese número ya tiene WhatsApp normal, la app ofrece migrarlo (respetando el historial).',
  'Perfil de empresa: nombre "Inkepilef Tattoo Studio", logo, rubro, descripción, horario, dirección (comuna Providencia, sin número exacto) y el link de la web.',
  'Herramientas para la empresa → "Mensaje de bienvenida" → activarlo y pegar el texto de la guía de campaña.',
  'Herramientas para la empresa → "Respuestas rápidas" → crear /cotiza /abono /cuidados /ubicacion /seguimiento (textos en la guía de campaña).',
  'Crear etiquetas: Nuevo, Cotizado, Abonado, Tatuado, Frío.',
]);
subhead('B) Multidispositivo (para que TÚ también respondas)');
where('WhatsApp Business (teléfono de Felipe) → menú → "Dispositivos vinculados".');
steps([
  'En el teléfono de Felipe: Dispositivos vinculados → "Vincular un dispositivo".',
  'En tu computador: abre web.whatsapp.com → aparece un código QR.',
  'Felipe escanea ese QR con su teléfono. Listo: ahora tú ves y respondes los mismos chats desde tu compu.',
]);
subhead('C) Conectar el WhatsApp al negocio (esto habilita los anuncios "Enviar mensaje")');
where('business.facebook.com/latest ("Meta Business Suite") → Configuración → WhatsApp.');
steps([
  'En Meta Business Suite → Configuración → buscar "WhatsApp" → "Conectar cuenta".',
  'Ingresar el número +56 9 9094 0050 → Meta envía un código por SMS o llamada AL TELÉFONO DE FELIPE.',
  'Felipe te dicta el código (o lo ingresa él) → confirmar. Ya queda vinculado a la página.',
]);
callout('Conexión clave #2 (sin esto no hay campaña)',
  'Si el WhatsApp NO está conectado a la página/negocio, el objetivo de anuncio "Enviar mensaje de WhatsApp" no aparecerá o no funcionará. Este es el paso que más gente olvida. Verifícalo antes de crear la campaña: en Business Suite → Configuración → WhatsApp debe decir "Conectado".');

sectionTitle('Cuenta publicitaria y forma de pago');
where('adsmanager.facebook.com (Administrador de Anuncios), con la cuenta publicitaria creada en la sección 6.');
steps([
  'Ir a Configuración de pagos (Facturación → Configuración de pagos).',
  'Agregar forma de pago: tarjeta de crédito o débito habilitada para compras en internet (definir antes de quién es la tarjeta).',
  'Verificar moneda = CLP y zona horaria = Santiago (si quedó mal, hay que crear otra cuenta publicitaria).',
  'Configuración de la cuenta → "Límite de gasto de la cuenta" → poner CLP 30.000. Es un tope de seguridad: Meta jamás cobrará más que eso sin que tú lo subas.',
]);
callout('Sobre la tarjeta en Chile',
  'Meta acepta tarjetas de crédito y la mayoría de débito Visa/Mastercard habilitadas para compras online. Si la tarjeta falla, revisa que esté habilitada para "compras internacionales/por internet" en la app del banco. Decidan de antemano si paga Felipe o pagas tú y te reembolsa.');

sectionTitle('Google Business Profile (aparecer en Google/Maps)');
para('Gratis y de intención altísima: capta a quien busca "tatuador Providencia" en Google. Como el estudio es privado, se configura como "área de servicio" para no exponer la dirección exacta.');
where('business.google.com → iniciar sesión con el Google de Felipe (inkepilef.1401@gmail.com).');
steps([
  'business.google.com → "Administrar ahora" → nombre del negocio: "Inkepilef Tattoo Studio".',
  'Categoría: "Estudio de tatuajes".',
  'Cuando pregunte si los clientes visitan tu local: elegir que atiendes/entregas servicios en un ÁREA (negocio de área de servicio) → así NO se publica la dirección exacta.',
  'Definir el área de servicio: Providencia y comunas cercanas (Ñuñoa, Santiago Centro, Las Condes).',
  'Datos de contacto: teléfono (+56 9 9094 0050) y sitio web.',
  'Verificación: Google pide verificar (por video, teléfono o tarjeta postal). Puede tardar días → INÍCIALO CUANTO ANTES.',
  'Al verificar: pedir 3-5 reseñas a ex-clientes con el link que entrega Google.',
]);

sectionTitle('Mercado Pago (cobrar el abono)');
para('Es la cuenta de Felipe (su dinero). Él la crea, genera un "Link de pago" por el abono de $15.000, y TÚ pegas ese link en el panel de la web.');
where('mercadopago.cl o la app de Mercado Pago, con la cuenta de Felipe.');
steps([
  ['Felipe', 'crea/verifica su cuenta en mercadopago.cl (con su RUT y una cuenta bancaria a su nombre para retirar el dinero).'],
  ['Felipe', 'en la app/web: sección "Cobrar" → "Link de pago" (o "Cobra con un link") → crear un link por $15.000, título "Abono reserva Inkepilef".'],
  ['Felipe', 'copia el link generado (algo como mpago.la/xxxx) y te lo envía.'],
  ['Tú', 'entras a la web → Vista tatuador → pestaña "Pagos" → pegas el link y el monto ($15.000) → Guardar. Desde ese momento aparece el botón "Pagar abono con Mercado Pago" en la agenda del cliente.'],
]);

sectionTitle('La web (ya está lista, solo falta cargarla)');
check([
  ['Cuenta admin', 'Felipe entra a la web → Vista tatuador → "Crear cuenta" con inkepilef.1401@gmail.com. Solo ese correo ve el panel.'],
  ['Fotos reales', 'en Galería, sube sus trabajos (reemplazan las de referencia). Quedan fijas para todos.'],
  ['Horario', 'en "Gobernar agenda", activa los días/horas reales de atención en Providencia.'],
  ['Reglas de Firebase', 'TÚ ya tienes los archivos docs/firestore.rules y docs/storage.rules para publicar en la consola de Firebase (paso técnico, no de Felipe).'],
]);

sectionTitle('Verificación final: ¿quedó todo enlazado?');
para('Antes de gastar un peso en anuncios, confirma esta cadena. Si un eslabón falla, el dinero se pierde.');
check([
  ['Instagram', 'es profesional tipo Empresa · bio y link listos.'],
  ['Facebook', 'página creada · Instagram conectado a la página.'],
  ['Business Manager', 'contiene Página + Instagram + Cuenta publicitaria · tú y Felipe con acceso.'],
  ['Cuenta publicitaria', 'moneda CLP · forma de pago cargada · límite de gasto $30.000.'],
  ['WhatsApp', 'app Business configurada · multidispositivo con tu compu · CONECTADO al negocio en Business Suite.'],
  ['Prueba real', 'crea un borrador de anuncio con objetivo "Mensajes → WhatsApp": si te deja elegir el número y la página, la cadena está completa.'],
  ['Google Business', 'ficha creada y en proceso de verificación.'],
  ['Mercado Pago', 'link creado y pegado en el panel de la web.'],
  ['Web', 'cuenta admin de Felipe creada · fotos y horario reales cargados.'],
]);
callout('Cuando TODOS estén marcados', 'Estás listo para la Fase 1 de la Guía de Acción: el test de $5.000. No lances antes de completar esta verificación — un anuncio con el WhatsApp desconectado gasta plata y no genera un solo mensaje.', '#15803D', '#EFF9F1', '#14532D');

sectionTitle('Glosario rápido (para no perderte)');
check([
  ['Business Manager / Portafolio comercial', 'el panel que agrupa página, IG, anuncios y WhatsApp con permisos.'],
  ['Meta Business Suite', 'la versión "simple" para publicar, responder mensajes y ver estadísticas.'],
  ['Administrador de Anuncios (Ads Manager)', 'donde se crean, pagan y miden las campañas.'],
  ['CTWA (Click-to-WhatsApp)', 'anuncio cuyo botón abre una conversación de WhatsApp.'],
  ['Cuenta publicitaria', 'la "billetera" con moneda y forma de pago desde la que se gasta.'],
  ['Área de servicio', 'tipo de ficha de Google para negocios sin local público (oculta la dirección).'],
  ['Multidispositivo', 'función de WhatsApp para usar la misma cuenta en varios equipos.'],
]);

/* pie */
const range = doc.bufferedPageRange();
const footY = doc.page.height - 42;
for (let i = range.start + 1; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0;
  doc.moveTo(ML, footY).lineTo(ML + CONTENT_W, footY).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor(LIGHT);
  doc.text('INKEPILEF · Manual de Configuración desde Cero', ML, footY + 6, { width: CONTENT_W / 2, lineBreak: false });
  doc.text(`Página ${i - range.start} de ${range.count - 1}`, ML + CONTENT_W / 2, footY + 6, { width: CONTENT_W / 2, align: 'right', lineBreak: false });
}
doc.end();
console.log('PDF generado en', OUT_FILE);
