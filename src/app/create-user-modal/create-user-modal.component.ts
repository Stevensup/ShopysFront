// create-user-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, NuevoUsuario } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Componente para crear un nuevo usuario.
 */
@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css'],
})
export class CreateUserModalComponent implements OnInit {
  /**
   * Objeto que representa los datos del nuevo usuario.
   */
  nuevoUsuario: NuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    userPassword: '',
    id: 0,
    frecuente: false,
    fechaRegistro: '',
    ctaBloqueada: false,
    intentosFallidos: 0,
  };

  /**
   * Formulario para el usuario.
   */
  userForm: FormGroup;
  showSuccessMessage: any;
  showErrorMessage: any;

  /**
   * Constructor del componente.
   * @param dialogRef Referencia al cuadro de diálogo.
   * @param authService Servicio de autenticación.
   * @param formBuilder Constructor de formularios.
   */
  constructor(
    public dialogRef: MatDialogRef<CreateUserModalComponent>,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      userPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
          ),
          Validators.minLength(8),
        ],
      ],
    });

    // Vincula el modelo y el formulario
    this.userForm.valueChanges.subscribe((data) => (this.nuevoUsuario = data));
  }

  ngOnInit() {}

  /**
   * Cierra el cuadro de diálogo.
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Registra un nuevo usuario.
   */
  registrarUsuario() {
    if (this.userForm.valid) {
      this.authService.registrarUsuario(this.userForm.value).subscribe(
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
}
