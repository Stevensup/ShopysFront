import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
import { AuthService } from '../auth.service';
import { tap, finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  email: string = '';
  userPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>, private dialog: MatDialog, private authService: AuthService) {}


  ngOnInit(): void {}

  openCreateUserDialog() {
    this.dialogRef.close(); // Cerrar el modal actual antes de abrir el nuevo
    this.dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '400px',
      height: 'auto',
      panelClass: 'login-modal-container',
    }) as MatDialogRef<any, any>;
  }

  
login(): void {
  if (this.email && this.userPassword) {
    this.isLoading = true; // Activa el indicador de carga

    this.authService.login(this.email, this.userPassword).pipe(
      tap((response) => {
        // Maneja la respuesta del servidor después de intentar iniciar sesión
        console.log('Respuesta del backend:', response);
        // Puedes realizar acciones adicionales después de un inicio de sesión exitoso
        // Por ejemplo, cerrar el modal
        localStorage.setItem('usuario', JSON.stringify(response));
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        console.log(usuario);
        this.dialogRef.close();
      }),
      catchError((error) => {
        // Maneja errores de autenticación aquí
        console.error('Error del backend:', error);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        return throwError(error); // Asegura que el error se propague
      }),
      finalize(() => {
        this.isLoading = false; // Desactiva el indicador de carga, independientemente de si hubo un error o no
      })
    ).subscribe();
  } else {
    this.errorMessage = 'Por favor, completa todos los campos.';
  }
}

  closeDialog() {
    this.dialogRef.close();
  }
}