import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { dataPerfil } from '../models/dataPerfil';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/catalogos';
  private apiUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string>('');

  public currentUser$: Observable<string> = this.currentUserSubject.asObservable();
  private userSubject = new BehaviorSubject<string>('');

  user$ = this.userSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment?.apiUrl || 'http://localhost:3000/api';
    if (sessionStorage.getItem("isLogin") == 'true') {
      let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
      this.isAuthenticatedSubject.next(true)
      this.userSubject.next(dataPerfil.usuario.nombreCompleto)
    }
  }
  setIsAuthenticated(isAuthenticated:boolean){
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
  setUsuario(nombre: string) {
    console.log("aqui se seta el usuario", nombre)
    this.userSubject.next(nombre);
  }

login(username: string, password: string,idEmpresa:number){
  return this.http.post<any>(
    `${this.apiUrl}/Usuario/login`,
    {
      "correo": username,
      "password": password,
      "idEmpresa":idEmpresa
    },
    this.httpOptions
  ).pipe(

    catchError(this.handleError)
  );
}
 /* 
  login(username: string, password: string):  boolean {
    // Aquí puedes agregar lógica de validación real
    this.http.post<dataPerfil>(`${this.apiUrl}/Usuario/login`, {
      "correo": username,
      "password": password
    }, this.httpOptions).subscribe({
      next: data => {
        sessionStorage.setItem("isLogin", 'true');
        sessionStorage.setItem("dataPerfil", JSON.stringify(data));
        this.userSubject.next('Mexico');
        this.isAuthenticatedSubject.next(true)
        this.currentUserSubject.next(data.usuario.nombreCompleto)
        this.router.navigate(['/main']);
        return true;
      }, error: error => {
        return false;
      }
    });

    /*
        if (username && password) {
          let dataPerfil = {
            idEmpleado: 1,
            numeroNomina: 'NOM-45678',
            nombreCompleto: 'Laura Martínez Gómez',
            empresa: 'TechSolutions S.A. de C.V.',
            puesto: 'Líder de Proyecto',
            jefeInmediato: 'Carlos Ruiz',
            numero: 'Carlos Ruiz',
            roles: '3, 1, 4'
          }
          sessionStorage.setItem("isLogin", 'true');
          sessionStorage.setItem("dataPerfil", JSON.stringify(dataPerfil));
          this.userSubject.next('Mexico');
          this.isAuthenticatedSubject.next(true)
          this.currentUserSubject.next(dataPerfil.nombreCompleto)
          return true;


  }
*/
  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next('');
    sessionStorage.clear()
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }



  getCurrentUser(): string {
    return this.currentUserSubject.value;
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

    console.error('Error en Catalogos:', error);
    return throwError(() => new Error(errorMessage));
  }

}