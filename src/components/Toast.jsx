export default function Toast({ notifica }) {

  if (!notifica.visibile) return null;

  const icona =
    notifica.tipo === "success"
      ? "⚽"
      : notifica.tipo === "error"
      ? "🟥"
      : "ℹ️";

  return (
    <div className={`toast ${notifica.tipo}`}>
      <span className="toast-icon">
        {icona}
      </span>

      <span>{notifica.testo}</span>
    </div>
  );

}