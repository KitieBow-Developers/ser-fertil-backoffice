import { Component, Input, OnChanges, OnInit, SimpleChanges, Output,EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EClassCollor } from '../../../domain/enums/eclass-collor';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { MatRadioModule } from '@angular/material/radio';
import { InputTextModule } from 'primeng/inputtext';
import { PatientDTO } from '../../../domain/class/patient-dto';
import { FormsModule } from '@angular/forms';
import { MedicalAppointmentDTO } from '../../../domain/class/medical-appointment-dto';
import { CleanClientData } from '../clean_client_data/clean_client_data.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CitaMedicalService } from '../../../domain/services/cita-medical.service';
import { ReasonsService } from '../../../domain/services/reasons.service';

import { SheduleService } from '../../../domain/services/shedule.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppointmentBasicInfoDto } from '../../../domain/class/appointmentBasicInfo-dto';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatDividerModule} from '@angular/material/divider';
import { get } from 'node:http';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    MatButtonModule,
    CalendarModule,
    FileUploadModule,
    MatRadioModule,
    InputTextModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatDividerModule,
    CommonModule
  ],

  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  color: any; // Variable que almacena algún tipo de color
  dataExtra: boolean = false;
  patient: PatientDTO;
  appointment: AppointmentBasicInfoDto;
  @Output() appoimentDateEmmiter = new EventEmitter<Date>();

  age!: number;
  patientSelected:boolean = false;
  spouseSelected:boolean = false;

  onRequest: boolean = false;
  submited:boolean = false;


  onPatientRequest: boolean = false;
  patientsArray: Array<{id: string, name: string}> = [];

  onDoctorRequest: boolean = false;
  doctorsArray: Array<{id: string, name: string}> = [];

  onReasonsRequest: boolean = false;
  reasonsArray: Array<{id: string, name: string}> = [];

  eventDialog: any;
  timeoutId : any;

  status: Array<object> = [
    {SinConfirmar:"Sin Confirmar"},
    {NoDisponible:"No Disponible"},
    {Confirmado:"Confirmado"},
    {EnConsulta:"En Consulta"},
    {Cancelado:"Cancelado"},
    {Atendido:"Atendido"},
    {Llego:"Llego"}
  ];
  
  @Input() dataPatient!: MedicalAppointmentDTO;
