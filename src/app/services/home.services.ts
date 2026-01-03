import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HomeConfig, HomeImage } from '../models/homeConfig';
/*export interface Role {
    id: number | string;
    name: string;
    description?: string;
    [key: string]: any;
}*/

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private baseUrl = '/Home';
    private apiUrl: string;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    constructor(private http: HttpClient) {
        this.apiUrl = environment?.apiUrl || 'http://localhost:3000/api';

    }
    /**
     * Obtiene la configuración de la página de inicio
     * @returns Observable<HomeConfig>
     */
    obtenerHome(): Observable<HomeConfig> {
        return this.http.get<HomeConfig>(`${this.apiUrl}/Home/home`)
            .pipe(catchError(this.handleError));
    }
    /**
     * Actualiza la configuración de la página de inicio
     * @param homeConfig HomeConfig
     * @returns Observable<HomeConfig>
     */
    actualizarHome(homeConfig: HomeConfig): Observable<HomeConfig> {
        return this.http.put<HomeConfig>(`${this.apiUrl}/Home/home`, homeConfig)
            .pipe(catchError(this.handleError));
    }
    getAllImagenes(): Observable<HomeImage[]> {
        return this.http.get<HomeImage[]>(`${this.apiUrl}/Home/Imagen`)
            .pipe(catchError(this.handleError));
    }
    agregarImagenHome(dataSend: any): Observable<HomeImage> {
        return this.http.post<HomeImage>(`${this.apiUrl}/Home/Imagen`, dataSend)
            .pipe(catchError(this.handleError));
    }
    deleteImageHome(idImagen: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Home/Imagen/${idImagen}`)
            .pipe(catchError(this.handleError));
    }

    // Manejo básico de errores
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