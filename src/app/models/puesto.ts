export interface Puesto {
    idPuesto: number;
    nombre: string;
    idDepartamento?: number;
    isGerencia?: boolean;
}