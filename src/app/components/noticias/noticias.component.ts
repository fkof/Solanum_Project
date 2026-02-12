import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from "primeng/card";
import { NoticiasService } from '../../services/noticias.services';
import { Noticias } from '../../models/noticias';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
//import { NgForOf } from "../../../../node_modules/@angular/common/common_module.d-C8_X2MOZ";
//import { NgForOf } from "../../../../node_modules/@angular/common/common_module.d-C8_X2MOZ";
@Component({
    selector: 'app-noticias',
    templateUrl: './noticias.component.html',
    imports: [ButtonModule, DialogModule, CardModule, FormsModule, CommonModule],
    styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent implements OnInit {
    public visible: boolean = false
    public arrayNoticias: Noticias[] = []
    public noticia: Noticias = {
        idNoticia: 0,
        titulo: '',
        descripcion: '',
        rutaImagen: '',
        idRol: 0,
        descripcionSafe: '',
        rolesDescripcion: '',
        idRoles: '',
    };
    rolesUsuario: string = '';
    constructor(private noticiasService: NoticiasService, private sanitizer: DomSanitizer,) {
        let dataPerfil = JSON.parse(sessionStorage.getItem("dataPerfil") ?? "")
        this.rolesUsuario = dataPerfil.usuario.idRoles//.replaceAll(",", "%2C");
        //console.log(this.rolesUsuario);
    }

    ngOnInit(): void {
        this.noticiasService.getNoticiasByRoles(this.rolesUsuario).subscribe((data: any) => {
            this.arrayNoticias = data;
            this.arrayNoticias.forEach(element => {
                let noticiaReemplazo2 = element.descripcion.replaceAll("&nbsp;", " ");
                element.descripcion = noticiaReemplazo2;
                element.descripcionSafe = this.getSanitizedHtml(noticiaReemplazo2);
            });
        })
    }
    showDialog(noticia: Noticias) {
        this.visible = true;
        this.noticia = noticia;
    }
    getSanitizedHtml(texto: string): SafeHtml {
        let previewNoticia = texto.indexOf("<p>");
        if (previewNoticia === -1) {
            texto = "<p>" + texto + "</p>";
        } else {
            let noticiaReemplazo = texto.replace("<p>",
                "<p class='demo-class'>");
            //  texto = noticiaReemplazo;
        }
        return this.sanitizer.bypassSecurityTrustHtml(texto);
    }
    // Aquí puedes agregar lógica para el componente de n
    // oticias
}