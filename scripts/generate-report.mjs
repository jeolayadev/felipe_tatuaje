import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

/* ---------- Paleta ---------- */
const RED = '#E11D48';
const RED_SOFT = '#FCE7EC';
const INK = '#101012';
const DARK = '#0C0C0C';
const GRAY = '#52525B';
const LIGHT = '#71717A';
const LINE = '#E4E4E7';

const OUT_DIR = path.resolve('docs');
const OUT_FILE = path.join(OUT_DIR, 'NOIR_INK_Informe_Beta.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  bufferPages: true,
  margins: { top: 64, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'NOIR INK — Informe de Proyecto (Beta)',
    Author: 'Equipo de Desarrollo',
    Subject: 'Descripción técnica de la maqueta, módulos, tecnologías y roadmap',
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

const sectionTitle = (num, text) => {
  ensure(46);
  const y = doc.y + 6;
  doc.save();
  doc.rect(ML, y, 4, 20).fill(RED);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(15).text(`${num}.  ${text}`, ML + 14, y + 1);
  doc.restore();
  doc.moveTo(ML, y + 28).lineTo(ML + CONTENT_W, y + 28).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.y = y + 38;
  doc.fillColor(GRAY).font('Helvetica').fontSize(10.5);
};

const para = (text, opts = {}) => {
  doc.fillColor(opts.color || GRAY).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(opts.size || 10.5);
  doc.text(text, ML, doc.y, { width: CONTENT_W, align: 'justify', lineGap: 2.5 });
  doc.moveDown(opts.gap ?? 0.6);
};

const subhead = (text) => {
  ensure(26);
  doc.moveDown(0.2);
  doc.fillColor(RED).font('Helvetica-Bold').fontSize(11).text(text, ML, doc.y, { width: CONTENT_W });
  doc.moveDown(0.25);
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
      doc.fillColor(GRAY).font('Helvetica').text(`: ${body}`, { width: CONTENT_W - 14, lineGap: 2 });
    } else {
      doc.fillColor(GRAY).font('Helvetica').text(body, ML + 14, yy, { width: CONTENT_W - 14, lineGap: 2 });
    }
    doc.moveDown(0.35);
  }
  doc.moveDown(0.3);
};

/* ---------- PORTADA ---------- */
doc.save();
doc.rect(0, 0, PAGE_W, doc.page.height).fill(DARK);
// glow superior
doc.rect(0, 0, PAGE_W, 6).fill(RED);
doc.fillColor('#A1A1AA').font('Helvetica-Bold').fontSize(11).text('ESTUDIO DE TATUAJES · SANTIAGO', ML, 150, { characterSpacing: 2 });
doc.fillColor('#F4F4F5').font('Helvetica-Bold').fontSize(64).text('NOIR', ML, 185, { continued: true });
doc.fillColor(RED).text(' INK', { continued: false });
doc.fillColor('#F4F4F5').font('Helvetica').fontSize(15).text('Plataforma web de portafolio y gestión de agenda', ML, 270);
doc.fillColor('#71717A').fontSize(12).text('Arte llevado a la piel — cada trazo cuenta una historia que permanece.', ML, 294);

// tarjeta de metadatos
const cardY = 380;
doc.roundedRect(ML, cardY, CONTENT_W, 132, 8).fillAndStroke('#141417', '#27272A');
const metaRows = [
  ['Documento', 'Informe técnico de proyecto'],
  ['Versión', 'Beta 0.1'],
  ['Fecha', '19 de junio de 2026'],
  ['Estado', 'Maqueta funcional desplegada (demostración)'],
  ['Despliegue', 'jeolayadev.github.io/felipe_tatuaje'],
];
let ry = cardY + 18;
for (const [k, v] of metaRows) {
  doc.fillColor('#71717A').font('Helvetica-Bold').fontSize(9.5).text(k.toUpperCase(), ML + 20, ry, { width: 110 });
  doc.fillColor('#F4F4F5').font('Helvetica').fontSize(10.5).text(v, ML + 140, ry, { width: CONTENT_W - 160 });
  ry += 22;
}
doc.fillColor('#52525B').font('Helvetica').fontSize(9).text('Documento confidencial preparado para el cliente. Uso interno de revisión.', ML, doc.page.height - 90, { width: CONTENT_W });
doc.restore();

