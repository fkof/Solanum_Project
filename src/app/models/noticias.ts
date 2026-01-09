import { commons } from "./commons";

export interface Noticias extends commons {
    idNoticia: number;
    titulo: string;
    descripcion: string;
    rutaImagen: string;
}