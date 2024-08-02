import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { AutenticationDTO } from '../class/autentication-dto';
import { ESystem } from '../enums/e-system';
import { EAutentication } from '../enums/eautentication';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private http: HttpClient) { }

  generarCodigo2FA(code: string){
    let payload = {}
    const headers= new HttpHeaders().set('Authorization', code);
    return this.http.post<AutenticationDTO>(
      ESystem.URL_TEMP + "/" + EAutentication.GENERAR_CODIGO_2FA, payload, {'headers': headers})
      .pipe(catchError(this.handleError));
  }

  validarCodigo2FA(code: string, authorization: string){
    let payload = {
      codigo: code
    }
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post<AutenticationDTO>(
      ESystem.URL_TEMP + "/" + EAutentication.VALIDAR_2FA, payload, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.handleError));
  }

  verificarCodigo2FA(code: string, authorization: string){
    let payload = {
      codigo: code
    }
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post<AutenticationDTO>(
      ESystem.URL_TEMP + "/" + EAutentication.VERIFICAR_2FA, payload, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.handleError));
  }
  /**
* Operación para manejar los errores
* @param error identificado a gestionar
* @returns 
*/
 public handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error) {
        errorMessage = JSON.stringify(error);
      }
    }
    return throwError(errorMessage);
  }
}