/* ---------- CONTENIDO ---------- */
doc.addPage();

sectionTitle(1, 'Resumen ejecutivo');
para(
  'NOIR INK es una plataforma web responsiva pensada para un estudio de tatuajes. Reúne en un mismo sitio la presentación profesional del trabajo del artista (portafolio) y una herramienta de gestión de agenda con dos perspectivas: la del cliente, que explora estilos y reserva su hora, y la del tatuador, que administra disponibilidad, reservas y clientes.'
);
para(
  'La presente entrega corresponde a una versión Beta: una maqueta funcional, navegable y desplegada en línea, orientada a validar el diseño, la experiencia de usuario y el flujo completo de reserva. Los datos se almacenan localmente en el navegador para fines de demostración; la persistencia en la nube, el inicio de sesión y las notificaciones forman parte de las próximas etapas descritas en este informe.'
);

sectionTitle(2, 'Descripción de la maqueta');
para(
  'El producto es una aplicación de página única (SPA) con un diseño oscuro, elegante y de alto contraste, alineado con la identidad de marca del estudio. La interfaz prioriza las fotografías de los trabajos y mantiene una lectura clara en cualquier dispositivo.'
);
para('La maqueta opera bajo dos vistas intercambiables desde la barra de navegación:');
bullets([
  ['Vista Cliente', 'recorrido de marketing y reserva — inicio, portafolio, agenda y contacto.'],
  ['Vista Tatuador', 'panel de administración para gobernar la agenda, gestionar reservas y consultar clientes.'],
]);
para(
  'Se ha trabajado especialmente la experiencia en teléfonos: secciones que antes requerían desplazamiento excesivo se reorganizaron con carruseles deslizables y tiras horizontales, reduciendo el scroll y mejorando la fluidez.'
);

sectionTitle(3, 'Arquitectura y tecnologías');
subhead('Frontend');
bullets([
  ['React 19', 'librería principal de interfaz, basada en componentes reutilizables.'],
  ['TypeScript', 'tipado estático para mayor robustez y mantenibilidad del código.'],
  ['Vite 8', 'empaquetador y servidor de desarrollo de alto rendimiento.'],
  ['SCSS Modules', 'estilos encapsulados por componente, con sistema de breakpoints responsivo.'],
  ['Framer Motion', 'animaciones y transiciones fluidas (con modo reducido en móvil para rendimiento).'],
]);
subhead('Procesamiento e infraestructura');
bullets([
  ['Sharp', 'optimización de imágenes del portafolio en el proceso de construcción.'],
  ['GitHub + GitHub Actions', 'control de versiones e integración/despliegue continuo (CI/CD).'],
  ['GitHub Pages', 'hosting del sitio; cada cambio aprobado se publica automáticamente.'],
  ['localStorage', 'almacenamiento temporal de horarios y reservas en el navegador (etapa beta).'],
]);

sectionTitle(4, 'Módulos del sistema');
subhead('Vista Cliente');
bullets([
  ['Navegación', 'barra superior con accesos, reloj/fecha en vivo y menú adaptado a móvil.'],
  ['Inicio (Hero)', 'presentación de marca, selector de estilos y llamados a la acción (reservar / ver trabajos).'],
  ['Portafolio', 'galería de trabajos con carrusel destacado, filtros por categoría y visor ampliado (lightbox).'],
  ['Agenda', 'selección de fecha y horario disponible más formulario de reserva.'],
  ['Contacto', 'datos del estudio (horario, ubicación, teléfono/email) y acceso directo a la reserva.'],
]);
subhead('Vista Tatuador');
bullets([
  ['Tablero de métricas', 'próximas citas, cupos libres, clientes y días activos de un vistazo.'],
  ['Gobernar agenda', 'activación de días, horarios de inicio/término, duración de bloques y bloqueo de fechas.'],
  ['Gestionar reservas', 'revisión rápida de las próximas citas con contacto y liberación de cupos.'],
  ['Ver reservas', 'listado completo de reservas registradas.'],
  ['Ver usuarios', 'fichas de clientes agendados con sus datos y próxima cita.'],
]);

