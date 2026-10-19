import { forwardRef } from "react";
import { Link } from "react-router-dom";

const Button = forwardRef(function Button(
  { variante = "primario", to, className = "", children, ...props },
  ref
) {
  const clases = `btn btn--${variante} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} type="button" className={clases} {...props}>
      {children}
    </button>
  );
});

export default Button;
