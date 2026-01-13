import { FormsModule } from '@angular/forms';

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Editor } from "primeng/editor";
import { Button } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from 'primeng/api';

import { TextareaModule } from 'primeng/textarea';
import { LOCALE_ID } from "@angular/core";
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { GalleriaModule } from "primeng/galleria";

import { Dialog } from "primeng/dialog";
import { FileUpload } from "primeng/fileupload";
import { Noticias } from '../../../models/noticias';
import { NoticiasService } from '../../../services/noticias.services';
import { RolService } from '../../../services/rol.services';
import { Rol } from '../../../models/rol';
import { DropdownModule } from "primeng/dropdown";
@Component({
    selector: 'app-encuestasConfig',
    templateUrl: './encuestasConfig.component.html',
    styleUrls: ['./encuestasConfig.component.scss'],
    imports: [Editor, FormsModule, Button, ToastModule, ConfirmDialogModule, CardModule,
        DividerModule, InputTextModule, TextareaModule, TableModule, TooltipModule,
        GalleriaModule, Dialog, FileUpload, DropdownModule],
    providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-MX' }, FileUpload]

})
export class EncuestasConfigComponent implements OnInit {
    sanitizedHtmlSnippet: SafeHtml = '';
    usuarioLogueado: number = 0;
    arrayRoles: Rol[] = [];
    visible: boolean = false;
    formData = new FormData();
    @ViewChild('fileUploadRef') fileUpload!: FileUpload;
    arrayNoticias: Noticias[] = [];
    selectedRol: number = 0;
    noticia: Noticias = {
        idNoticia: 0,
        titulo: '',
        descripcion: '',
        rutaImagen: '',
        idRol: 0,
        descripcionSafe: ''
    };
    loading: boolean = false;
    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];
    toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme



    ];

    constructor(private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer,
        private noticiasService: NoticiasService,
        private rolService: RolService) {

        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.usuarioLogueado = dataPerfil.usuario.idEmpleado;
    }
    ngOnInit(): void {
        this.getNoticias();
        this.getRoles();
    }
    getRoles() {
        this.rolService.getAll().subscribe({
            next: (data) => {
                this.arrayRoles = data;
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }
    getNoticias() {
        this.noticiasService.getAllNoticias().subscribe({
            next: (data) => {
                this.arrayNoticias = data;
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }
    updateSanitizedHtml(value: string) {
        this.noticia.descripcion = value;
        this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(this.noticia.descripcion);
    }
    getSanitizedHtml(texto: string): SafeHtml {
        let previewNoticia = texto.indexOf("<p>");
        let clasep = ""
        if (previewNoticia === -1) {
            texto = "<p style='width: 350px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>" + texto + "</p>";
        } else {
            clasep = "width: 350px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
            let noticiaReemplazo = texto.replace("<p>", "<p style='" + clasep + "'>");
            texto = noticiaReemplazo;
        }
        return this.sanitizer.bypassSecurityTrustHtml(texto);
    }
    saveNoticias() {
        this.noticia.idUsuarioModificacion = this.usuarioLogueado;
        if (this.noticia.titulo === "" || this.noticia.titulo === null || this.noticia.titulo === undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El titulo es obligatorio'
            });
            return;
        }
        if (this.noticia.descripcion === "" || this.noticia.descripcion === null || this.noticia.descripcion === undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'La descripcion es obligatoria'
            });
            return;
        }

        let noticia = this.noticia.descripcion.replace("&nbsp;", " ");
        this.formData.append("titulo", this.noticia.titulo);
        this.formData.append("descripcion", this.noticia.descripcion);
        //  this.formData.append("idRol", this.noticia.idRol.toString());
        this.formData.append("idUsuarioModificacion", this.usuarioLogueado.toString());
        if (this.noticia.idNoticia === 0) {
            this.noticiasService.createNoticias(this.formData).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Noticia guardada correctamente'
                    });
                    this.getNoticias();
                    this.noticia = {
                        idNoticia: 0,
                        titulo: '',
                        descripcion: '',
                        rutaImagen: '',
                        idRol: 0,
                        descripcionSafe: ''
                    };
                    this.visible = false;
                }, error: (data) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: data
                    });
                }
            })
        } else {
            //  this.formData.delete("imagen");
            this.formData.append("idNoticia", this.noticia.idNoticia.toString());
            this.noticiasService.updateNoticias(this.formData).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Noticia actualizada correctamente'
                    });
                    this.getNoticias();
                    this.noticia = {
                        idNoticia: 0,
                        titulo: '',
                        descripcion: '',
                        rutaImagen: '',
                        idRol: 0,
                        descripcionSafe: ''
                    };
                    this.visible = false;
                }, error: (data) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: data
                    });
                }
            })
        }
    }
    onUploadFoto(event: any) {
        console.log(event)
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
            // this.extensionFotografia = file.type.split("/")[1]

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


            this.formData.append("imagen", file);

            console.log(this.formData.get("imagen"));
            //  this.homeimg.imagen = this.formData;

        }
    }

    clearImgForm() {
        this.formData.delete("imagen");
        this.formData.delete("idImagen");
        this.formData.delete("titulo");
        this.formData.delete("descripcion");
        this.formData.delete("ruta");

        this.noticia = {
            idNoticia: 0,
            titulo: '',
            descripcion: '',
            rutaImagen: '',
            idRol: 0,
            descripcionSafe: ''
        };
        this.updateSanitizedHtml('');
    }
    deleteNoticia(idImagen: number) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar esta noticia?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.loading = true;
                this.noticiasService.deleteNoticias(idImagen).subscribe({
                    next: (data) => {
                        this.loading = false;
                        this.getNoticias()
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exito',
                            detail: 'Noticia eliminada correctamente'
                        });
                        this.getNoticias();
                    }, error: (data) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: data
                        });
                    }
                })
            }
        })
    }
    selectNoticiaEdit(noticia: Noticias) {
        this.noticia = noticia;
        this.visible = true;
    }
    deleteImage() {
        this.noticia.rutaImagen = '';
    }
}