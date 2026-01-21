import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from "primeng/toast";
import { EncuestasService } from '../../services/encuestas.services';
import { Encuestas } from '../../models/encuestas';
import { MessageService } from 'primeng/api';
import { Card } from "primeng/card";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../helpers/safe.pipe';
@Component({
    selector: 'app-encuestas',
    templateUrl: './encuestas.component.html',
    imports: [ToastModule, ConfirmDialogModule, Card, FormsModule, CommonModule, SafePipe],
    providers: [ConfirmationService, MessageService],
    styleUrls: ['./encuestas.component.scss'],
})
export class EncuestasComponent {
    arrayEncuestas: Encuestas[] = [];
    rolesUsuario: string = '';
    constructor(private confirmationService: ConfirmationService,
        private encuestasService: EncuestasService,
        private messageService: MessageService,
        private sanitizer: DomSanitizer) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.rolesUsuario = dataPerfil.usuario.idRoles//.replaceAll(",", "%2C");

    }
    ngOnInit(): void {
        this.getEncuestas();
    }
    getEncuestas() {
        this.encuestasService.getEncuestasByRoles(this.rolesUsuario).subscribe({
            next: (data) => {


                this.arrayEncuestas = data;
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