import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.component.html',
  styleUrls: ['./carrito-modal.component.css']
})
export class CarritoModalComponent {
  productosCarrito: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // Recibe los datos (productos) del modal
    this.productosCarrito = data.productos;
  }
}