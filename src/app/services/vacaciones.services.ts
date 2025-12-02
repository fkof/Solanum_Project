import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DiasFestivos } from '../models/diasFestivo';
import { ConfiguracionVacaciones } from '../models/configuracionVacaciones';
import { SaldosVacaciones } from '../models/saldosVacaciones';
import { EstatusVacaciones } from '../models/estatusVacaciones';
import { SolicitudVacaciones } from '../models/solicitudesVacaciones';
import { SolicitudVacacionesRequest } from '../models/solicitudVacacionesRequest';

@Injectable({ providedIn: 'root' })
export class VacacionesServices {
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
    getSaldos(idEmpleado: number): Observable<SaldosVacaciones[]> {
        return this.http
            .get<SaldosVacaciones[]>(`${this.apiUrl}/Vacaciones/ObtenerSaldos?idEmpleado=${idEmpleado}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getConfiguracion(): Observable<ConfiguracionVacaciones[]> {
        return this.http
            .get<ConfiguracionVacaciones[]>(`${this.apiUrl}/ConfiguracionVacacion/ConfiguracionParametros`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getListEstatus(): Observable<EstatusVacaciones[]> {
        return this.http
            .get<EstatusVacaciones[]>(`${this.apiUrl}/Vacaciones/Estatus`)
            .pipe(catchError(this.handleError));
    }

    getDiasFestivos(): Observable<DiasFestivos[]> {
        return this.http
            .get<DiasFestivos[]>(`${this.apiUrl}/ConfiguracionVacacion/DiasFestivos`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    putConfiguracion(config: any): Observable<any> {
        return this.http
            .put<any>(`${this.apiUrl}/ConfiguracionVacacion?idConfiguracion=${config.idConfiguracion}&valor=${config.valor}&idUsuarioModificacion=${config.idUsuarioModificacion}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    getSolicitudesVacaciones(dataSend: any): Observable<SolicitudVacaciones[]> {
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

        return this.http
            .get<SolicitudVacaciones[]>(`${this.apiUrl}/Vacaciones/ObtenerSolicitudes?${parametros}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    postSolicitudVacaciones(solicitud: SolicitudVacacionesRequest): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/Vacaciones`,
            solicitud,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getSolicitudesPendientesParaEmpleadoLogueado(idEmpleado: number): Observable<SolicitudVacaciones[]> {
        return this.http
            .get<SolicitudVacaciones[]>(`${this.apiUrl}/Vacaciones/ObtenerSolicitudes?idEmpleado=${idEmpleado}&idEstatus=1`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    putActualizarSolicitud(dataSend:any):Observable<any>{
        return this.http
            .put<any>(`${this.apiUrl}/Vacaciones/ActualizarSolicitud`, dataSend,this.httpOptions)
            .pipe(catchError(this.handleError));
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