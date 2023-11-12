import { Component } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidadEnCarrito: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}


  ngOnInit(): void {
    this.carritoService.obtenerCantidadEnCarrito().subscribe(cantidad => {
      this.cantidadEnCarrito = cantidad;
    });
  }

  // Método para navegar a la página de productos
  navegarAProductos() {
    this.router.navigate(['/productos']);
  }

  // Método para navegar a la página de ventas
  navegarAVentas() {
    this.router.navigate(['/ventas']);
  }

  // Método para navegar a la página de facturación
  navegarAFacturacion() {
    this.router.navigate(['/facturacion']);
  }

  navegarALogin() {
    this.router.navigate(['/login']);
  }

  // Otros métodos de navegación según sea necesario
}
