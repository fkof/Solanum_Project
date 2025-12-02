export interface dataPerfil{
  mensaje:string; 
  usuario: {
    idUsuario: number;
    idEmpleado:string ;
    numeroNomina: string;
    correo: string;
    nombreCompleto:string;
    idRoles:string;
    idMenus:string;
  }
}