import { commons } from "./commons";

export interface Empleado extends commons {
    nombre: string,
    apPaterno: string,
    apMaterno: string,
    nombreCompleto: string,
    fechaNacimiento: string,
    fotografia: string,
    correoPersonal: string,
    correoEmpresarial: string,
    fechaIngreso: string,
    numeroNomina: string,
    idEmpresas: string,
    empresa: string,
    idDepartamento: number,
    departamento: string,
    idPuesto: number,
    puesto: string,
    idJefeInmediato: string,
    extensionFotografia: string,
    idEmpleado: number,
    fotografiaConversion: string,
    jefeInmediato: string

}

export interface EmpleadoBusqueda {
    idEmpleado: number
    numeroNomina: string,
    nombreCompleto: string,
    empresa: string,
    puesto: string,
    estatus: boolean,
    jefeInmediato?: string,
}