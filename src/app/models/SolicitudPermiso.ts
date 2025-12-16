export interface SolicitudPermiso {
    idSolicitud: number,
    idEmpleado: number,
    numeroNomina: string,
    nombreCompleto: string,
    fechaPermiso: string,
    idTipoPermiso: number,
    tipoPermiso: string,
    fechaCreacion: string,
    idEstatus: number,
    estatus: string,
    idAutorizador: number,
    autorizador: string,
    motivoRechazo: string
}
