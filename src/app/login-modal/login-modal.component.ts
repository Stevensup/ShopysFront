import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  email: string = '';
  userPassword: string = '';
  errorMessage: string = '';
  
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
      this.authService.login(this.email, this.userPassword).subscribe(
        (response) => {
          // Maneja la respuesta del servidor después de intentar iniciar sesión
          console.log(response);
          console.log('Respuesta del backend:', response);


          // Puedes realizar acciones adicionales después de un inicio de sesión exitoso
          // Por ejemplo, cerrar el modal
          this.dialogRef.close();
        },
        (error) => {
          // Maneja errores de autenticación aquí
          console.error(error);
          console.error('Error del backend:', error);

          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}