import { commons } from "./commons"

export interface HomeConfig extends commons {
    titulo: string,
    subTitulo: string,
    mensaje: string
}
export interface HomeImage {
    idImagen: number,
    titulo: string,
    descripcion: string,
    ruta: string,
    imagen: any
}