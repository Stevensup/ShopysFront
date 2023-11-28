import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
import { AuthService } from '../auth.service';
import { tap, finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente para el modal de inicio de sesión.
 */
@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  /**
   * Correo electrónico del usuario.
   */
  email: string = '';

  /**
   * Contraseña del usuario.
   */
  userPassword: string = '';

  /**
   * Mensaje de error.
   */
  errorMessage: string = '';

  /**
   * Indicador de carga.
   */
  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {}

  /**
   * Abre el diálogo para crear un nuevo usuario.
   */
  openCreateUserDialog() {
    this.dialogRef.close(); // Cerrar el modal actual antes de abrir el nuevo
    this.dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '400px',
      height: 'auto',
      panelClass: 'login-modal-container',
    }) as MatDialogRef<any, any>;
  }

  /**
   * Realiza el inicio de sesión.
   */
  login(): void {
    if (this.email && this.userPassword) {
      this.isLoading = true; // Activa el indicador de carga

      this.authService.login(this.email, this.userPassword).pipe(
        tap((response) => {

          localStorage.setItem('usuario', JSON.stringify(response));
          const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
          this.dialogRef.close();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error del backend:', error);
          console.error('Error during login:', error);
          this.errorMessage = JSON.stringify(error); // O puedes usar error.toString()          

          return throwError(this.errorMessage); // Asegura que el error se propague
        }),
        finalize(() => {
          this.isLoading = false; // Desactiva el indicador de carga, independientemente de si hubo un error o no
        })
      ).subscribe();
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }

  /**
   * Cierra el diálogo.
   */
  closeDialog() {
    this.dialogRef.close();
  }

}
