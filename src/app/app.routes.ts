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
  { path: 'vacacionesAAprobar', component: VacacionesAAprobar, canActivate: [AuthGuard] }
];
