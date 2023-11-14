import { Component } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; // Importa MatDialog
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CarritoModalComponent } from '../carrito-modal/carrito-modal.component'; 
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { FacturacionComponent } from '../facturacion/facturacion.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidadEnCarrito: number = 0;
  private isLoggedInVar: boolean = false;
  public loginstatus: boolean  =  false;

  constructor(private carritoService: CarritoService, private router: Router, public dialog: MatDialog, public authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loginstatus = localStorage.getItem('email')? true : false;
    console.log(this.loginstatus);
    this.carritoService.obtenerCantidadEnCarrito().subscribe(cantidad => {
      this.cantidadEnCarrito = cantidad;
      this.authService.setLoggedIn(false);
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
      this.loginstatus = localStorage.getItem('email')? true : false;
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
    const dialogRef = this.dialog.open(FacturacionComponent, {
      width: '400px',
      data: { productos: this.carritoService.obtenerProductosEnCarrito() } // Pasa los productos al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de carrito se cerró');
      // Puedes agregar lógica adicional después de cerrar el modal si es necesario
    });
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.loginstatus = false;
  }
}
