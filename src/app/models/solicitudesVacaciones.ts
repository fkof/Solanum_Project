export interface SolicitudVacaciones {
  idSolicitud: number;
  idEmpleado: number;
  numeroNomina: string;
  nombreCompleto: string;
  fechaInicio: string;       // formato ISO: YYYY-MM-DD
  fechaFin: string;
  fechaRegreso: string;
  fechaCreacion: string;
  cantidadDias: number;
  estatus: string;
  idEstatus: number;
  idAutorizador: number;
  autorizador: string;
  motivoRechazo: string;
  cantidadDiasAdelantados: number;
}
