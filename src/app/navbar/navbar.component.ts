import { Component } from '@angular/core';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidadEnCarrito: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    // Suscribirse al BehaviorSubject para obtener actualizaciones de la cantidad en el carrito
    this.carritoService.obtenerCantidadEnCarrito().subscribe(cantidad => {
      this.cantidadEnCarrito = cantidad;
    });
  }
}