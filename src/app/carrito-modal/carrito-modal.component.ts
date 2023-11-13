// carrito-modal.component.ts
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.component.html',
  styleUrls: ['./carrito-modal.component.css']
})
export class CarritoModalComponent {
  @Input() productosCarrito: any[] = [];
  totalSinIva: number = 0;
  iva: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CarritoModalComponent>
  ) {
    // Si estás utilizando MAT_DIALOG_DATA, asegúrate de inicializar productosCarrito
    // con los datos proporcionados por MAT_DIALOG_DATA.
    this.productosCarrito = data && data.productos ? data.productos : [];

    // Calcular el total sin IVA y el IVA
    this.totalSinIva = this.productosCarrito.reduce((sum, producto) => sum + producto.precio, 0);
    this.iva = this.totalSinIva * 0.19;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getTotal(): number {
    return this.totalSinIva + this.iva;
  }

  pagar(): void {
    console.log('Pago realizado. Total a pagar:', this.getTotal());
    // Puedes agregar lógica adicional para procesar el pago si es necesario.
  }
}