pickerTwo: any;

  constructor(
    private config: PrimeNGConfig,
    public dialog: MatDialog,
    private citaMedicaService: CitaMedicalService,
    private toast: ToastrService,
    private doctorsService: SheduleService,
    private reasonsService: ReasonsService,
  ) {
    this.color = EClassCollor;
    this.patient = new PatientDTO();
    this.appointment = new AppointmentBasicInfoDto();
    this.appointment.hora = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  }
  
  getObjectKey(obj: any): any{
    return Object.keys(obj);
  }

  getObjectValueFromKey(obj: any, key: string): any {
    return obj[key];
  }


  ngOnInit(): void {
  }

  changeToPatient() {
    this.spouseSelected = false;
    this.patient = new PatientDTO();
    this.getSelectedPatientData(this.appointment.id_paciente);
  }

  
  changeToSpouse() {
    this.spouseSelected = true;
    const tempPatientID= this.patient.id;
    this.patient = new PatientDTO();
    this.patient.id_paciente_conyugue = tempPatientID;
  }

  patientSelectedChange(event: any){

    this.getSelectedPatientData(event.value);
  }

  getSelectedPatientData(id:any){
    this.onRequest = true;
    this.citaMedicaService.getInfoPatient(sessionStorage.getItem('header')!,id).subscribe((data: any) => {
      this.onRequest = false;
      if (data?.body != null) { 
        this.patient = data.body.detalles;
        this.patientSelected = true;
        this.patient.sexo = this.patient.sexo ? "true":"false";
        this.patient.fecha_nacimiento = new Date(this.patient.fecha_nacimiento);
      } 
    });
  }

  openPatientSearch(isOpened:boolean){
    if(isOpened){
      this.patientSelected = false;
      this.patient = new PatientDTO();
      this.appointment.id_paciente = String();
      this.patientSearchChange("", 0);
    }
  }

  patientSearchChange(search: string,  debounce: number = 1000) {
    if(search.trim().length === 0 && debounce > 0){
      return;
    }

    if(this.timeoutId)
      clearTimeout(this.timeoutId);

    this.patientsArray = []
    this.timeoutId = setTimeout(()=>{
      this.onPatientRequest=true;
      this.citaMedicaService.searchPagePatients(sessionStorage.getItem('header')!,search).subscribe((data: any) => {
        this.onPatientRequest=false;

        if (data?.body != null) {
            const dataPatients = data?.body?.detalles.patients;
            let tempArr = [];
            for (let i = 0; i < dataPatients.length; i++) {
                tempArr.push({
                    id :dataPatients[i].id,
                    name :dataPatients[i].nombre
                  })
            }
            this.patientsArray = tempArr;
          }
            
      });
    }, debounce);
  }

  openDoctorSearch(isOpened:boolean){
    if(isOpened){
      this.appointment.id_cuenta_med = String();
      this.doctorSearchChange("", 0);
    }
  }

  doctorSearchChange(search: string,  debounce: number = 1000) {
    if(search.trim().length === 0 && debounce > 0){
      return;
    }
    
    if(this.timeoutId)
      clearTimeout(this.timeoutId);
    this.doctorsArray = []
    this.timeoutId = setTimeout(()=>{
      this.onDoctorRequest=true;
      this.doctorsService.getDoctorsPage(sessionStorage.getItem('header')!,search).subscribe((data: any) => {
        this.onDoctorRequest=false;
        if (data?.body != null) {
          const dataDoctors = data?.body?.detalles?.medicos;
          let tempArr = [];
          for (let i = 0; i < dataDoctors.length; i++) {
                tempArr.push({
                  id :dataDoctors[i].id,
                  name :dataDoctors[i].nombre
                })
          }
          this.doctorsArray = tempArr;
          }
            
      });
    }, debounce);
  }

  
  openReasonChange(isOpened:boolean){
    if(isOpened){
      this.appointment.motivo = String();
      this.reasonSearchChange("", 0);
    }
  }

  reasonSearchChange(search: string, debounce: number = 1000) {
    if(search.trim().length === 0 && debounce > 0){
      return;
    }
    
    if(this.timeoutId)
      clearTimeout(this.timeoutId);
      this.reasonsArray = [];
      this.timeoutId = setTimeout(()=>{
      this.onReasonsRequest=true;

      this.reasonsService.getReasonsPage(sessionStorage.getItem('header')!,search).subscribe((data: any) => {
        this.onReasonsRequest=false;
        let tempArr = [];
        if (data?.body != null) {
     
          const arrayData= data.body?.detalles?.motivos;
          for(let i = 0; i < arrayData.length; i++){
                tempArr.push({
                  id :arrayData[i].id,
                  name :arrayData[i].motivo
                })
          }
          this.reasonsArray = tempArr;
          }
            
      });
    }, debounce);
  }

  
  onUpload(event: any) {
    console.log(event)
  }

  hiddenExtraData() {
    this.dataExtra = this.dataExtra ? false : true;
  }

  cleanData(event: MouseEvent) {
      event.stopPropagation(); // Detiene la propagación del evento
      event.preventDefault(); // Evita el menú contextual del navegador
      const dialogRef = this.dialog.open(CleanClientData, {
        data: { 
          fecha: "",
        },
        width: '508px',
      });
      dialogRef.afterClosed().subscribe(result =>{
        if(result){
          this.patient = new PatientDTO();
        }
      })
    }

  registerPatient() {
    this.onRequest = true;
    this.patient.sexo = Boolean(this.patient.sexo);
    this.citaMedicaService.addInfoPatients(sessionStorage.getItem('header')!,this.patient).subscribe((data: any) => {
    this.onRequest = false;
     
      if (data?.body != null) {
        this.toast.success('Paciente registrado correctamente');
        this.appointment.id_paciente = data.body?.detalles?.id_generado; 
        this.submitAgendar();
      }
  
    });
  }

  editPatient() {
    this.onRequest = true;
    this.patient.sexo = Boolean(this.patient.sexo);
    this.patient.fecha_nacimiento = new Date(this.patient.fecha_nacimiento).toISOString().split('T')[0]
    this.citaMedicaService.updateInfoPatient(sessionStorage.getItem('header')!,this.patient.id,this.patient).subscribe((data: any) => {
      this.onRequest = false;
       
        if (data?.body != null) {
          this.toast.success('Paciente actualizado correctamente');
          this.getSelectedPatientData(this.appointment.id_paciente);
          this.patientSearchChange("", 0);

        }
    
      });
  } 
  
  submitAgendar(){

    let date = new Date(this.appointment.fecha);
    let hours  = this.appointment.hora.split(':');
    date.setHours(parseInt(hours[0]),parseInt(hours[1]));
   
    const citaData = {
      id_paciente: this.appointment.id_paciente,
      id_cuenta_med: this.appointment.id_cuenta_med,
      fecha_hora: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())),
      motivo: this.appointment.motivo,
      estado: this.appointment.estado,
    }

    this.citaMedicaService.addCitaMedica(sessionStorage.getItem('header')!,citaData).subscribe((data: any) => {
      if (data?.body != null) {
        this.appoimentDateEmmiter.emit(new Date(this.appointment.fecha));
        this.toast.success('Cita agendada correctamente');
        this.patient = new PatientDTO();
        this.appointment = new AppointmentBasicInfoDto();
        this.appointment.hora = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
        this.patientSelected = false;
        this.spouseSelected = false;
      }
    });
  }
   
}

