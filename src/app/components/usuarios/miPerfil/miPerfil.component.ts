import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Empleado } from '../../../models/empleado';
import { EmpleadosService } from '../../../services/emplados.services';
import { CatalogosService } from '../../../services/catalogo.services';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Select as dtoSelect } from '../../../models/selects';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Button } from "primeng/button";
import { RadioButtonModule } from 'primeng/radiobutton';
import { LugarResidencia } from '../../../models/lugarResidencia';
import { Ubicacion } from '../../../models/ubicacion';
import { Horario } from '../../../models/horario';
import { Transporte } from '../../../models/transporte';
import { HijosEmpleado } from '../../../models/hijosEmpleado';
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { Dialog } from "primeng/dialog";
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { InformacionAdicionalEmpleado } from '../../../models/informacionAdicionalEmpleado';
@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    DividerModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    TableModule,
    Button,
    RadioButtonModule,
    Toast,
    ConfirmDialog,
    Dialog,
    DatePickerModule,
    SkeletonModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './miPerfil.component.html',
  styleUrls: ['./miPerfil.component.scss'],
})
export class MiPerfilComponent implements OnInit {
  perfil: Empleado | null = null
  tituloUniversitario: string = "";
  fotoBD: String = "";
  jefeInmediato: string = "";
  gerenteDepartamento: string = ""
  lugarResidenciaSelect: LugarResidencia = {} as LugarResidencia;
  lugarResidencia: LugarResidencia[] = []
  generoSelect: dtoSelect | undefined;
  genero: dtoSelect[] = []
  gradoEstudiosSelect: dtoSelect | undefined;
  gradoEstudios: dtoSelect[] = []
  estadoCivilSelect: dtoSelect | undefined;
  estadoCivil: dtoSelect[] = []
  parentescoSelect: dtoSelect | undefined;
  parentesco: dtoSelect[] = []
  usoTransporte: String = "1";
  cantHijos: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectHijos: number = 0;
  ubicacionSelect: Ubicacion | undefined;
  ubicacion: Ubicacion[] = [];
  horarioSelect: Horario | undefined;
  horarios: Horario[] = [];
  transporteSelect: Transporte | undefined;
  transportes: Transporte[] = [];
  usoTransporteSelect: String = "1";

