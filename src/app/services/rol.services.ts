import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Rol } from '../models/rol';
import { environment } from '../../environments/environment';
const url = environment?.apiUrl || 'http://localhost:3000/api';
/*export interface Role {
    id: number | string;
    name: string;
    description?: string;
    [key: string]: any;
}*/

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private baseUrl = url + '/Rol';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': '*/*',
            // add Authorization header here if needed
        })
    };

    constructor(private http: HttpClient) { }

    // Obtener todos los roles
    getAll(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    // Obtener un role por id
    getById(id: number | string): Observable<Rol> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<Rol>(url)
            .pipe(catchError(this.handleError));
    }

    // Crear un role
    create(role: Partial<Rol>): Observable<Rol> {
        //https://solanum.ledesing.com.mx/api/rol/Actualizar
        return this.http.post<Rol>(this.baseUrl, role, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Editar/actualizar un role
    update(role: Partial<Rol>): Observable<Rol> {
        const url = this.baseUrl;
        return this.http.put<Rol>(url, role, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Borrar un role
    delete(id: number,usuario:number): Observable<void> {
        const url = `${this.baseUrl}?id=${id}&idUsuario=${usuario}`;
        return this.http.delete<void>(url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Manejo básico de errores
    private handleError(error: HttpErrorResponse) {
        // Aquí puedes enriquecer el manejo (logger, transformaciones, mensajes amigables, etc.)
        let message = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
            message = `Error cliente: ${error.error.message}`;
        } else {
            message = `Error servidor: ${error.status} - ${error.message}`;
        }
        return throwError(() => new Error(message));
    }
}