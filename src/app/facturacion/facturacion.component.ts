import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService, NuevoUsuario } from '../auth.service';
import { FacturacionService } from '../FacturacionService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EmailService } from '../EmailService';
/**
 * Componente de facturación.
 * 
 * Este componente se encarga de gestionar la facturación de los productos en el carrito de compras.
 * Permite realizar el pago, generar la factura, enviar el correo de confirmación y actualizar los totales.
 */
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css'],
})
export class FacturacionComponent implements OnInit {
  /**
   * Lista de productos en el carrito de compras.
   */
  @Input() productosCarrito: any[] = [];

  /**
   * Total sin IVA de los productos en el carrito.
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
   * Mensaje de error.
   */
  mensajeError: string = '';

  /**
   * Mensaje de éxito.
   */
  mensajeExito: string = '';

  /**
   * Lista de formas de pago disponibles.
   */
  formasDePago: any[] = [];

  /**
   * Forma de pago seleccionada.
   */
  formaPagoSeleccionada: any;

  /**
   * Detalles del cliente.
   */
  clienteDetails: NuevoUsuario | null = null;

  /**
   * ID de pago.
   */
  pagoid: number | undefined;

  /**
   * Constructor del componente.
   * 
   * @param data Datos del componente.
   * @param dialogRef Referencia al diálogo.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param dialog Servicio de diálogo.
   * @param authService Servicio de autenticación.
   * @param facturacionService Servicio de facturación.
   * @param EmailService Servicio de correo electrónico.
   */
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
    this.formaPagoSeleccionada =
      data && data.formaPagoSeleccionada ? data.formaPagoSeleccionada : null;

