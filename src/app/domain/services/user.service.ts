import { EnvironmentInjector, Injectable } from '@angular/core';
import { Action } from './action';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { User } from '../class/user';
import { ESystem } from '../enums/e-system';
import { EUser } from '../enums/e-user';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Action {

  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }

  persistir(objeto: any): void {
  }
  editar(objeto: any): void {
  }
  listar(): void {
  }

  login(user: User) {
    let payload = {
      usuario: user.usuario,
      password: user.password
    }
    return this.http.post<User>(
      ESystem.URL_TEMP + EUser.LOGIN, payload, {observe: 'response'})
      .pipe(catchError(this.utilitiesService.handleError));
  }

  verifaction2FA(){
    
  }

}
