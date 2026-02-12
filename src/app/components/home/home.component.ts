import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HomeService } from '../../services/home.services';
import { MessageService } from 'primeng/api';
import { HomeConfig, HomeImage } from '../../models/homeConfig';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent {
  configuracion: any = { texto: "" }
  sanitizedHtmlSnippet: SafeHtml = '';
  homeConfig: HomeConfig = {
    titulo: "",
    subTitulo: "",
    mensaje: ""
  };
  imagenesCarrusel: HomeImage[] = [];
  constructor(private sanitizer: DomSanitizer, private homeServices: HomeService, private messageService: MessageService) {
    this.configuracion = localStorage.getItem("configuracion") ?? "{}";
    this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(this.configuracion);
    this.getConfig();
    this.getImagenes();
  }

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
  images: any[] = [{
    itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
    thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
    alt: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    title: 'Title 1'
  },
  {
    itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
    thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
    alt: 'lorem ipsum dolor sit amet consectetur adipiscing elit dolor sit amet consectetur adipiscing elit',
    title: 'Title 2'
  },];
  getConfig() {
    this.homeServices.obtenerHome().subscribe({
      next: (data) => {
        //console.log(data)
        this.homeConfig = data;
        let clasep = "width: 450px;"
        let noticiaReemplazo = this.homeConfig.mensaje.replace("<p>", "<p style='" + clasep + "'>");
        let noticiaReemplazo2 = noticiaReemplazo.replaceAll("&nbsp;", " ");
        this.sanitizedHtmlSnippet = this.sanitizer.bypassSecurityTrustHtml(noticiaReemplazo2);

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
        //console.log(data)
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
}