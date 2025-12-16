import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from "rxjs";
import { SolicitudPermiso } from "../models/SolicitudPermiso";
import { SolicitudPermisoRequest } from "../models/SolicitudPermisoRequest";
import { TipoPermiso } from "../models/tipoPermiso";

@Injectable({ providedIn: 'root' })
export class PermisoServices {
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

    getSolicitudesPermiso(dataSend: any): Observable<SolicitudPermiso[]> {
        let parametros = "";
        if (dataSend.nombre) {
            parametros += `nombre=${dataSend.nombre}&`;
        }
        if (dataSend.idEmpleado) {
            parametros += `idEmpleado=${dataSend.idEmpleado}&`;
        }
        if (dataSend.idAutorizador) {
            parametros += `idAutorizador=${dataSend.idAutorizador}&`;
        }
        if (dataSend.idEstatus) {
            parametros += `idEstatus=${dataSend.idEstatus}&`;
        }
        if (dataSend.fechaInicio) {
            parametros += `fechaInicio=${dataSend.fechaInicio}&`;
        }
        if (dataSend.fechaFin) {
            parametros += `fechaFin=${dataSend.fechaFin}&`;
        }
        parametros = parametros.substring(0, parametros.length - 1);
        return this.http.get<SolicitudPermiso[]>(`${this.apiUrl}/Permisos/ObtenerSolicitudes?${parametros}`, this.httpOptions);
    }
    getSolicitudesPendientesParaEmpleadoLogueado(idEmpleado: number): Observable<SolicitudPermiso[]> {
        return this.http
            .get<SolicitudPermiso[]>(`${this.apiUrl}/Permisos/ObtenerSolicitudes?idEmpleado=${idEmpleado}&idEstatus=1`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    postSolicitudPermiso(solicitud: SolicitudPermisoRequest): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/Permisos`,
            solicitud,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getTipoPermiso(): Observable<TipoPermiso[]> {
        return this.http.get<TipoPermiso[]>(`${this.apiUrl}/Permisos/TipoPermisos`, this.httpOptions);
    }
    actualizarSolicitudPermiso(dataSend: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/Permisos/ActualizarSolicitud`, dataSend, this.httpOptions);
    }
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