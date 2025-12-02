import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Aquí se puede agregar lógica adicional para verificar el token si es necesario
      return true;
    } else {
      // Redirigir al login
      return this.router.parseUrl('/');
    }
  }
}