    this.actualizarTotales();
    this.obtenerFormasDePago();
    this.obtenerDetallesCliente();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.obtenerDetallesCliente();
    this.obtenerFormasDePago();
    this.actualizarTotales();
  }

  /**
   * Cierra el diálogo.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Obtiene el total de la compra.
   * 
   * @returns El total de la compra.
   */
  getTotal(): number {
    return this.totalSinIva + this.iva;
  }

  /**
   * Realiza el pago de la compra.
   */
  pagar(): void {
    const fechaFacturacion = new Date().toISOString();
    const valorCompra = this.productosCarrito.reduce(
      (sum, producto) => sum + producto.precio,
      0
    );

    const valorIva = valorCompra * 0.19;
    const totalFacturado = valorCompra + valorIva;
    const cliente = this.clienteDetails;
    const id = this.clienteDetails?.id || 0;
    const email = this.clienteDetails?.email || '';
    const direccionEntrega = this.clienteDetails?.direccion || '';
    const telefono = this.clienteDetails?.telefono || '';
    const fecha = new Date().toISOString();
    const clienteid = this.clienteDetails?.id || 0;
    const idnull = 0;
    const formaPagoSeleccionada = this.formasDePago.find(
      (fp) => fp.id === parseInt(this.formaPagoSeleccionada)
    );
    const datosFactura = this.construirDatosFactura(
      id,
      cliente,
      fechaFacturacion,
      valorCompra,
      valorIva,
      totalFacturado,
      formaPagoSeleccionada
    );
    const cuerpoCorreo = this.construirCuerpoCorreo(this.productosCarrito);
    forkJoin([
      this.facturacionService.completarTransaccion(this.productosCarrito),
      this.facturacionService.crearFactura(datosFactura),
    ]).subscribe(
      (response) => {
        const idFactura = response[1].id;
        for (const producto of this.productosCarrito) {
          const detalleFactura = this.construirDetalleFactura(
            idFactura,
            fechaFacturacion,
            valorCompra,
            valorIva,
            totalFacturado,
            formaPagoSeleccionada,
            producto
          );
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
        const detalleDomiclio = this.construirDomicilio(
          idnull,
          cliente?.id || 0,
          direccionEntrega,
          fecha
        );
        this.facturacionService.crearDomicilio(detalleDomiclio).subscribe(
          (response) => {
            console.log('Detalle de domicilio creado con éxito');
            this.mensajeExito = 'response 1';
            console.log('Respuesta del servicio:', response);
          },
          (error) => {
            this.manipularError(error);
            console.error('error linea 77', error);
          }
        );

        // Envía el correo al cliente
        this.EmailService.enviarCorreo(
          this.clienteDetails?.email || '',
          'Compra realizada con éxito',
          cuerpoCorreo
        ).subscribe(
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

  /**
   * Construye los datos de la factura.
   * 
   * @param id ID de la factura.
   * @param cliente Detalles del cliente.
   * @param fechaFacturacion Fecha de facturación.
   * @param valorCompra Valor de la compra.
   * @param valorIva Valor del IVA.
   * @param totalFacturado Total facturado.
   * @param formaPagoSeleccionada Forma de pago seleccionada.
   * @returns Los datos de la factura.
   */
  private construirDatosFactura(
    id: number,
    cliente: NuevoUsuario | null,
    fechaFacturacion: string,
    valorCompra: number,
    valorIva: number,
    totalFacturado: number,
    formaPagoSeleccionada: any
  ): any {
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
      },
    };
  }

  /**
   * Construye los datos del domicilio.
   * 
   * @param id ID del domicilio.
   * @param cliente ID del cliente.
   * @param direccionEntrega Dirección de entrega.
   * @param fecha Fecha del domicilio.
   * @returns Los datos del domicilio.
   */
  private construirDomicilio(
    id = 0,
    cliente: number,
    direccionEntrega: string,
    fecha: string
  ): any {
    return {
      id,
      cliente,
      direccionEntrega,
      fecha,
    };
  }

  /**
   * Construye los detalles de la factura.
   * 
   * @param id ID de la factura.
   * @param fechaFacturacion Fecha de facturación.
   * @param valorCompra Valor de la compra.
   * @param valorIva Valor del IVA.
   * @param totalFacturado Total facturado.
   * @param formaPagoSeleccionada Forma de pago seleccionada.
   * @param producto Producto.
   * @returns Los detalles de la factura.
   */
  private construirDetalleFactura(
    id: number,
    fechaFacturacion: string,
    valorCompra: number,
    valorIva: number,
    totalFacturado: number,
    formaPagoSeleccionada: any,
    producto: any
  ): any {
    const datosFactura = this.construirDatosFactura(
      id,
      this.clienteDetails,
      fechaFacturacion,
      valorCompra,
      valorIva,
      totalFacturado,
      formaPagoSeleccionada
    );
    console.log(id + 'id');
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

  /**
   * Maneja el error.
   * 
   * @param error Error.
   */
  private manipularError(error: any): void {
    if (error.status === 400) {
      this.errorMensaje = error.error;
    } else {
      this.errorMensaje = 'Compra realizada con éxito';
    }
    // Puedes mostrar el mensaje de error en el HTML en lugar de usar alert
    alert(this.errorMensaje);
  }

  /**
   * Confirma la edición de un producto.
   * 
   * @param producto Producto a editar.
   */
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
   * 
   * @param producto Producto a quitar.
   */
  quitarProducto(producto: any): void {
    // Elimina el producto del array de productos en el carrito
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
  obtenerFormasDePago(): void {
    // Realiza la solicitud HTTP para obtener las formas de pago
    this.http
      .get<any[]>('http://localhost:8081/FormaPago')
      .subscribe((data: any[]) => {
        this.formasDePago = data;
      });
  }

  /**
   * Selecciona una forma de pago.
   */
  seleccionarFormaPago(): void {
    // Obtener el objeto completo de la forma de pago seleccionada
    this.formaPagoSeleccionada = this.formasDePago.find(
      (fp) => fp.id === parseInt(this.formaPagoSeleccionada)
    );

    // Puedes realizar otras acciones según la forma de pago seleccionada
    // Por ejemplo, mostrar solo el nombre si está disponible
    if (this.formaPagoSeleccionada && this.formaPagoSeleccionada.disponible) {
      console.log(
        'Nombre de la forma de pago seleccionada:',
        this.formaPagoSeleccionada.nombre
      );
    }
  }

  /**
   * Obtiene los detalles del cliente.
   */
  obtenerDetallesCliente(): void {
    this.authService.getClienteDetails().subscribe(
      (data) => {
        this.clienteDetails = data;
        console.log('Detalles del cliente:', this.clienteDetails);
      },
      (error) => {
        console.error('Error al obtener detalles del cliente:', error);
        // Maneja el error según tus necesidades
      }
    );
  }

  /**
   * Construye el cuerpo del correo electrónico.
   * 
   * @param productos Productos en el carrito.
   * @returns El cuerpo del correo electrónico.
   */
  private construirCuerpoCorreo(productos: any[]): string {
    // Construye el cuerpo del correo con la información de los productos
    let cuerpo = 'Detalles de la compra:\n';

    for (const producto of productos) {
      cuerpo += `\nNombre: ${producto.nombre}\nDescripción: ${producto.descripcion}\nPrecio: ${producto.precio}\nCantidad: ${producto.cantidadInventario}\n`;
    }

    return cuerpo;
  }
}
