import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { SideBarService } from '../../../services/sideBar.services';
import { EstatusVacaciones } from '../../../models/estatusVacaciones';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RolService } from '../../../services/rol.services';
import { Rol } from '../../../models/rol';
import { TooltipModule } from 'primeng/tooltip';
import { Tag, TagModule } from 'primeng/tag';
import { SolicitudPermiso } from '../../../models/SolicitudPermiso';
import { PermisoServices } from '../../../services/permisos.services';
import { VacacionesServices } from '../../../services/vacaciones.services';
import { GlobalHelpers } from '../../../helpers/GlobalHerpers';
@Component({
    selector: 'repPermisos',
    templateUrl: 'RepPermisos.component.html',
    styleUrls: ['./RepPermisos.component.scss'],
    imports: [ToastModule, DialogModule, ConfirmDialogModule, CardModule, CommonModule, InputTextModule, TooltipModule, TagModule,
        FormsModule, ButtonModule, DatePickerModule, TableModule, SelectModule],
    providers: [MessageService, ConfirmationService, GlobalHelpers]
})

export class RepPermisos implements OnInit {
    loading: boolean = false;
    disabledDates: Date[] = [];
    fechaInicial: Date | null = null;
    fechaFinal: Date | null = null;
    solicitudesPermisos: SolicitudPermiso[] = []
    isCollapsed: boolean = false
    listEstatus: EstatusVacaciones[] = [];
    estatusSeleccionado: number = 0
    nombreBusqueda: string = "";
    idRoles: string = "";
    idAutorizandor: string = "";
    rolesList: Rol[] = [];
    motivoRechazo: string = "";
    showDialog: boolean = false;
    selectSolicitud: SolicitudPermiso | null = null;
    showMotivos: boolean = false;
    constructor(private messageService: MessageService, public sidebarService: SideBarService, private permisosService: PermisoServices,
        private vacacionesService: VacacionesServices,
        private rolService: RolService,
        public globalHelpers: GlobalHelpers) {

        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.idAutorizandor = dataPerfil.usuario.idEmpleado;
        this.idRoles = dataPerfil.usuario.idRoles;
    }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe({
            next: data => {
                this.isCollapsed = data
            }
        })
        this.vacacionesService.getListEstatus().subscribe({
            next: data => {
                this.listEstatus = data;

            }
        })
        this.getAllRoles();

    }
    buscarsolicitudes() {
        this.loading = true;
        //console.log(this.isAdminOrRecursosHumanos(this.idRoles))
        let isAdminORRH = true
        let dataSend = {
            nombre: this.nombreBusqueda,
            idEmpleado: null,
            idAutorizador: !isAdminORRH ? this.idAutorizandor : "",
            idEstatus: this.estatusSeleccionado > 0 ? this.estatusSeleccionado : "",
            fechaInicio: this.fechaInicial?.toLocaleDateString('en-US'),
            fechaFin: this.fechaFinal?.toLocaleDateString('en-US')
        }
        this.permisosService.getSolicitudesPermiso(dataSend).subscribe({
            next: solicitudes => {
                this.solicitudesPermisos = solicitudes;
                this.loading = false;
            }
        })
    }
    getAllRoles() {
        this.rolService.getAll().subscribe({
            next: roles => {
                this.rolesList = roles;
            }
        })
    }
    isAdminOrRecursosHumanos(idRole: string): boolean {
        const rolesArray = idRole.split(',')
        let found = false;
        rolesArray.forEach(idRol => {
            var data = this.rolesList.find(rol => rol.idRol == parseInt(idRol))
            if (data?.nombre.toLowerCase() == 'administrador' || data?.nombre.toLowerCase() == 'recursos humanos') {
                found = true;
                return
            }
        })
        return found;
    }
    handleExportExcel() {

        import('xlsx').then((xlsx) => {
            let EXCEL_EXTENSION = '.xlsx';

            const worksheet = xlsx.utils.json_to_sheet(this.solicitudesPermisos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            xlsx.writeFile(workbook, 'Solicitudes_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    };

}