sectionTitle(5, 'Funcionalidades actuales (Beta)');
bullets([
  'Reserva de horas con selección de día y bloque, validando disponibilidad real según la configuración del tatuador.',
  'Configuración de agenda por parte del tatuador: días laborales, horarios, duración del bloque y fechas cerradas.',
  'Recordatorios automáticos de citas del día y próximas (dentro de la propia interfaz).',
  'Portafolio interactivo con filtros, carrusel y visor a pantalla completa.',
  'Diseño totalmente responsivo, con versión optimizada para teléfono (carruseles y menor desplazamiento).',
  'Persistencia local: la información reservada permanece en el navegador entre visitas.',
  'Publicación automática en línea ante cada actualización aprobada.',
]);

sectionTitle(6, 'Alcance y limitaciones de esta versión');
para(
  'Por tratarse de una Beta de demostración, existen límites esperables que se resolverán en las siguientes etapas:'
);
bullets([
  ['Sin base de datos central', 'los datos viven en el navegador de cada dispositivo; no se comparten entre equipos.'],
  ['Sin inicio de sesión', 'la vista tatuador no está protegida por autenticación todavía.'],
  ['Formulario de contacto simulado', 'aún no envía correos ni mensajes reales.'],
  ['Notificaciones internas', 'los recordatorios se muestran en pantalla, no por correo o WhatsApp.'],
]);

sectionTitle(7, 'Próximos avances (Roadmap)');
para('La evolución del proyecto contempla convertir la maqueta en un producto operativo y multiusuario:');
subhead('Etapa 1 — Backend y datos en la nube');
bullets([
  ['Firebase Firestore', 'base de datos en tiempo real para reservas, horarios y clientes, compartida entre todos los dispositivos.'],
  ['Sincronización', 'que el tatuador y los clientes vean siempre la disponibilidad actualizada al instante.'],
]);
subhead('Etapa 2 — Cuentas y seguridad');
bullets([
  ['Login / Autenticación', 'acceso protegido a la vista tatuador (correo/contraseña o Google) con Firebase Authentication.'],
  ['Roles', 'separación de permisos entre administrador (tatuador) y clientes registrados.'],
  ['Perfil de cliente', 'historial de citas y datos guardados para reservar más rápido.'],
]);
subhead('Etapa 3 — Comunicación y operación');
bullets([
  ['Notificaciones reales', 'confirmaciones y recordatorios por correo electrónico y/o WhatsApp.'],
  ['Formulario de contacto funcional', 'envío real de solicitudes al estudio.'],
  ['Gestión de imágenes', 'carga del portafolio desde un panel, con almacenamiento en la nube (Firebase Storage).'],
]);
subhead('Etapa 4 — Mejoras de negocio (a evaluar)');
bullets([
  ['Abono / seña en línea', 'integración de pagos para confirmar reservas.'],
  ['Reportes', 'estadísticas de ocupación, estilos más solicitados e ingresos estimados.'],
  ['Multi-artista', 'soporte para varios tatuadores dentro del mismo estudio.'],
]);

sectionTitle(8, 'Cierre');
para(
  'Esta Beta valida el concepto, el diseño y el flujo completo de reserva sobre una base técnica moderna y mantenible. Las siguientes etapas (Firebase, inicio de sesión y notificaciones) transformarán la maqueta en una herramienta de uso diario, segura y conectada en la nube.'
);
para('Quedamos atentos a sus comentarios para priorizar el roadmap según las necesidades del estudio.', { gap: 1 });

/* ---------- Pie de página (omite la portada) ---------- */
const range = doc.bufferedPageRange();
const footY = doc.page.height - 42;
for (let i = range.start + 1; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  // Evita que el texto del pie (bajo el margen) genere páginas nuevas.
  doc.page.margins.bottom = 0;
  doc.moveTo(ML, footY).lineTo(ML + CONTENT_W, footY).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor(LIGHT);
  doc.text('NOIR INK · Informe de proyecto (Beta)', ML, footY + 6, { width: CONTENT_W / 2, lineBreak: false });
  doc.text(`Página ${i - range.start} de ${range.count - 1}`, ML + CONTENT_W / 2, footY + 6, {
    width: CONTENT_W / 2,
    align: 'right',
    lineBreak: false,
  });
}

doc.end();
console.log('PDF generado en', OUT_FILE);
