import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as sha256 from 'sha256';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(email: string, userPassword: string): Observable<any> {
    const encryptedPassword = this.hashPassword(userPassword);

    const requestBody = {
      email: email,
      userPassword: encryptedPassword
    };
     console.log('requestBody', requestBody);
     console.log('this.apiUrl', this.apiUrl);
     console.log(userPassword)
    const loginUrl = `${this.apiUrl}/login`;

    console.log('Making login request to:', loginUrl);

    return this.http.post(loginUrl, requestBody).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError('Authentication failed. Please check your credentials.');
      })
    );
  }

  private hashPassword(password: string): string {
    // Implement your password hashing logic here (consider using a library like bcrypt)
    return sha256(password);
  }
}
