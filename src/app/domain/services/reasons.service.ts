import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { AppointmentinfoDTO } from '../class/appointmentinfo-dto';
import { ESystem } from '../enums/e-system';
import { EManagement } from '../enums/e-management';
import { ECitaMedical } from '../enums/e-cita-medical';
import { catchError, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ReasonsService {
  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }
 
  listarMotivos(authorization: string){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.get<AppointmentinfoDTO>(
      ESystem.URL_TEMP + ECitaMedical.LISTAR_MOTIVOS , {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  getReasonsPage(authorization: string,search:string){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.get(
      ESystem.URL_TEMP + EManagement.BASE_MOTIVOS+"/?pagina=1&motivo="+search, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  getReason(authorization: string, idReason: string){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.get(
      ESystem.URL_TEMP + EManagement.BASE_MOTIVOS+"/"+idReason, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  addReason(authorization: string, body: object){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post(
      ESystem.URL_TEMP + EManagement.BASE_MOTIVOS+"/",body,{'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  updateReason(authorization: string, idReason: string, body: object){
    const headers= new HttpHeaders().set('Authorization', authorization)
   
    console.log(headers);
    return this.http.put(
      ESystem.URL_TEMP + EManagement.BASE_MOTIVOS+"/"+idReason, body, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  deleteReason(authorization: string, idReason: string){
    const headers= new HttpHeaders().set('Authorization', authorization);

    
    return this.http.delete(
      ESystem.URL_TEMP + EManagement.BASE_MOTIVOS+"/"+idReason, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }
 
}
