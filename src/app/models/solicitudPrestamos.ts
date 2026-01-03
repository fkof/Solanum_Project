import { commons } from "./commons";

export interface SolicitudPrestamos extends commons {
    idSolicitud: number;
    idEmpleado: number;
    numeroNomina: string;
    nombreCompleto: string;
    montoSolicitado: number;
    idRebajePrestamo: number;
    cantidadRebaje: string;
    motivo: string;
    fechaCreacion: string;
    idEstatus: number;
    estatus: string;
    idEstatusPrestamo: number;
    estatusPrestamo: string;
    idAutorizador: number;
    autorizador: string;
    motivoRechazo: string;
}