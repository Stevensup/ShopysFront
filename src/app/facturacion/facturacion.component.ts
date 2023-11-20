import { Component, Inject, Input , OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'; // Importa el HttpClient
import { AuthService, NuevoUsuario } from '../auth.service';
import { FacturacionService } from '../FacturacionService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

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
  pagoid: number | undefined; // Añade esta propiedad

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
    const fechaFacturacion = new Date().toISOString();
    const valorCompra = this.productosCarrito.reduce((sum, producto) => sum + producto.precio, 0);
    const valorIva = valorCompra * 0.19;
    const totalFacturado = valorCompra + valorIva;
    const cliente = this.clienteDetails;
    const id = this.clienteDetails?.id || 0;
    console.log('Id del cliente:', id);
    const formaPagoSeleccionada = this.formasDePago.find(fp => fp.id === parseInt(this.formaPagoSeleccionada));
    const datosFactura = {
      id,
      cliente,
      fechaFacturacion,
      valorCompra,
      valorIva,
      totalFacturado,
      formaPago: {
        id: formaPagoSeleccionada.id,
        nombre: formaPagoSeleccionada.nombre,
        disponible: formaPagoSeleccionada.disponible,
      }

    };

    const idfactura = datosFactura.id;
    const productoId = this.productosCarrito[0].id;
    const nombreProducto = this.productosCarrito[0].nombre;
    const descripcion = this.productosCarrito[0].descripcion;
    const precio = this.productosCarrito[0].precio;
    const cantidad = this.productosCarrito[0].cantidadInventario;
    const categoria = this.productosCarrito[0].categoria;

    const detalleFactura = {
      id: idfactura || 0,
      factura: {
        id: idfactura || 0,
    cliente: {
        id: this.clienteDetails?.id || 0,
        nombre: this.clienteDetails?.nombre || "string",
        apellido: this.clienteDetails?.apellido || "string",
        email: this.clienteDetails?.email || "string",
        telefono: this.clienteDetails?.telefono || "string",
        direccion: this.clienteDetails?.direccion || "string",
        userPassword: this.clienteDetails?.userPassword || "string",
        frecuente: this.clienteDetails?.frecuente || true,
        fechaRegistro: this.clienteDetails?.fechaRegistro || "2023-11-20T05:44:54.952Z",
        ctaBloqueada: this.clienteDetails?.ctaBloqueada || true,
        intentosFallidos: this.clienteDetails?.intentosFallidos || 0,
        },
        fechaFacturacion,
        valorCompra,
        valorIva,
        totalFacturado,
        formaPago: {
            id: formaPagoSeleccionada.id,
          nombre: formaPagoSeleccionada.nombre,
          disponible: formaPagoSeleccionada.disponible,
        },
      },
      producto: {
        id: productoId || 0,
        nombre: nombreProducto || "string",
        descripcion: descripcion || "string",
        precio: precio || 0,
        cantidad: cantidad || 0,
        categoria: categoria || "string",
      },
        cantidad: cantidad || 0,
        subtotalProducto: precio * cantidad || 0,  
    };
    console.log('Datos de la factura:', datosFactura);
    console.log('Productos en el carrito:', this.productosCarrito);
    forkJoin([
      this.facturacionService.completarTransaccion(this.productosCarrito),
      this.facturacionService.crearFactura(datosFactura),
      this.facturacionService.crearDetalleFactura(this.productosCarrito),
    ]).subscribe(
      () => {
        console.log('Factura creada con éxito');
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
