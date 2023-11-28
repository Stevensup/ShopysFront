import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private correoEndpoint = 'http://localhost:8081/correo/enviar';

  constructor(private http: HttpClient) { }

  enviarCorreo(destinatario: string, asunto: string, cuerpo: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const options = { headers: headers };
  
    const body = {
      destinatario: destinatario,
      asunto: asunto,
      cuerpo: cuerpo
    };
    console.log(body)
    return this.http.post<any>(this.correoEndpoint, body, options).pipe(
      catchError((error: any) => {
        console.error('Error al enviar el correo:', error);
        throw error; // Puedes manejar el error según tus necesidades
      })
    );
  }
}  