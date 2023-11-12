// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productosEnCarrito: any[] = [];
  private carritoSubject = new BehaviorSubject<number>(0);

  agregarProducto(producto: any): void {
    this.productosEnCarrito.push(producto);
    this.carritoSubject.next(this.productosEnCarrito.length);
  }

  obtenerProductosEnCarrito(): any[] {
    return this.productosEnCarrito;
  }

  obtenerCantidadEnCarrito(): BehaviorSubject<number> {
    return this.carritoSubject;
  }
}
