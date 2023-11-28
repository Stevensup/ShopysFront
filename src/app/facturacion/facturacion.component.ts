import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService, NuevoUsuario } from '../auth.service';
import { FacturacionService } from '../FacturacionService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EmailService } from '../EmailService';
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  @Input() productosCarrito: any[] = [];
  totalSinIva: number = 0;
  iva: number = 0;
  errorMensaje: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';
  formasDePago: any[] = [];
  formaPagoSeleccionada: any;
  clienteDetails: NuevoUsuario | null = null;
  pagoid: number | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FacturacionComponent>,
    private http: HttpClient,
    public dialog: MatDialog,
    public authService: AuthService,
    private facturacionService: FacturacionService,
    private EmailService: EmailService
    
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

  closeDialog(): void {
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
    const datosFactura = this.construirDatosFactura(id, cliente, fechaFacturacion, valorCompra, valorIva, totalFacturado, formaPagoSeleccionada);
    const cuerpoCorreo = this.construirCuerpoCorreo(this.productosCarrito);
    forkJoin([
      this.facturacionService.completarTransaccion(this.productosCarrito),
      this.facturacionService.crearFactura(datosFactura),
    ]).subscribe(
      (response) => {
        const idFactura = response[1].id;
        for (const producto of this.productosCarrito) {
          const detalleFactura = this.construirDetalleFactura(idFactura, fechaFacturacion, valorCompra, valorIva, totalFacturado, formaPagoSeleccionada, producto);
          this.facturacionService.crearDetalleFactura(detalleFactura).subscribe(
            (response) => {
              console.log('Detalle de factura creado con éxito');
              this.mensajeExito = 'response 1';
              console.log('Respuesta del servicio:', response);
            },
            (error) => {
              this.manipularError(error);
              console.error('error linea 77', error);
            }
          );
        }


          // Envía el correo al cliente
      this.EmailService.enviarCorreo(this.clienteDetails?.email || '', 'Compra realizada con éxito', cuerpoCorreo).subscribe(
        (emailResponse: any) => {
          console.log('Correo enviado con éxito', emailResponse);
        },
        (emailError: any) => {
          console.error('Error al enviar el correo', emailError);
        }
      );

        
        console.log('Factura creada con éxito');
        this.mensajeExito = 'Compra realizada con éxito';
        console.log('Respuesta del servicio:', response);
      },
      (error) => {
        this.manipularError(error);
        console.error('Error al enviar detalle de factura:', error);
      }
    );
    this.closeDialog();
  }

  private construirDatosFactura( id: number, cliente: NuevoUsuario | null, fechaFacturacion: string, valorCompra: number, valorIva: number, totalFacturado: number, formaPagoSeleccionada: any): any {
    return {
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
  }

  private construirDetalleFactura(id: number, fechaFacturacion: string, valorCompra: number, valorIva: number, totalFacturado: number, formaPagoSeleccionada: any , producto:any): any {
    const datosFactura = this.construirDatosFactura(id, this.clienteDetails, fechaFacturacion, valorCompra, valorIva, totalFacturado, formaPagoSeleccionada);
    console.log(id + "id");
    return {
      id,
      factura: {
        id,
        cliente: this.clienteDetails,
        fechaFacturacion,
        valorCompra,
        valorIva,
        totalFacturado,
        formaPago: formaPagoSeleccionada,
      },
      producto: {
        id: producto.id || 0,
        nombre: producto.nombre || 'string',
        descripcion: producto.descripcion || 'string',
        precio: producto.precio || 0,
        cantidad: producto.cantidadInventario || 0,
        categoria: producto.categoria || 'string',
      },
      cantidad: producto.cantidadInventario || 0,
      subtotalProducto: valorCompra,
    };
  }

  private manipularError(error: any): void {
    if (error.status === 400) {
      this.errorMensaje = error.error;
    } else {
      this.errorMensaje = 'Compra realizada con éxito';
    }
    // Puedes mostrar el mensaje de error en el HTML en lugar de usar alert
    alert(this.errorMensaje);
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

  obtenerFormasDePago(): void {
    // Realiza la solicitud HTTP para obtener las formas de pago
    this.http
      .get<any[]>('http://localhost:8080/FormaPago')
      .subscribe((data: any[]) => {
        this.formasDePago = data;
      });
  }

  seleccionarFormaPago(): void {
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
  }

  private construirCuerpoCorreo(productos: any[]): string {
    // Construye el cuerpo del correo con la información de los productos
    let cuerpo = 'Detalles de la compra:\n';

    for (const producto of productos) {
      cuerpo += `\nNombre: ${producto.nombre}\nDescripción: ${producto.descripcion}\nPrecio: ${producto.precio}\nCantidad: ${producto.cantidadInventario}\n`;
    }

    return cuerpo;
  }
}
