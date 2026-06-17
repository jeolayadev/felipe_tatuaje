import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { STUDIO_IMAGE } from '../../data/images';
import { AmbientBg } from '../ui/AmbientBg';
import { SafeImage } from '../ui/SafeImage';
import { SectionReveal } from '../ui/SectionReveal';
import { SectionTitle } from '../ui/AnimatedText';
import { EASE } from '../../utils/motion';
import styles from './Contacto.module.scss';

export const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ nombre: '', email: '', mensaje: '' });
    }, 3000);
  };

  return (
    <section id="contacto" className={styles.section}>
      <AmbientBg variant="contact" />

      <div className={styles.wrap}>
        <SectionTitle subtitle="Cuéntanos tu idea y te respondemos pronto">
          Reserva tu cita
        </SectionTitle>

        <div className={styles.grid}>
          <SectionReveal delay={0.1} className={styles.formCol}>
            <motion.form
              className={styles.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <label>
                Nombre
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </label>
              <label>
                Tu idea
                <textarea
                  required
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="Estilo, zona, referencias..."
                />
              </label>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(225,29,72,0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Enviar solicitud
              </motion.button>
              <AnimatePresence>
                {sent && (
                  <motion.p
                    className={styles.ok}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ¡Enviado! Te contactaremos pronto.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </SectionReveal>

          <SectionReveal delay={0.2} className={styles.infoCol}>
            <aside className={styles.info}>
              <div>
                <h3>Horario</h3>
                <p>Mar–Vie 14:00–21:00 · Sáb 12:00–20:00</p>
              </div>
              <div>
                <h3>Ubicación</h3>
                <p>{BRAND.location}</p>
              </div>
              <div>
                <h3>Contacto</h3>
                <p>
                  <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a>
                  <br />
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                </p>
              </div>
              <motion.div
                className={styles.map}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
              >
                <SafeImage src={STUDIO_IMAGE.src} alt={STUDIO_IMAGE.alt} loading="lazy" />
                <span className={styles.mapLabel}>NUESTRO ESTUDIO</span>
              </motion.div>
            </aside>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
