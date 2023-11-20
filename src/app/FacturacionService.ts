import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, forkJoin, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  private baseUrl = 'http://localhost:8080'; // Reemplaza con la URL de tu servidor

  constructor(private http: HttpClient) {}




  completarTransaccion(productosCarrito: any[]): Observable<any> {
    const requests = productosCarrito.map((producto) => {
      const cantidadVendida = producto.cantidadInventario;
      return this.actualizarInventario(producto.id, cantidadVendida).pipe(
        catchError((error) => {
          // Maneja el error según sea necesario y emite un observable con el error
          console.error('Error al actualizar inventario para producto', producto.id, 'Cantidad vendida:', cantidadVendida, error);
          return throwError(error);
        })
      );
    });

    return forkJoin(requests);
  }

  
  
  

  private actualizarInventario(id: number, cantidadVendida: number) {
    const url = `${this.baseUrl}/producto/actualizar-inventario/${id}/${cantidadVendida}`;
    return this.http.post(url, {});
  }
}