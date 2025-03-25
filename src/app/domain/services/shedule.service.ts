import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities.service';
import { Action } from './action';
import { catchError, of } from 'rxjs';
import { MedicalDto } from '../class/medical-dto';
import { ESystem } from '../enums/e-system';
import { ECitaMedical } from '../enums/e-cita-medical';

@Injectable({
  providedIn: 'root'
})
export class SheduleService implements Action{
  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }
  persistir(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  editar(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  listar(): void {
    throw new Error('Method not implemented.');
  }

  listMedical(authorization: string){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.get<MedicalDto>(
      ESystem.URL_TEMP+ECitaMedical.LISTAR_MEDICO, {'headers': headers, observe: 'response'}).
      pipe(catchError(this.utilitiesService.handleError))
  }

  getDoctorsPage(authorization: string,search:string){
      const headers= new HttpHeaders().set('Authorization', authorization);
      return this.http.get(
        ESystem.URL_TEMP + ECitaMedical.LISTAR_MEDICO+"?pagina=1&busqueda="+search, {'headers': headers, observe: 'response'}).pipe
        (catchError(this.utilitiesService.handleError));
    }
}
