import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CatalogosService } from '../../../services/catalogo.services';
import { Departamento } from '../../../models/departamento';
import { SelectModule } from 'primeng/select';
import { Puesto } from '../../../models/puesto';
import { Empresa } from '../../../models/empresa';
import { EmpleadosService } from '../../../services/emplados.services';
import { Empleado } from '../../../models/empleado';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { commons } from '../../../models/commons';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoadingServices } from '../../../services/loading.services';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-registro-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    DatePickerModule,
    ButtonModule,
    FloatLabelModule,
    FileUploadModule,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    MultiSelectModule,
    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.scss']
})
export class RegistroEmpleadoComponent implements OnInit {
  // Datos del formulario 
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  fechaNacimiento: Date = new Date()
  fotografia: string = '';
  correoPersonal: string = '';
  correoEmpresarial: string = '';
  fechaIngreso: Date = new Date();
  numeroNomina: string = '';
  empresaSeleccionada: Empresa[] = [];
  departamentoSeleccionado: Departamento | null = null;
  puestoSeleccionado: Puesto | null = null;
  jefeInmediato: string = '';
  jefeValidado: boolean = false;
  gerenteDepartamento: string = '';
  jefeInmediatoNomina: string = '';
  empezoCapturaNomina: boolean = false;
  idEmpleado: string = '';
  extensionFotografia: string = '';
  // Catálogos
  empresas: Empresa[] = [];
  departamentos: Departamento[] = [];
  puestos: Puesto[] = [];
  datosComunes: commons | null = null;
  filteredJefeInmediato: Empleado[] = [];
  jefeImediatos: any[] = [];
  jefeInmediatoSelect: any | null = null;
  constructor(private messageService: MessageService,
    private route: ActivatedRoute,
    private CatalogosService: CatalogosService, private router: Router,
    private EmpleadosService: EmpleadosService, private loadingService: LoadingServices) {
    this.cargarCatalogos();
    this.loadingService.setLogin(false);
  }


