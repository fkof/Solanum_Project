import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Empleado, EmpleadoBusqueda } from '../models/empleado';
import { HijosEmpleado } from '../models/hijosEmpleado';
import { InformacionAdicionalEmpleado } from '../models/informacionAdicionalEmpleado';

export interface RespuestaApi<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PaginacionRespuesta<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface FiltrosEmpleado {
  page?: number;
  pageSize?: number;
  search?: string;
  activo?: boolean;
  empresaId?: number;
  departamentoId?: number;
  puestoId?: number;
  fechaIngresoDesde?: Date | string;
  fechaIngresoHasta?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Usa la URL del environment o una por defecto
    this.apiUrl = environment?.apiUrl || 'http://localhost:3000/api';
  }

  // #region Crud Empleados
  // ============================================
  // CRUD DE EMPLEADOS
  // ============================================

  /**
   * Obtiene todos los empleados con filtros y paginación
   * @param filtros Parámetros de filtrado y paginación
   */
  obtenerEmpleados(filtros?: FiltrosEmpleado): Observable<Empleado[]> {
    let httpParams = new HttpParams();



    return this.http.get<Empleado[]>(
      `${this.apiUrl}/empleados`,
      { ...this.httpOptions, params: httpParams }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un empleado por ID
   * @param id ID del empleado
   */
  obtenerEmpleadoPorId(id: string): Observable<Empleado> {
    return this.http.get<Empleado>(
      `${this.apiUrl}/Empleado/${id}`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un empleado por número de nómina
   * @param numeroNomina Número de nómina del empleado
   */
  obtenerEmpleadoPorNomina(numeroNomina: string): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(
      `${this.apiUrl}/Catalogo/JefeInmediato?numeroNomina=${numeroNomina}`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }


  obtenerJefeInmediato(valor: string): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(
      `${this.apiUrl}/Catalogo/JefePorNominaNombre?valor=${valor}`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Crea un nuevo empleado
   * @param empleado Datos del empleado a crear
   */
  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(
      `${this.apiUrl}/empleado`,
      empleado,
      this.httpOptions
    ).pipe(catchError(this.handleError)
    );
  }

  /**
   * Actualiza un empleado existente
      * @param empleado Datos del empleado a actualizar
   */
  actualizarEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(
      `${this.apiUrl}/Empleado`,
      empleado,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Elimina un empleado (soft delete)
   * @param id ID del empleado
   */
  eliminarEmpleado(id: number, usuario: number, estado: boolean): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/Empleado?id=${id}&idUsuario=${usuario}&estatus=${estado}`,
      this.httpOptions
    ).pipe(catchError(this.handleError)
    );
  }


  // #endregion

  // ============================================
  // BÚSQUEDAS Y FILTROS
  // ============================================

  /**
   * Busca empleados por diferentes criterios
   * @param criterio Término de búsqueda
   */
  buscarEmpleados(criterio: any): Observable<EmpleadoBusqueda[]> {

    return this.http.get<EmpleadoBusqueda[]>(`${this.apiUrl}/Empleado?nombre=${criterio.nombre}&idEmpresa=${criterio.empresaId}&numeroNomina=${criterio.numeroNomina}`)
      .pipe(catchError(this.handleError));

  }

  obtenerHijos(id: number): Observable<HijosEmpleado[]> {
    return this.http.get<HijosEmpleado[]>(`${this.apiUrl}/Empleado/Hijos?idEmpleado=${id}`)
      .pipe(catchError(this.handleError));
  }
  crearHijos(hijos: HijosEmpleado): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Empleado/Hijos`, hijos, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  actualizarHijos(hijos: HijosEmpleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Empleado/Hijos`, hijos, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  obtenerInformacionAdicional(id: number): Observable<InformacionAdicionalEmpleado> {
    return this.http.get<InformacionAdicionalEmpleado>(`${this.apiUrl}/Empleado/InformacionAdicional?idEmpleado=${id}`)
      .pipe(catchError(this.handleError));
  }
  crearInformacionAdicional(informacionAdicional: InformacionAdicionalEmpleado): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Empleado/InformacionAdicional`, informacionAdicional, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  actualizarInformacionAdicional(informacionAdicional: InformacionAdicionalEmpleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Empleado/InformacionAdicional`, informacionAdicional, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // SUBIDA DE ARCHIVOS
  // ============================================




  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error en el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.mensaje}`;
    } else {
      // Error del lado del servidor
      if (error.status === 400) {
        debugger;
        errorMessage = error.error?.mensaje || 'Datos inválidos';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción';
      } else if (error.status === 404) {
        errorMessage = 'Empleado no encontrado';
      } else if (error.status === 405) {
        errorMessage = 'Empleado no encontradossss';
      }
      else if (error.status === 409) {
        errorMessage = error.error?.mensaje || 'Conflicto con datos existentes (número de nómina o correo ya existe)';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.mensaje) {
        errorMessage = error.error.mensaje;
      }
    }

    console.error('Error en EmpleadosService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