  hijos: HijosEmpleado[] = []
  addHijos: boolean = false;
  fechaNacimiento: Date = new Date();
  hijosSeleccionados: HijosEmpleado = {} as HijosEmpleado;
  perfilUsuario: any = {};
  informacionAdicional: InformacionAdicionalEmpleado = {} as InformacionAdicionalEmpleado;
  cantidadHijos: number = 0;
  actualizarInformacionAdicional: boolean = false;
  constructor(private empleadoService: EmpleadosService, private catalogosService: CatalogosService, private messageService: MessageService) {
    this.perfilUsuario = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
  }
  ngOnInit() {
    this.cargarPerfil();
    this.cargarCatalogos();
    this.cargaHijos();
    this.obtenerInformacionAdicional();
  }
  cargaHijos() {
    let perfilLocal = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
    this.empleadoService.obtenerHijos(perfilLocal.usuario.idEmpleado).subscribe({
      next: (data) => {
        this.hijos = data;
        this.selectHijos = this.hijos.length;
        this.cantidadHijos = this.selectHijos;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
  }
  cargarCatalogos() {
    this.catalogosService.obtenerCatalogoGenerico("Genero").subscribe({
      next: (data) => {
        this.genero = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerLugarResidencia().subscribe({
      next: (data) => {
        this.lugarResidencia = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerCatalogoGenerico("GradoEstudios").subscribe({
      next: (data) => {
        this.gradoEstudios = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerCatalogoGenerico("EstadoCivil").subscribe({
      next: (data) => {
        this.estadoCivil = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerCatalogoGenerico("Parentesco").subscribe({
      next: (data) => {
        this.parentesco = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerUbicacion().subscribe({
      next: (data) => {
        this.ubicacion = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    this.catalogosService.obtenerTransporte().subscribe({
      next: (data) => {
        this.transportes = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
  }
  onSelect(event: any) {
    this.transporteSelect == undefined
    this.informacionAdicional.idTransporte = 0

  }
  editHijo(hijo: HijosEmpleado) {
    this.hijosSeleccionados = hijo;
    this.hijosSeleccionados.fechaNacimiento = new Date(this.hijosSeleccionados.fechaNacimiento)
    //console.log(this.hijosSeleccionados)
    this.addHijos = true;
  }
  onHideModal() {
    this.addHijos = false;
  }
  obtenerInformacionAdicional() {
    this.empleadoService.obtenerInformacionAdicional(this.perfilUsuario.usuario.idEmpleado).subscribe({
      next: data => {
        this.informacionAdicional = data;
        if (this.informacionAdicional.idGenero > 0) {
          this.actualizarInformacionAdicional = true;
        }
        //console.log(data)
      }, error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })

  }
  addHijo() {
    if (this.selectHijos > this.cantidadHijos) {

      this.addHijos = true;
      this.hijosSeleccionados = {} as HijosEmpleado;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede agregar mas hijos' });
    }
  }
  onSave() {
    this.addHijos = false;
    this.perfilUsuario.usuario.idEmpleado
    this.hijosSeleccionados.idEmpleado = this.perfilUsuario.usuario.idEmpleado;
    this.hijosSeleccionados.idUsuarioModificacion = this.perfilUsuario.usuario.idEmpleado;
    this.hijosSeleccionados.idUsuarioCreacion = this.perfilUsuario.usuario.idEmpleado;

    if (this.hijosSeleccionados.idEmpleadoHijo == undefined) {
      this.empleadoService.crearHijos(this.hijosSeleccionados).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Hijo agregado correctamente' });
          this.hijosSeleccionados = {} as HijosEmpleado
          this.cargaHijos();
        }, error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      })
    } else {
      this.empleadoService.actualizarHijos(this.hijosSeleccionados).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Hijo editado correctamente' });
          this.hijosSeleccionados = {} as HijosEmpleado
          this.cargaHijos();
        }, error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      })
    }
  }
  cargarPerfil() {
    let perfilLocal = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
    if (perfilLocal != "") {
      this.empleadoService.obtenerEmpleadoPorId(perfilLocal.usuario.idEmpleado).subscribe({
        next: data => {
          this.perfil = data;
          this.perfil.nombreCompleto = this.perfil.nombre + " " + this.perfil.apPaterno + " " + this.perfil.apMaterno;
          this.perfil.fechaIngreso = this.formatearFecha(new Date(this.perfil.fechaIngreso))
          this.perfil.fechaNacimiento = this.formatearFecha(new Date(this.perfil.fechaNacimiento))
          this.fotoBD = `data:image/${data.extensionFotografia};base64` + ',' + data.fotografiaConversion
          this.getDataJerarquica(data.idJefeInmediato, data.idDepartamento);

        }
      })
    }
  }
  getDataJerarquica(numeroNominaJefe: string, idDepartamento: number) {

    this.empleadoService.obtenerEmpleadoPorNomina(numeroNominaJefe).subscribe({
      next: (data) => {
        //console.log(data);

        this.jefeInmediato = data.length > 0 ? data[0].nombreCompleto ?? '' : '';

      }, error: (error) => {

      }
    });

    this.catalogosService.obtenerGerentePorDepartamento(idDepartamento).subscribe({
      next: (data) => {

        this.gerenteDepartamento = data.length > 0 ? data[0].nombreCompleto : '';

      }, error: (error) => {

      }
    })
  }
  // Formato de fecha establecido por auditoría: 13-oct-25
  formatearFecha(fecha: Date): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear().toString().slice(-2);

    return `${dia}-${mes}-${año}`;
  }
  formatearFechastr(fechastr: any): string {
    let fecha = new Date(fechastr);

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear().toString().slice(-2);

    return `${dia}-${mes}-${año}`;
  }
  onSaveInformacionAdicional() {
    if (!this.isValidInformacion()) return;
    this.informacionAdicional.idEmpleado = this.perfilUsuario.usuario.idEmpleado;
    this.informacionAdicional.idUsuarioModificacion = this.perfilUsuario.usuario.idEmpleado;
    this.informacionAdicional.idUsuarioCreacion = this.perfilUsuario.usuario.idEmpleado;
    if (this.tituloUniversitario == null || this.tituloUniversitario == undefined) {
      this.informacionAdicional.tituloUniversitario = "";
    }
    if (!this.actualizarInformacionAdicional) {
      this.empleadoService.crearInformacionAdicional(this.informacionAdicional).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Informacion adicional creada correctamente' });
          this.addHijos = false;
        }, error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      })
    } else {
      this.empleadoService.actualizarInformacionAdicional(this.informacionAdicional).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Informacion adicional actualizada correctamente' });
          this.addHijos = false;
        }, error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      })
    }
  }
  isValidInformacion() {
    if (!this.informacionAdicional.idLugarResidencia || this.informacionAdicional.idLugarResidencia === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un lugar de residencia.' });
      return false;
    }
    if (!this.informacionAdicional.idGenero || this.informacionAdicional.idGenero === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un género.' });
      return false;
    }
    if (!this.informacionAdicional.idEstadoCivil || this.informacionAdicional.idEstadoCivil === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un estado civil.' });
      return false;
    }
    if (!this.informacionAdicional.idGradoEstudios || this.informacionAdicional.idGradoEstudios === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un grado de estudios.' });
      return false;
    }
    if (!this.informacionAdicional.contactoEmergencia || this.informacionAdicional.contactoEmergencia.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un contacto de emergencia.' });
      return false;
    }
    if (!this.informacionAdicional.idParentesco || this.informacionAdicional.idParentesco === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un parentesco para el contacto de emergencia.' });
      return false;
    }
    if (!this.informacionAdicional.idUbicacion || this.informacionAdicional.idUbicacion === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una ubicación.' });
      return false;
    }
    if (!this.informacionAdicional.idHorario || this.informacionAdicional.idHorario === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un horario.' });
      return false;
    }
    if (this.informacionAdicional.usaTransporte == null || this.informacionAdicional.usaTransporte == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si usa transporte.' });
      return false;
    }
    if (this.informacionAdicional.usaTransporte && (!this.informacionAdicional.idTransporte || this.informacionAdicional.idTransporte === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un tipo de transporte si lo usa.' });
      return false;
    }

    return true;
  }
}