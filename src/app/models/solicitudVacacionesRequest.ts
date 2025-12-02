export interface SolicitudVacacionesRequest
{
  idEmpleado: number,
  fechaInicio: Date,
  fechaFin: Date,
  fechaRegreso: Date,
  cantidadDias: number,
  idEstatus: number,
  idUsuarioCreacion: number,
  correo: string
}