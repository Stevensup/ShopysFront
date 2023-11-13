import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'; // Importa el HttpClient

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.component.html',
  styleUrls: ['./carrito-modal.component.css'],
})
export class CarritoModalComponent {
  @Input() productosCarrito: any[] = [];
  totalSinIva: number = 0;
  iva: number = 0;
  errorMensaje: string = '';
  formasDePago: any[] = []; // Añade esta propiedad para almacenar las formas de pago
  formaPagoSeleccionada: any; // Añade esta propiedad para la forma de pago seleccionada

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CarritoModalComponent>,
    private http: HttpClient // Inyecta el servicio HttpClient
  ) {
    // Si estás utilizando MAT_DIALOG_DATA, asegúrate de inicializar productosCarrito
    // con los datos proporcionados por MAT_DIALOG_DATA.
    this.productosCarrito = data && data.productos ? data.productos : [];

    // Calcular el total sin IVA y el IVA
    this.actualizarTotales();

    // Obtener formas de pago al inicializar el componente
    this.obtenerFormasDePago();
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

  confirmarEdicion(producto: any): void {
    // Validar si la cantidad ingresada es mayor que la cantidad en la base de datos
    if (producto.cantidadInventario > producto.cantidadDisponibleEnDB) {
      // Muestra un mensaje de error en lugar de la consola
      this.errorMensaje =
        'Error: La cantidad ingresada es mayor que la cantidad disponible en la base de datos.';
      return; // Detén la ejecución aquí para evitar cambios no deseados
    }
    this.errorMensaje = '';

    // Puedes realizar otras validaciones si es necesario

    // Recalcula los totales
    this.actualizarTotales();
  }

  actualizarTotales(): void {
    this.totalSinIva = this.productosCarrito.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidadInventario,
      0
    );
    this.iva = this.totalSinIva * 0.19;
  }

  quitarProducto(producto: any): void {
    // Elimina el producto del array de productos en el carrito
    const index = this.productosCarrito.indexOf(producto);
    if (index !== -1) {
      this.productosCarrito.splice(index, 1);
    }

    // Recalcula los totales
    this.actualizarTotales();
  }

  obtenerFormasDePago() {
    // Realiza la solicitud HTTP para obtener las formas de pago
    this.http
      .get<any[]>('http://localhost:8080/FormaPago')
      .subscribe((data: any[]) => {
        this.formasDePago = data;
      });
  }

  seleccionarFormaPago() {
    // Realiza acciones según la forma de pago seleccionada
    // Por ejemplo, mostrar solo el nombre si está disponible
    if (this.formaPagoSeleccionada && this.formaPagoSeleccionada.disponible) {
      console.log(
        'Nombre de la forma de pago seleccionada:',
        this.formaPagoSeleccionada.nombre
      );
    }
  }
}
