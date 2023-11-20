import { Component, Inject, Input , OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'; // Importa el HttpClient
import { AuthService, NuevoUsuario } from '../auth.service';
import { FacturacionService } from '../FacturacionService';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit{
  @Input() productosCarrito: any[] = [];
  totalSinIva: number = 0;
  iva: number = 0;
  errorMensaje: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';
  formasDePago: any[] = []; // Añade esta propiedad para almacenar las formas de pago
  formaPagoSeleccionada: any; // Añade esta propiedad para la forma de pago seleccionada
  clienteDetails: NuevoUsuario | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FacturacionComponent>,
    private http: HttpClient,
    public dialog: MatDialog,
    public authService: AuthService,
    private facturacionService: FacturacionService
  ) {
    this.productosCarrito = data && data.productos ? data.productos : [];
    this.formaPagoSeleccionada = data && data.formaPagoSeleccionada ? data.formaPagoSeleccionada : null;
    this.actualizarTotales();
    this.obtenerFormasDePago();
    this.obtenerDetallesCliente();
  }
  ngOnInit(): void {
    this.obtenerDetallesCliente();
    this.obtenerFormasDePago();
    this.actualizarTotales();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getTotal(): number {
    return this.totalSinIva + this.iva;
  }

  pagar(): void {
    this.facturacionService.completarTransaccion(this.productosCarrito)
    .subscribe(
      () => {
        this.mensajeExito = 'Compra realizada con éxito';
      },
      (error) => {
        if (error.status === 400) {
          this.errorMensaje = error.error;
        } else {
          this.errorMensaje = 'Compra realizada con éxito';
        }
        alert(this.errorMensaje);
      }
    );
  
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
    // Obtener el objeto completo de la forma de pago seleccionada
    this.formaPagoSeleccionada = this.formasDePago.find(fp => fp.id === parseInt(this.formaPagoSeleccionada));

    // Puedes realizar otras acciones según la forma de pago seleccionada
    // Por ejemplo, mostrar solo el nombre si está disponible
    if (this.formaPagoSeleccionada && this.formaPagoSeleccionada.disponible) {
      console.log('Nombre de la forma de pago seleccionada:', this.formaPagoSeleccionada.nombre);
    }
  }

  obtenerDetallesCliente(): void {
    this.authService.getClienteDetails().subscribe(
      data => {
        this.clienteDetails = data;
        console.log('Detalles del cliente:', this.clienteDetails);
      },
      error => {
        console.error('Error al obtener detalles del cliente:', error);
        // Maneja el error según tus necesidades
      }
    );
  
  } }
