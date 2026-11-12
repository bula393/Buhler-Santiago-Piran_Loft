import Button from "./Button.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function GestionTable({ registros, config, datos, onEditar, onEliminar }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla-gestion">
        <caption className="solo-lectores">Listado de {config.titulo.toLowerCase()}</caption>
        <thead><tr>{config.columnas.map((columna) => <th scope="col" key={columna.label}>{columna.label}</th>)}<th scope="col">Acciones</th></tr></thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              {config.columnas.map((columna) => <td key={columna.label} data-label={columna.label}>
                {columna.estado ? <StatusBadge estado={columna.valor(registro, datos)} /> : columna.valor(registro, datos)}
              </td>)}
              <td data-label="Acciones"><div className="tabla-acciones">
                <Button variante="secundario" aria-label={`Editar ${config.singular} ${registro.id}`} onClick={() => onEditar(registro)}>Editar</Button>
                <Button variante="peligro" aria-label={`Eliminar ${config.singular} ${registro.id}`} onClick={(evento) => { evento.currentTarget.focus(); onEliminar(registro); }}>Eliminar</Button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
