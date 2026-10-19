function FormField({ id, label, error, as: Componente = "input", ...props }) {
  const errorId = `${id}-error`;

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <Componente
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="campo__error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
