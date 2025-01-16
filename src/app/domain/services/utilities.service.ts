import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import { catchError, map, Observable, throwError,of } from 'rxjs';
import { AutenticationDTO } from '../class/autentication-dto';
import { ESystem } from '../enums/e-system';
import { EAutentication } from '../enums/eautentication';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';


export class HttpError{
  static BadRequest = 400;
  static Unauthorized = 401;
  static Forbidden = 403;
  static NotFound = 404;
  static TimeOut = 408;
  static Conflict = 409;
  static InternalServerError = 500;
}


let toaster: ToastrService;
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private http: HttpClient, private _injector: Injector, public toast: ToastrService) { 
    toaster = toast;
   
  }

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

  let  errorMessage="";
  let  headerError="";
  console.log(error);
  
  if (error instanceof HttpErrorResponse) {
    switch (error.status) {
        case HttpError.BadRequest:
            headerError = 'Bad Request 400';
            break;

        case HttpError.Unauthorized:
            headerError = 'Unauthorized 401';
            window.location.href = '/login' + window.location.hash;
            break;

        case HttpError.NotFound:
            //show error toast message
            headerError = 'Not Found 404';
          //  const _toaster = this._injector.get(Toaster),
            const  _router = this._injector.get(Router);

            _router.navigate(['']);
            break;

        case HttpError.TimeOut:
            // Handled in AnalyticsExceptionHandler
            headerError = 'TimeOut 408';
            break;

        case HttpError.Forbidden:
            headerError = 'Forbidden 403';
            //.showForbiddenModal();
            break;

        case HttpError.InternalServerError:
            headerError = 'Server Error 500';
            break;
    }
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.message}`;
    } else {
      // Server-side errors
      if (error) {
        errorMessage = JSON.stringify(error.error);
      }
    }
    
  }
  toaster.error(errorMessage, headerError,
    {
      closeButton: false,
      timeOut: 4000,
      progressBar:true,
    }
  );
  console.error(errorMessage);
  return of({error:{
    status: error.status,
    message: errorMessage
  }});


}



  public formatDate(date: string){
    const dateParts = date.split('-');
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, '0'); // Añade un cero al mes si es necesario
    const day = dateParts[2].padStart(2, '0'); // Añade un cero al día si es necesario

    return `${year}-${month}-${day}`;
  }
}


