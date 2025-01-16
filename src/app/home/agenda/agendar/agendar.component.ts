import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppointmentBasicInfoDto } from '../../../domain/class/appointmentBasicInfo-dto';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

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
    CommonModule
  ],

  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit, OnChanges {
  color: any; // Variable que almacena algún tipo de color
  orientation: boolean = false;
  dataExtra: boolean = false;
  patient: PatientDTO;
  appointment: AppointmentBasicInfoDto;

  age!: number;
  patientSelected:boolean = false;
  patientID:string = '';

  onRequest: boolean = false;
  submited:boolean = false;

  eventDialog: any;

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

  constructor(private config: PrimeNGConfig, public dialog: MatDialog, private citaMedicaService: CitaMedicalService, private toast: ToastrService) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataPatient'] && changes['dataPatient'].currentValue) {
      
      console.log('Datos del paciente recibidos:', this.dataPatient);
    }
  }

  changeSelectRelation() {
    if (this.orientation) {
      this.orientation = false;
    } else {
      this.orientation = true;
    }
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
        this.patientID = data.body?.detalles?.id_generado; 
        console.log(data.body);
        this.appointment.nombre_med =JSON.parse(sessionStorage.getItem('user')!)?.nombre;
        this.submitAgendar();
      }
  
    });
  }

  editPatient() {

  }
  
  submitAgendar(){

    let date = new Date(this.appointment.fecha);
    let hours  = this.appointment.hora.split(':');
    date.setHours(parseInt(hours[0]),parseInt(hours[1]));

    const citaData = {
      id_paciente: this.patientID,
      id_cuenta_med:  JSON.parse(sessionStorage.getItem('user')!)?.id?.$oid,
      fecha_hora: date,
      motivo: this.appointment.motivo,
      estado: this.appointment.estado,
    }

    console.log(citaData);
    this.citaMedicaService.addCitaMedica(sessionStorage.getItem('header')!,citaData).subscribe((data: any) => {
      if (data?.body != null) {
        this.toast.success('Cita agendada correctamente');
        this.patient = new PatientDTO();
        this.appointment = new AppointmentBasicInfoDto();
      }
    });
  }
   
}

