import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MenuItem } from '../models/menuItem';
import { Usuario } from '../models/usuario';


export interface OpcionMenu {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  orden: number;
  activo: boolean;
  padreId?: number;
  hijos?: OpcionMenu[];
}


export interface PaginacionRespuesta<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
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



  /**
   * Elimina un usuario (soft delete)
   * @param id ID del usuario
   */
  eliminarUsuario(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/usuarios/${id}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // #endregion

  // #region Menu
  // ============================================
  // OPCIONES DE MENÚ
  // ============================================

  /**
   * Obtiene todas las opciones de menú del sistema
   */
  obtenerOpcionesMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      `${this.apiUrl}/menu`,
    ).pipe(catchError(this.handleError)
    );
  }


  /**
   * Obtiene las opciones de menú asignadas a un usuario
   * @param usuarioId ID del usuario
   */
  obtenerMenuPorUsuario(usuarioId: number): Observable<OpcionMenu[]> {
    return this.http.get<OpcionMenu[]>(`${this.apiUrl}/usuarios/${usuarioId}/menu`, this.httpOptions)
      .pipe(

        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las opciones de menú por rol
   * @param rolId ID del rol
   */
  obtenerMenuPorRol(rolId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      `${this.apiUrl}/menu/GetMenuByRol?idRol=${rolId}`,
      this.httpOptions
    ).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }
  reestablecerContrasena(dataSend: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Usuario/reset-password`,
      dataSend, this.httpOptions
    ).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * Asigna los roles a un usuario
   * @param dataSend {"idUsuario": 1,  "idRoles": "2,4",  "idUsuarioCreacion": 1}
  */
  asignarRolesUsuario(dataSend: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Usuario/asignacion-rol`,
      dataSend,
      this.httpOptions
    ).pipe(

      catchError(this.handleError)
    );
  }
  /**
   *  Regresa los usuarios obtenidos de acuerdo a los criterios de busqueda.
   * @param nombre Nombre de usuario a buscar
   * @param numeroNomina Numero de nomina a buscar
   */
  obtenerUsuariosParametros(nombre: string, numeroNomina: string) {
    return this.http.get<Usuario[]>(
      `${this.apiUrl}/Usuario?nombre=${nombre}&numeroNomina=${numeroNomina}`,
      this.httpOptions
    ).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  cambiarEstadoUsuario(dataSend: any) {
    return this.http.post<any>(
      `${this.apiUrl}/Usuario/actualiza-estatus`,
      dataSend,
      this.httpOptions
    ).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // #endregion


  // ============================================
  // MANEJO DE ERRORES
  // ============================================

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

    console.error('Error en UsuarioService:', error);
    return throwError(() => new Error(errorMessage));
  }
}