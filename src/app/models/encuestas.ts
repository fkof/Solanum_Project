import { commons } from "./commons";

export interface Encuestas extends commons {
    linksafe: any;
    idEncuesta: number;
    nombre: string;
    descripcion: string;
    link: string;
    idRoles: string;
    rolesDescripcion: string;

}