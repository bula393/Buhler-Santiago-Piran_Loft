import Button from "./Button.jsx";

function ErrorState({ mensaje, onReintentar }) {
  return (
    <div className="estado estado--error" role="alert">
      <p>{mensaje}</p>
      {onReintentar && (
        <Button variante="secundario" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
