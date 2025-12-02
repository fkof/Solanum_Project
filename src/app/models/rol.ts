import { commons } from "./commons";

export interface Rol extends commons {
  idRol: number;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  idUsuario:number;
}

