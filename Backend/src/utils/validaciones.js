import { BadRequestError } from "../exceptions/AppError.js";

export function exigir(condicion, mensaje) {
    if (!condicion) throw new BadRequestError(mensaje);
}

export function validarCampos(datos, campos) {
    exigir(datos && typeof datos === "object" && !Array.isArray(datos), "Enviá un objeto con los datos del registro.");
    exigir(Object.keys(datos).length > 0 && Object.keys(datos).every((campo) => campos.includes(campo)), "Hay campos vacíos o no permitidos.");
}

export const texto = (valor) => typeof valor === "string" && valor.trim().length > 0;
export const idValido = (valor) => Number.isSafeInteger(valor) && valor > 0;
export const centavos = (valor) => Math.round(valor * 100);
export const montoValido = (valor) => typeof valor === "number" && Number.isFinite(valor)
    && valor > 0 && valor <= 100000000 && Math.abs(valor * 100 - centavos(valor)) < 0.00001;

export function fechaValida(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const fecha = new Date(`${valor}T00:00:00Z`);
    return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

export function hoy() {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const obtener = (tipo) => partes.find((parte) => parte.type === tipo).value;
    return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
}

export const limpiar = (datos) => Object.fromEntries(
    Object.entries(datos).map(([clave, valor]) => [clave, typeof valor === "string" ? valor.trim() : valor])
);