  ngAfterViewInit() {

  }
  ngOnInit() {
    this.loadingService.setLogin(false);
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idEmpleado = params.get('id') ?? '0'; // 'id' debe coincidir con el nombre de la ruta
      if (this.idEmpleado !== null && this.idEmpleado !== '0') {
        this.loadingService.setLogin(true);
        this.EmpleadosService.obtenerEmpleadoPorId(this.idEmpleado).subscribe({
          next: data => {
            this.nombres = data.nombre,
              this.apellidoPaterno = data.apPaterno
            this.apellidoMaterno = data.apMaterno
            this.fechaNacimiento = new Date(data.fechaNacimiento)
            this.extensionFotografia = data.extensionFotografia;
            this.fotografia = `data:image/${data.extensionFotografia};base64` + ',' + data.fotografiaConversion
            this.correoPersonal = data.correoPersonal
            this.correoEmpresarial = data.correoEmpresarial
            this.fechaIngreso = new Date(data.fechaIngreso)


            let dataSplit = data.idEmpresas.split(',')

            this.empresaSeleccionada = dataSplit
              .map(id => this.empresas.find((x: Empresa) => x.idEmpresa === parseInt(id)))
              .filter(e => e !== undefined) as Empresa[];


            this.numeroNomina = data.numeroNomina;


            this.departamentoSeleccionado = this.departamentos.find((x: Departamento) => x.idDepartamento === data.idDepartamento) ??
              { idDepartamento: data.idDepartamento, nombre: data.departamento };
            this.onDepartamentoChangeFromEdit({ idPuesto: data.idPuesto, nombre: data.puesto });






            this.jefeInmediato = data.numeroNominaJefe;
            this.validarJefe()
            this.datosComunes = {
              fechaModificacion: new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd') ?? '', fechaCreacion: data.fechaCreacion,
              idUsuarioCreacion: data.idUsuarioCreacion, idUsuarioModificacion: 999
            }
            this.loadingService.setLogin(false);
          },
          error: error => {
            this.loadingService.setLogin(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          }
        })


      }



    })
  }

  cargarCatalogos() {
    this.CatalogosService.obternerDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

      }
    })

    this.CatalogosService.obtenerEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;


      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })


  }

  onDepartamentoChangeFromEdit(puesto: Puesto) {

    if (this.departamentoSeleccionado) {
      this.CatalogosService.obternerPuestosPorDepartamento(this.departamentoSeleccionado.idDepartamento).subscribe({
        next: (data) => {

          this.puestos = data;
          this.puestoSeleccionado = this.puestos.find((p => p.idPuesto == puesto.idPuesto)) ?? puesto
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

        }
      });
      this.CatalogosService.obtenerGerentePorDepartamento(this.departamentoSeleccionado.idDepartamento).subscribe({
        next: (data) => {

          this.gerenteDepartamento = data.length > 0 ? data[0].nombreCompleto : '';
          this.messageService.add({
            severity: 'info',
            summary: 'Gerente asignado',
            detail: `Gerente: ${this.gerenteDepartamento}`
          });
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

        }
      })



    } else {
      this.gerenteDepartamento = '';
    }
  }
  onDepartamentoChange() {

    if (this.departamentoSeleccionado) {
      this.CatalogosService.obternerPuestosPorDepartamento(this.departamentoSeleccionado.idDepartamento).subscribe({
        next: (data) => {

          this.puestos = data;
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

        }
      });
      this.CatalogosService.obtenerGerentePorDepartamento(this.departamentoSeleccionado.idDepartamento).subscribe({
        next: (data) => {

          this.gerenteDepartamento = data.length > 0 ? data[0].nombreCompleto : '';
          this.messageService.add({
            severity: 'info',
            summary: 'Gerente asignado',
            detail: `Gerente: ${this.gerenteDepartamento}`
          });
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

        }
      })



    } else {
      this.gerenteDepartamento = '';
    }
  }
  setPuestosFromEdit(data: Empleado) {
    if (this.departamentoSeleccionado) {
      this.CatalogosService.obternerPuestosPorDepartamento(this.departamentoSeleccionado.idDepartamento).subscribe({
        next: (data) => {

          this.puestos = data;

        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

        }
      });
    }
  }
  filterJefeInmediato(event: any) {
    if (event.filter.length < 3) {
      this.jefeImediatos = [];
      this.jefeInmediatoSelect = null;
      this.jefeValidado = false;
      return;
    }
    if (this.jefeImediatos.length > 0) {
      return;
    }
    this.EmpleadosService.obtenerJefeInmediato(event.filter).subscribe({
      next: (data) => {
        this.jefeImediatos = data;
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    })
    //this.filteredJefeInmediato = filtered;
  }
  validarJefe() {
    if (!this.jefeInmediato || this.jefeInmediato.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingresa el número de nómina del jefe'
      });
      return;
    }
    const jefeNumero = this.jefeInmediato;
    this.jefeInmediatoNomina = jefeNumero;

    this.EmpleadosService.obtenerJefeInmediato(this.jefeInmediato).subscribe({
      next: (data) => {
        console.log(data);
        this.jefeInmediatoSelect = data[0];
        this.jefeImediatos = data;
        if (this.jefeImediatos.length > 0) {
          this.jefeValidado = true;

        } else {
          this.jefeValidado = false;
          this.messageService.add({
            severity: 'error',
            summary: 'No encontrado',
            detail: 'No se encontró ningún jefe con ese número de nómina'
          });
        }
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        this.jefeInmediato = '';
      }
    });


  }

  onJefeInmediatoChange() {
    this.jefeValidado = false;
  }
  onNumeroNominaChange() {
    this.empezoCapturaNomina = true;
  }
  onUploadFoto(event: any) {
    const file = event.files[0];
    if (file) {
      console.log("archivo", file.type)
      // Verificar si el archivo es una imagen
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Formato inválido',
          detail: 'Solo se permiten archivos de imagen (jpg, png, etc.)'
        });
        if (event.options && event.options.clear) {
          event.options.clear();
        } else if (event.originalEvent && event.originalEvent.target && event.originalEvent.target.value) {
          event.originalEvent.target.value = '';
        }
        /*if (this.fileUploadRef && this.fileUploadRef.clear) {
          this.fileUploadRef.clear();
        }*/
        return;
      }
      this.extensionFotografia = file.type.split("/")[1]

      // Validar peso máximo de 2MB (2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Archivo demasiado grande',
          detail: 'El tamaño máximo permitido es de 2 MB'
        });
        if (event.options && event.options.clear) {
          event.options.clear();
        } else if (event.originalEvent && event.originalEvent.target && event.originalEvent.target.value) {
          event.originalEvent.target.value = '';
        }
        /*if (this.fileUploadRef && this.fileUploadRef.clear) {
          this.fileUploadRef.clear();
        }*/
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotografia = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onEmpresaChange() {

    //this.numeroNomina = ''//this.empresaSeleccionada?.prefijo + '-';
  }
  limpiarFormulario() {
    this.idEmpleado = '0';
    this.nombres = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.fechaNacimiento = new Date();
    this.fotografia = '';
    this.correoPersonal = '';
    this.correoEmpresarial = '';
    this.fechaIngreso = new Date()
    this.numeroNomina = '';
    this.empresaSeleccionada = [];
    this.departamentoSeleccionado = null;
    this.puestoSeleccionado = null;
    this.jefeInmediato = '';
    this.jefeValidado = false;
    this.gerenteDepartamento = '';
    this.jefeInmediatoNomina = '';
    this.empezoCapturaNomina = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Formulario limpiado',
      detail: 'Todos los campos han sido restablecidos'
    });
  }

  guardarEmpleado() {

    // Validaciones
    if (!this.nombres || !this.apellidoPaterno || !this.fechaNacimiento ||
      !this.correoPersonal || !this.fechaIngreso ||
      !this.numeroNomina || !this.empresaSeleccionada ||
      !this.departamentoSeleccionado || !this.puestoSeleccionado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos incompletos',
        detail: 'Por favor completa todos los campos obligatorios'
      });
      return;
    }

    if (!this.jefeValidado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Jefe no validado',
        detail: 'Debes seleccionar un jefe inmediato antes de guardar'
      });
      return;
    }

    if (!this.fotografia) {
      this.messageService.add({
        severity: 'error',
        summary: 'Seleccione una fotografia',
        detail: 'Debes de seleccionar una fotografia para continuar'
      });
      return;
    }

    const nombreCompleto = `${this.nombres} ${this.apellidoPaterno}${this.apellidoMaterno ? ' ' + this.apellidoMaterno : ''}`.trim();
    console.log(this.empresaSeleccionada)
    const dataSend: Empleado = {
      idEmpleado: this.idEmpleado != '' ? parseInt(this.idEmpleado) : 0,
      nombre: this.nombres,
      apPaterno: this.apellidoPaterno,
      apMaterno: this.apellidoMaterno,
      nombreCompleto: nombreCompleto,
      fechaNacimiento: this.fechaNacimiento ? new DatePipe('en-US').transform(this.fechaNacimiento, 'yyyy-MM-dd') ?? '' : '',
      fotografia: this.fotografia.split(',')[1],
      correoPersonal: this.correoPersonal,
      correoEmpresarial: this.correoEmpresarial,
      fechaIngreso: this.fechaIngreso ? new DatePipe('en-US').transform(this.fechaIngreso, 'yyyy-MM-dd') ?? '' : '',
      numeroNomina: this.numeroNomina,
      idEmpresas: this.empresaSeleccionada.map(e => e.idEmpresa).join(','),
      empresa: '',//this.empresaSeleccionada.razonSocial,
      idDepartamento: this.departamentoSeleccionado.idDepartamento,
      departamento: this.departamentoSeleccionado.nombre,
      idPuesto: this.puestoSeleccionado.idPuesto,
      puesto: this.puestoSeleccionado.nombre,
      numeroNominaJefe: this.jefeInmediatoSelect.numeroNomina,
      idUsuarioCreacion: 9999,
      extensionFotografia: this.extensionFotografia,
      fotografiaConversion: this.fotografia.split(',')[1],
    }

    console.log('Guardando empleado:', dataSend);
    if (dataSend.idEmpleado == 0) {
      this.EmpleadosService.crearEmpleado(dataSend).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Empleado guardado',
            detail: `El empleado ${nombreCompleto} ha sido registrado exitosamente`
          });
          this.limpiarFormulario();
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error DE API', detail: error });
        }
      });
    } else {
      this.EmpleadosService.actualizarEmpleado(dataSend).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Empleado Actualizado',
            detail: `El empleado ${nombreCompleto} ha sido actualizado exitosamente`
          });
        }
      })
    }
    /*
        const empleado = {
          nombres: this.nombres,
          apellidoPaterno: this.apellidoPaterno,
          apellidoMaterno: this.apellidoMaterno,
          nombreCompleto: nombreCompleto,
          fechaNacimiento: this.fechaNacimiento,
          fotografia: this.fotografia,
          correoPersonal: this.correoPersonal,
          correoEmpresarial: this.correoEmpresarial,
          fechaIngreso: this.fechaIngreso,
          numeroNomina: this.numeroNomina,
          empresa: this.empresaSeleccionada.razonSocial,
          departamento: this.departamentoSeleccionado.nombre,
          puesto: this.puestoSeleccionado.nombre,
          jefeInmediato: this.jefeInmediato,
          gerenteDepartamento: this.gerenteDepartamento
        };
    */
    console.log('Guardando empleado:', dataSend);



    // Aquí harías la llamada al API para guardar
    // this.empleadoService.guardar(empleado).subscribe(...)
  }
  regresar() {
    this.router.navigate(['/busqueda-empleados']);

  }
}
