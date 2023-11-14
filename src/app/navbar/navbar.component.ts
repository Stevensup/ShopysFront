import { Component } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; // Importa MatDialog
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CarritoModalComponent } from '../carrito-modal/carrito-modal.component'; 
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidadEnCarrito: number = 0;
  private isLoggedInVar: boolean = false;

  constructor(private carritoService: CarritoService, private router: Router, public dialog: MatDialog, public authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carritoService.obtenerCantidadEnCarrito().subscribe(cantidad => {
      this.cantidadEnCarrito = cantidad;
      this.authService.setLoggedIn(true);
      this.cdr.detectChanges();
    });
  }

  // Agrega el método para abrir el modal de inicio de sesión
  openLoginModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.position = { top: '50%', left: '50%' };
    dialogConfig.panelClass = 'login-modal-container'; // Puedes aplicar estilos específicos si es necesario

    const dialogRef = this.dialog.open(LoginModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
      // Puedes agregar lógica adicional después de cerrar el modal si es necesario
    });
  }

  openCarritoModal() {
    // Abre el modal con los productos del carrito
    const dialogRef = this.dialog.open(CarritoModalComponent, {
      width: '400px',
      data: { productos: this.carritoService.obtenerProductosEnCarrito() } // Pasa los productos al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de carrito se cerró');
      // Puedes agregar lógica adicional después de cerrar el modal si es necesario
    });
  }
  realizarAccion(): void {
    if (this.authService.isLoggedIn) {
      console.log('Usuario autenticado. Realizando la acción...');
      // Lógica cuando se hace clic en el nuevo botón
    } else {
      console.log('Usuario no autenticado. No se puede realizar la acción...');
      // Puedes agregar lógica adicional si es necesario
    }
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
    window.location.reload();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
