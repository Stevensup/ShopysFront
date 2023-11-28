import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'; // Importa el HttpClient
import { FacturacionComponent } from '../facturacion/facturacion.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

/**
 * Componente para el carrito de compras.
 */
@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.component.html',
  styleUrls: ['./carrito-modal.component.css'],
})
export class CarritoModalComponent {
  /**
   * Lista de productos en el carrito.
   */
  @Input() productosCarrito: any[] = [];

  /**
   * Total sin IVA.
   */
  totalSinIva: number = 0;

  /**
   * Valor del IVA.
   */
  iva: number = 0;

  /**
   * Mensaje de error.
   */
  errorMensaje: string = '';

  /**
   * Lista de formas de pago disponibles.
   */
  formasDePago: any[] = [];

  /**
   * Forma de pago seleccionada.
   */
  formaPagoSeleccionada: any;

  /**
   * Constructor del componente.
   * @param data Datos proporcionados por MAT_DIALOG_DATA.
   * @param dialogRef Referencia al diálogo actual.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param dialog Servicio de diálogo para abrir otros componentes modales.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CarritoModalComponent>,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.productosCarrito = data && data.productos ? data.productos : [];
formaPagoSeleccionada: this.formaPagoSeleccionada,
    // Calcular el total sin IVA y el IVA
    this.actualizarTotales();

    // Obtener formas de pago al inicializar el componente
    this.obtenerFormasDePago();
  }

  /**
   * Cierra el diálogo actual.
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Obtiene el total sin IVA.
   * @returns El total sin IVA.
   */
  getTotal(): number {
    return this.totalSinIva;
  }

  /**
   * Realiza el pago.
   */
  pagar(): void {
    const isLogin = localStorage.getItem('usuario');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.position = { top: '50%', left: '50%' };
    if (this.formaPagoSeleccionada != null) {
      if (isLogin) {
        const dialogRef = this.dialog.open(FacturacionComponent, {
          data: {
            productos: this.productosCarrito,
            formaPagoSeleccionada: this.formaPagoSeleccionada,
          },
          width: '400px',
          height: 'auto',
          panelClass: 'facturacion-modal-container',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.closeDialog();
        });
      } else {
        const dialogRef = this.dialog.open(LoginModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
        });
      }
    } else {
      this.errorMensaje = 'Seleccione una forma de pago';
    }
  }

  /**
   * Confirma la edición de un producto.
   * @param producto Producto a editar.
   */
  confirmarEdicion(producto: any): void {
    // Validar si la cantidad ingresada es mayor que la cantidad en la base de datos
    if (producto.cantidadInventario > producto.cantidadDisponibleEnDB) {
      this.errorMensaje =
        'Error: La cantidad ingresada es mayor que la cantidad disponible en la base de datos.';
      return;
    }
    this.errorMensaje = '';

    // Puedes realizar otras validaciones si es necesario

    // Recalcula los totales
    this.actualizarTotales();
  }

  /**
   * Actualiza los totales.
   */
  actualizarTotales(): void {
    this.totalSinIva = this.productosCarrito.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidadInventario,
      0
    );
    this.iva = this.totalSinIva * 0.19;
  }

  /**
   * Quita un producto del carrito.
   * @param producto Producto a quitar.
   */
  quitarProducto(producto: any): void {
    const index = this.productosCarrito.indexOf(producto);
    if (index !== -1) {
      this.productosCarrito.splice(index, 1);
    }

    // Recalcula los totales
    this.actualizarTotales();
  }

  /**
   * Obtiene las formas de pago disponibles.
   */
  obtenerFormasDePago() {
    this.http
      .get<any[]>('http://localhost:8090/FormaPago')
      .subscribe((data: any[]) => {
        this.formasDePago = data;
      });
  }

  /**
   * Realiza acciones según la forma de pago seleccionada.
   */
  seleccionarFormaPago() {
    if (this.formaPagoSeleccionada && this.formaPagoSeleccionada.disponible) {
      console.error(
        'Nombre de la forma de pago seleccionada:',
        this.formaPagoSeleccionada.nombre
      );
    }
  }
}
