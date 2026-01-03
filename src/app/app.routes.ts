import { Routes } from '@angular/router';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { HomeComponent } from './components/home/home.component';

import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MiPerfilComponent } from './components/usuarios/miPerfil/miPerfil.component';
import { RegistroEmpleadoComponent } from './components/empleados/registroEmpleado/registro-empleado.component';
import { ListaRolesComponent } from './components/roles/listaRoles.component';
import { BusquedaEmpleadosComponent } from './components/empleados/busquedaEmpleados/busquedaEmpleados.component';
import { LoginComponent } from './components/login/login.component';
import { SolicitudVacacionesEmp } from './components/vacaciones/solicitud/solicitudVacaciones.component';
import { AuthGuard } from './interceptors/auth.guard';
import { ConfiguracionVacaciones } from './components/vacaciones/configuracion/configuracionVacaciones.component';
import { HistorialSolicitudes } from './components/vacaciones/historialSolicitudes/historialSolicitudes.component';
import { VacacionesAAprobar } from './components/vacaciones/vacacionesAAprobar/vacacionesAAprobar.component';
import { SolicitudPermisoComponent } from './components/permisos/solicitud/solicitudPermiso.component';
import { HistorialPermisosSolicitudes } from './components/permisos/historial/historialPermisosSolicitudes.component';
import { PermisosAAprobar } from './components/permisos/permisosAAprobar/permisosAAprobar.component';
import { RepVacaciones } from './components/reportes/repVacaciones/repVacaciones.component';
import { RepPermisos } from './components/reportes/repPermisos/RepPermisos.component';
import { HomeConfigComponent } from './components/home/ConfiguracionHome/homeConfig.component';
import { SolicitudPrestamoComponent } from './components/prestamos/solicitud/solicitudPrestamo.component';
import { HistorialSolicitudesPrestamos } from './components/prestamos/historial/historialSolicitudes.component';
import { PrestamosAAprobar } from './components/prestamos/prestamosAAprobar/prestamosAAprobar.component';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'roles', component: ListaRolesComponent, canActivate: [AuthGuard] },
  { path: 'noticias', component: NoticiasComponent, canActivate: [AuthGuard] },
  { path: 'asignacionRoles', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [AuthGuard] },
  { path: 'registro-empleado', component: RegistroEmpleadoComponent, canActivate: [AuthGuard] },
  { path: 'empleados/editar/:id', component: RegistroEmpleadoComponent, canActivate: [AuthGuard] },
  { path: 'busqueda-empleados', component: BusquedaEmpleadosComponent, canActivate: [AuthGuard] },
  { path: 'solVacaciones', component: SolicitudVacacionesEmp, canActivate: [AuthGuard] },
  { path: 'solVacacionesEmpleado', component: HistorialSolicitudes, canActivate: [AuthGuard] },
  { path: 'confVacaciones', component: ConfiguracionVacaciones, canActivate: [AuthGuard] },
  { path: 'vacacionesAAprobar', component: VacacionesAAprobar, canActivate: [AuthGuard] },
  { path: 'solPermisos', component: SolicitudPermisoComponent, canActivate: [AuthGuard] },
  { path: 'solPermisosEmpleados', component: HistorialPermisosSolicitudes, canActivate: [AuthGuard] },
  { path: 'permisosAAprobar', component: PermisosAAprobar, canActivate: [AuthGuard] },
  { path: 'repVacaciones', component: RepVacaciones, canActivate: [AuthGuard] },
  { path: 'repPermisos', component: RepPermisos, canActivate: [AuthGuard] },
  { path: 'homeConfig', component: HomeConfigComponent, canActivate: [AuthGuard] },
  { path: 'solPrestamos', component: SolicitudPrestamoComponent, canActivate: [AuthGuard] },
  { path: 'solPrestamosEmpleados', component: HistorialSolicitudesPrestamos, canActivate: [AuthGuard] },
  { path: 'prestamosAAprobar', component: PrestamosAAprobar, canActivate: [AuthGuard] },
];
