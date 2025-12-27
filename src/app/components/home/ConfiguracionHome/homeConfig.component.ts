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
import { HomeConfig, HomeImage } from '../../../models/homeConfig';
import { HomeService } from '../../../services/home.services';
import { Dialog } from "primeng/dialog";
import { FileUpload } from "primeng/fileupload";
@Component({
    selector: 'app-homeConfig',
    templateUrl: './homeConfig.component.html',
    styleUrls: ['./homeConfig.component.scss'],
    imports: [Editor, FormsModule, Button, ToastModule, ConfirmDialogModule, CardModule, DividerModule, InputTextModule, TextareaModule, TableModule, TooltipModule, GalleriaModule, Dialog, FileUpload],
    providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-MX' }, FileUpload]

})
export class HomeConfigComponent implements OnInit {
    sanitizedHtmlSnippet: SafeHtml = '';
    usuarioLogueado: number = 0;
    visible: boolean = false;
    formData = new FormData();
    @ViewChild('fileUploadRef') fileUpload!: FileUpload;
    homeConfig: HomeConfig = {
        titulo: "",
        subTitulo: "",
        mensaje: ""
    };
    homeimg: HomeImage = {
        idImagen: 0,
        titulo: "",
        imagen: null,
        ruta: "",
        descripcion: ""
    }
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
    imagenesCarrusel: HomeImage[] = [];
    toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme



    ];

    constructor(private messageService: MessageService, private sanitizer: DomSanitizer, private homeServices: HomeService) {
        this.getConfig();
        this.getImagenes();
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.usuarioLogueado = dataPerfil.usuario.idEmpleado;
    }
    ngOnInit(): void {
    }
    updateSanitizedHtml(value: string) {
        this.homeConfig.mensaje = value;
        this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(this.homeConfig.mensaje);
    }
    saveConfiguracion() {
        this.homeConfig.idUsuarioModificacion = this.usuarioLogueado;
        this.homeServices.actualizarHome(this.homeConfig).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Configuración guardada correctamente'
                });
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }
    getConfig() {
        this.homeServices.obtenerHome().subscribe({
            next: (data) => {
                console.log(data)
                this.homeConfig = data;
                this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(this.homeConfig.mensaje);

            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })

    }
    getImagenes() {
        this.homeServices.getAllImagenes().subscribe({
            next: (data) => {
                console.log(data)
                this.imagenesCarrusel = data;
                //  this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(this.homeConfig.mensaje);

            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
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
            console.log(this.homeimg)
        }
    }
    agregarImagenHome() {
        this.loading = true;
        this.formData.append("idImagen", this.homeimg.idImagen.toString());
        this.formData.append("titulo", this.homeimg.titulo);
        this.formData.append("descripcion", this.homeimg.descripcion);
        this.formData.append("ruta", "");
        this.homeServices.agregarImagenHome(this.formData).subscribe({
            next: (data) => {
                this.loading = false;
                this.clearImgForm();
                this.getImagenes()
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Imagen agregada correctamente'
                });
            }, error: (data) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: data
                });
            }
        })
    }
    clearImgForm() {
        this.formData.delete("imagen");
        this.formData.delete("idImagen");
        this.formData.delete("titulo");
        this.formData.delete("descripcion");
        this.formData.delete("ruta");
        this.homeimg = {
            idImagen: 0,
            titulo: "",
            descripcion: "",
            imagen: "",
            ruta: ""
        }
        this.fileUpload.clear();
    }
}