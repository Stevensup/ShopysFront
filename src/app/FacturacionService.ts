import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

/**
 * Servicio para la facturación de productos.
 */
@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  /**
   * Crea un detalle de factura.
   * @param detallesFactura - Los detalles de la factura.
   * @returns Un observable con la respuesta del servidor.
   */
  crearDetalleFactura(detallesFactura: any[]): Observable<any> {
    const url = `${this.baseUrl}/detalles-factura/guardar`;
    return this.http.post(url, detallesFactura);
  }

  private baseUrl = 'http://localhost:8090'; // Reemplaza con la URL de tu servidor
  facturaService: any;

  constructor(private http: HttpClient) {}

  /**
   * Crea una factura.
   * @param datosFactura - Los datos de la factura.
   * @returns Un observable con la respuesta del servidor.
   */
  crearFactura(datosFactura: any): Observable<any> {
    const url = `${this.baseUrl}/facturas/crear-factura`;
    return this.http.post(url, datosFactura);
  }

  /**
   * Crea un domicilio.
   * @param detalleDomiclio - Los detalles del domicilio.
   * @returns Un observable con la respuesta del servidor.
   */
  crearDomicilio(detalleDomiclio: any): Observable<any> {
    const url = `${this.baseUrl}/domicilios`;
    return this.http.post(url, detalleDomiclio);
  }

  /**
   * Completa una transacción.
   * @param productosCarrito - Los productos del carrito.
   * @returns Un observable con la respuesta del servidor.
   */
  completarTransaccion(productosCarrito: any[]): Observable<any> {
    const requests = productosCarrito.map((producto) => {
      const cantidadVendida = producto.cantidadInventario;
      return this.actualizarInventario(producto.id, cantidadVendida).pipe(
        catchError((error) => {
          // Maneja el error según sea necesario y emite un observable con el error
          console.error(
            'Error al actualizar inventario para producto',
            producto.id,
            'Cantidad vendida:',
            cantidadVendida,
            error
          );
          return throwError(error);
        })
      );
    });
    return forkJoin(requests);
  }

  private actualizarInventario(id: number, cantidadVendida: number) {
    const url = `${this.baseUrl}/producto/actualizar-inventario/${id}/${cantidadVendida}`;
    const body = { id, cantidadVendida };
    return this.http.post(url, body, { responseType: 'text' });
  }

  /**
   * Obtiene las formas de pago.
   * @returns Un observable con las formas de pago.
   */
  obtenerFormasDePago(): Observable<any[]> {
    const url = `${this.baseUrl}/FormaPago`;

    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener formas de pago:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Obtiene el ID de una forma de pago por su nombre.
   * @param nombre - El nombre de la forma de pago.
   * @returns Un observable con el ID de la forma de pago o undefined si no se encuentra.
   */
  obtenerIdFormaPagoPorNombre(nombre: string): Observable<number | undefined> {
    return this.obtenerFormasDePago().pipe(
      map((formasDePago: any[]) => {
        const formaPago = formasDePago.find((fp) => fp.nombre === nombre);
        return formaPago ? formaPago.id : undefined;
      })
    );
  }
}
