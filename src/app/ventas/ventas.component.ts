import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  productos: any[] = [];

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/producto/productos').subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarProducto(producto);
  }
}
