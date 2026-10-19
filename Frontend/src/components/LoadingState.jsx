function LoadingState({ mensaje = "Cargando..." }) {
  return (
    <div className="estado" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{mensaje}</p>
    </div>
  );
}

export default LoadingState;
