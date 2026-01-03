import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { CardModule } from "primeng/card";


@Component({
    selector: 'app-noticias',
    templateUrl: './noticias.component.html',
    imports: [ButtonModule, DialogModule, CardModule],
    styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent {
    public visible: boolean = false
    constructor() { }
    showDialog() {
        this.visible = true;
    }
    // Aquí puedes agregar lógica para el componente de noticias
}