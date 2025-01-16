import { Injectable } from '@angular/core';
import { Action } from './action';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { AppointmentinfoDTO } from '../class/appointmentinfo-dto';
import { ESystem } from '../enums/e-system';
import { ECitaMedical } from '../enums/e-cita-medical';
import { catchError, map } from 'rxjs';
import { MedicalDto } from '../class/medical-dto';
import { MedicalAppointmentDTO } from '../class/medical-appointment-dto';
import { PatientDTO } from '../class/patient-dto';


@Injectable({
  providedIn: 'root'
})
export class CitaMedicalService implements Action{
  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }
  persistir(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  editar(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  
  listar(){

  }

  listarCitaMedica(authorization: string, idUser: string, fecha: string){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.get<AppointmentinfoDTO>(
      ESystem.URL_TEMP + ECitaMedical.CONSULTAR_CITA_MEDICA +'id_cuenta_lista='+idUser+'&fecha='+this.utilitiesService.formatDate(fecha), {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }
  listarCitaFiltro(){

  }
  searchInfoPatients(authorization: string, medicalAppointments: MedicalAppointmentDTO){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post<AppointmentinfoDTO>(
      ESystem.URL_TEMP + ECitaMedical.BUSCAR_INFO_PACIENTE+medicalAppointments.id+"/info", medicalAppointments, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));

  }


  addInfoPatients(authorization: string, patientInfo: PatientDTO){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post<PatientDTO>(
      ESystem.URL_TEMP + ECitaMedical.AGREGAR_INFO_PACIENTE, patientInfo, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));
  }

  addCitaMedica(authorization: string, citaInfo: object){
    const headers= new HttpHeaders().set('Authorization', authorization);
    return this.http.post<PatientDTO>(
      ESystem.URL_TEMP + ECitaMedical.AGREGAR_CITA_MEDICA, citaInfo, {'headers': headers, observe: 'response'}).pipe
      (catchError(this.utilitiesService.handleError));

  }

}
