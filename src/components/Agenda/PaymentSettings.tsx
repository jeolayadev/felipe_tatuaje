import { useState } from 'react';
import { useStudioConfig, formatCLP } from '../../hooks/useStudioConfig';
import styles from './GalleryManager.module.scss';
import pay from './PaymentSettings.module.scss';

/**
 * Panel del tatuador para configurar el cobro del abono con Mercado Pago.
 * Guarda el "Link de pago" y el monto del abono.
 */
export const PaymentSettings = () => {
  const { mpLink, abonoAmount, save } = useStudioConfig();
  const [link, setLink] = useState(mpLink);
  const [amount, setAmount] = useState(String(abonoAmount));
  const [msg, setMsg] = useState('');

  const onSave = () => {
    const value = Number(amount.replace(/[^\d]/g, ''));
    save({ mpLink: link.trim(), abonoAmount: value > 0 ? value : 15000 });
    setMsg('Configuración guardada. El botón de pago ya aparece en la agenda del cliente.');
  };

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <div>
          <span className={styles.eyebrow}>Pagos</span>
          <h3>Abono con Mercado Pago</h3>
          <p>Cobra el abono para confirmar las reservas. Se muestra un botón de pago en la agenda del cliente.</p>
        </div>
      </header>

      <div className={pay.grid}>
        <label className={pay.field}>
          Monto del abono (CLP)
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="15000"
          />
          <small>Se muestra como {formatCLP(Number(amount.replace(/[^\d]/g, '')) || 0)}</small>
        </label>

        <label className={pay.field}>
          Link de pago de Mercado Pago
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://mpago.la/..."
          />
          <small>Pégalo aquí después de crearlo en tu cuenta.</small>
        </label>
      </div>

      <button type="button" className={pay.save} onClick={onSave}>Guardar configuración</button>
      {msg && <p className={pay.msg} aria-live="polite">{msg}</p>}

      {link && (
        <a className={pay.test} href={link} target="_blank" rel="noreferrer">
          Probar el link de pago ↗
        </a>
      )}

      <div className={pay.help}>
        <h4>Cómo crear tu Link de pago (una sola vez)</h4>
        <ol>
          <li>Entra a tu cuenta en <strong>mercadopago.cl</strong> (o la app).</li>
          <li>Ve a <strong>Cobrar → Link de pago</strong>.</li>
          <li>Crea un link por el monto del abono (ej: {formatCLP(Number(amount.replace(/[^\d]/g, '')) || 15000)}), con un título como "Abono reserva Inkepilef".</li>
          <li>Copia el link generado y pégalo arriba. ¡Listo!</li>
        </ol>
        <p className={pay.note}>
          Nota beta: este link cobra un monto fijo. La confirmación automática del pago y las reservas
          vinculadas al pago llegarán con el backend (Firebase Functions) en la siguiente etapa.
        </p>
      </div>
    </section>
  );
};

export default PaymentSettings;
