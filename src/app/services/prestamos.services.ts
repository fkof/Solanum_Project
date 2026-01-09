import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from "rxjs";
import { SolicitudPrestamos } from "../models/solicitudPrestamos";
import { CantidadRebaje } from "../models/cantidadRebaje";


@Injectable({ providedIn: 'root' })
export class PrestamosServices {
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
    getSolicitudesPrestamos(dataSend: any): Observable<SolicitudPrestamos[]> {
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
        if (dataSend.idEstatusPrestamo) {
            parametros += `idEstatusPrestamo=${dataSend.idEstatusPrestamo}&`;
        }
        parametros = parametros.substring(0, parametros.length - 1);
        return this.http.get<SolicitudPrestamos[]>(`${this.apiUrl}/Prestamos/ObtenerSolicitudes?${parametros}`, this.httpOptions);
    }
    getSolicitudesPendientesParaEmpleadoLogueado(idEmpleado: number): Observable<SolicitudPrestamos[]> {
        return this.http
            .get<SolicitudPrestamos[]>(`${this.apiUrl}/Prestamos/ObtenerSolicitudes?idEmpleado=${idEmpleado}&idEstatus=1`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    postSolicitudPrestamos(solicitud: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/Prestamos`,
            solicitud,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getListadoCantidadRebaje(): Observable<CantidadRebaje[]> {
        return this.http.get<CantidadRebaje[]>(`${this.apiUrl}/Prestamos/ListadoCantidadRebaje`, this.httpOptions);
    }
    actualizarSolicitudPrestamo(dataSend: any): Observable<any> {
        //https://localhost:44318/api/Prestamos/ActualizarSolicitud
        return this.http.put<any>(
            `${this.apiUrl}/Prestamos/ActualizarSolicitud`,
            dataSend,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getSimulacionAmortizacion(dataSend: any): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/Prestamos/SimulacionAmortizacion?montoSolicitado=${dataSend.montoSolicitado}&idRebaje=${dataSend.idRebaje}`,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getAmortizacion(idSolicitud: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/Prestamos/Amortizacion?idSolicitud=${idSolicitud}`,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
    }
    getEstatusPrestamos(): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/Prestamos/Estatus`,
            this.httpOptions
        ).pipe(catchError(this.handleError)
        );
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