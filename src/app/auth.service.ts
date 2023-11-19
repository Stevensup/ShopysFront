import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as sha256 from 'sha256';

export interface NuevoUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  userPassword: string;
  frecuente: boolean;
  fechaRegistro: string;
  ctaBloqueada: boolean;
  intentosFallidos: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private isLoggedInVar: boolean = false;

  constructor(private http: HttpClient) {}

  login(email: string, userPassword: string): Observable<any> {
    const encryptedPassword = this.hashPassword(userPassword);

    const requestBody = {
      email: email,
      userPassword: encryptedPassword,
    };
    console.log('requestBody', requestBody);
    console.log('this.apiUrl', this.apiUrl);
    console.log(userPassword);
    const loginUrl = `${this.apiUrl}/login`;

    console.log('Making login request to:', loginUrl);

    
    return this.http.post(loginUrl, requestBody).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error during login:', error);
        console.log('Full server response:', error.error); // Agrega esta línea
        const errorMessage = error.error;

        // Retorna el mensaje de error
        return throwError(errorMessage);
      })
    );
    
  }

  private hashPassword(password: string): string {
    // Implement your password hashing logic here (consider using a library like bcrypt)
    return sha256(password);
  }

  registrarUsuario(usuario: NuevoUsuario): Observable<any> {
    // Puedes agregar lógica adicional si es necesario
    const registroUrl = `${this.apiUrl}/cliente/registrar`;
    usuario.userPassword = this.hashPassword(usuario.userPassword);
    return this.http.post(registroUrl, usuario).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        console.log('Full server response:', error.error); // Agrega esta línea
        return throwError(
          'Authentication failed. Please check your credentials.'
        );
      })
    );
  
  }
  getClienteDetails(): Observable<NuevoUsuario> {
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      const usuario: NuevoUsuario = JSON.parse(usuarioString);

      const url = `${this.apiUrl}/cliente/${usuario.id}`;
      return this.http.get<NuevoUsuario>(url);
    } else {
      // Manejar el caso en que los datos del usuario no están disponibles en el localStorage
      return throwError('Datos del usuario no disponibles');
    }
  }

  cerrarSesion(): void {
    this.setLoggedIn(false);
    localStorage.removeItem('usuario');
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInVar;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInVar = value;
  }
}
