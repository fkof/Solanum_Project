import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Noticias } from "../models/noticias";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
@Injectable({
    providedIn: 'root'
})
export class NoticiasService {
    private baseUrl = '/Noticias';
    private apiUrl: string;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    constructor(private http: HttpClient) {
        this.apiUrl = environment?.apiUrl + this.baseUrl || 'http://localhost:3000/api';
    }
    getAllNoticias(): Observable<Noticias[]> {
        return this.http.get<Noticias[]>(`${this.apiUrl}`)
            .pipe(catchError(this.handleError));
    }
    createNoticias(noticias: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, noticias)
            .pipe(catchError(this.handleError));
    }
    updateNoticias(noticias: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}`, noticias)
            .pipe(catchError(this.handleError));
    }
    deleteNoticias(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}?idNoticia=${id}`)
            .pipe(catchError(this.handleError));
    }
    getNoticiasByRoles(idRoles: string): Observable<Noticias[]> {
        return this.http.get<Noticias[]>(`${this.apiUrl}/NoticiaPorRol?idRoles=${idRoles}`)
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