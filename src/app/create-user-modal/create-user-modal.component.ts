// create-user-modal.component.ts
import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, NuevoUsuario } from '../auth.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css']
})
export class CreateUserModalComponent implements OnInit {
  nuevoUsuario: NuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    userPassword: '',
    frecuente: false,
    fechaRegistro: '',
    ctaBloqueada: false,
    intentosFallidos: 0,
    id: 0
  };

  constructor(public dialogRef: MatDialogRef<CreateUserModalComponent>, private authService: AuthService) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close();
  }

  registrarUsuario() {
    this.authService.registrarUsuario(this.nuevoUsuario).subscribe(
      (response) => {
        console.log('Usuario registrado con éxito:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error durante el registro de usuario:', error);
      }
    );
  }
}
