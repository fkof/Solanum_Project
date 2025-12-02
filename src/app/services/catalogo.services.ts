import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Departamento } from '../models/departamento';
import { Puesto } from '../models/puesto';
import { Empresa } from '../models/empresa';
import { Select } from '../models/selects';
import { LugarResidencia } from '../models/lugarResidencia';
import { Ubicacion } from '../models/ubicacion';
import { Horario } from '../models/horario';
import { Transporte } from '../models/transporte';



@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private baseUrl = '/catalogos';
  private apiUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {
    this.apiUrl = environment?.apiUrl || 'http://localhost:3000/api';
  }

  /**Obtiene los depatarmentos para los Empleados */
  obternerDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.apiUrl}/catalogo/Departamento`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los puuestos por departamento
   * @param idDepartamento Id departamento seleccionado
   * @returns 
   */
  obternerPuestosPorDepartamento(idDepartamento: number): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(`${this.apiUrl}/catalogo/Puesto?idDepartamento=${idDepartamento}`)
      .pipe(catchError(this.handleError));
  }
  /***
   * Obtiene el gerente por departamento
   * @param idDepartamento Id del departamento seleccionado
   * @returns
   */
  obtenerGerentePorDepartamento(idDepartamento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/catalogo/Gerente?idDepartamento=${idDepartamento}`)
      .pipe(catchError(this.handleError));
  }
  /**
   * Obtiene las empresas
   * @returns
   */
  obtenerEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/catalogo/Empresa`)
      .pipe(catchError(this.handleError));
  }
  /**
   * Obtiene el catalogo genericos
   * @param tipo Tipo de catalogo | Genero | Estado Civil | Grado Estudios | Parentesco
   * @returns
   */
  obtenerCatalogoGenerico(tipo: string): Observable<Select[]> {
    return this.http.get<Select[]>(`${this.apiUrl}/catalogo/CatalogoGenerico?tipo=${tipo}`)
      .pipe(catchError(this.handleError));
  }
  /**
   * Obtiene los lugares de residencia
   * @returns
   */
  obtenerLugarResidencia(): Observable<LugarResidencia[]> {
    return this.http.get<LugarResidencia[]>(`${this.apiUrl}/LugarResidencia`)
      .pipe(catchError(this.handleError));
  }

  obtenerUbicacion(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/Ubicacion`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los horarios
   * @returns
   */
  obtenerHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/Horario`)
      .pipe(catchError(this.handleError));
  }
  obtenerTransporte(): Observable<Transporte[]> {
    return this.http.get<Transporte[]>(`${this.apiUrl}/Transporte`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Maneja los errores
   * @param error
   * @returns
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error en el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.mensaje}`;
    } else {
      // Error del lado del servidor
      if (error.status === 400) {
        errorMessage = error.error?.mensaje || 'Datos inválidos';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 409) {
        errorMessage = error.error?.mensaje || 'Conflicto con datos existentes';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.mensaje) {
        errorMessage = error.error.mensaje;
      }
    }

    console.error('Error en Catalogos:', error);
    return throwError(() => new Error(errorMessage));
  }

}
