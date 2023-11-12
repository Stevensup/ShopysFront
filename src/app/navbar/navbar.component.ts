import { Component } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidadEnCarrito: number = 0;

  constructor(private carritoService: CarritoService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.carritoService.obtenerCantidadEnCarrito().subscribe(cantidad => {
      this.cantidadEnCarrito = cantidad;
    });
  }

  // Agrega el método para abrir el modal de inicio de sesión
  openLoginModal() {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '400px',
    height: 'auto',
    position: { top: '0', left: '50%' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
      // Puedes agregar lógica adicional después de cerrar el modal si es necesario
    });
  }
}
