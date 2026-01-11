import { commons } from "./commons";
import { SafeHtml } from "@angular/platform-browser";

export interface Noticias extends commons {
    idNoticia: number;
    titulo: string;
    descripcion: string;
    rutaImagen: string;
    idRol: number;
    descripcionSafe: SafeHtml;
}