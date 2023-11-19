// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productosEnCarrito: any[] = [];
  private carritoSubject = new BehaviorSubject<number>(0);

  // agregarProducto(producto: any): void {
  //   this.productosEnCarrito.push(producto);
  //   this.carritoSubject.next(this.productosEnCarrito.length);
  // }


  agregarProducto(producto: any): void {
    const encontrado = this.productosEnCarrito.findIndex(p => p.id === producto.id);

    if (encontrado !== -1) {
      // Producto ya está en el carrito, actualiza la cantidad
      this.productosEnCarrito[encontrado].cantidadInventario += producto.cantidadInventario;
    } else {
      // Producto no está en el carrito, agrégalo
      this.productosEnCarrito.push(producto);
    }

    this.carritoSubject.next(this.productosEnCarrito.length);
  }

  obtenerProductosEnCarrito(): any[] {
    return this.productosEnCarrito;
  }

  obtenerCantidadEnCarrito(): BehaviorSubject<number> {
    return this.carritoSubject;
  }
}
