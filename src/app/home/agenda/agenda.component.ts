import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit,ViewChild } from '@angular/core'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
import { AppointmentinfoDTO } from '../../domain/class/appointmentinfo-dto';
import { User } from '../../domain/class/user';
import { EClassCollor } from '../../domain/enums/eclass-collor';
import { MedicalDto } from '../../domain/class/medical-dto';
import { SheduleService } from '../../domain/services/shedule.service';
import { CitaMedicalService } from '../../domain/services/cita-medical.service';
import { CalendarComponent } from './calendar/calendar.component';
import { AgendarComponent } from './agendar/agendar.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MedicalAppointmentDTO } from '../../domain/class/medical-appointment-dto';
import { app } from '../../../../server';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    MatButtonModule,
    CalendarComponent,
    MatButtonToggleModule,
    AgendarComponent,
    CheckboxModule
  ],
  templateUrl: './agenda.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    DatePipe, // Agrega DatePipe a la lista de providers,
  ],
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit, OnDestroy {

  color: any; // Variable que almacena algún tipo de color
  selected: Date;
  date: string;
  //validador de la función
  validateMatCard: string = "agendar";
  medicos: MedicalDto[] = [];
  indiceActual = 0;
  user: any;
  selectDate: Date;
  dataTable: AppointmentinfoDTO[] = [];
  id!: string;
  resumeDataPatient: MedicalAppointmentDTO = new MedicalAppointmentDTO();
  medicalAppointments: MedicalAppointmentDTO[] = [];
  waitingTimeText: string = '0 Minutos';
  timer: any;

  inputSearch: string = '';
  timeoutId : any;

  @ViewChild(CalendarComponent)
  calendar!: CalendarComponent;


  private lastDate!: string;
  constructor(private agendarService: SheduleService, public dialog: MatDialog, private citaMedicaService: CitaMedicalService) {
    this.color = EClassCollor; // Asigna un valor a la variable color desde la enumeración EClassCollor
    this.selected = new Date();
    this.user = new User();
    this.selectDate = new Date();
    if ((this.selectDate.getMonth() + 1) < 9) {
      this.date = this.selectDate.getFullYear() + "-0" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    } else {
      this.date = this.selectDate.getFullYear() + "-" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    }
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }
  
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  ngOnInit(): void {
    if (this.date) {
      this.id = this.user.id.$oid;
    }
    this.agendarService.listMedical(sessionStorage.getItem('header')!).subscribe((data: any) => {
      if(data?.body === undefined) return;
      const arrayMedicos = data.body.detalles.medicos;
      for (let i = 0; i <arrayMedicos.length; i++) {
        let medico = new MedicalDto();
        medico.name = arrayMedicos[i].nombre;
        medico.id = arrayMedicos[i].id;
        this.medicos.push(medico);
      }
    });
    this.startWaitingTimeUpdater();
  }


  searchChange() {
      if(this.timeoutId)
        clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(()=>{
        this.medicalAppointments = [];
        let temDate= new Date(this.selectDate).toISOString().split('T')[0];
        this.citaMedicaService.listarCitaMedicaWithFilter(sessionStorage.getItem('header')!, this.id, temDate,this.inputSearch).subscribe((data: any) => {
          this.processMedicalAppointmentsData(data);
        });
      }, 1000);
  }

  appointmentDoneEmmiter(event: any) {
   this.calendar.setFecha(event);
  }

  emiitChildAgent(date: string) {
    let tempDate: string;
    this.selectDate = this.convertirFecha(date)!;
    if (this.selectDate.constructor === Date) {
      this.date = this.selectDate.toISOString();
    }
    if ((this.selectDate.getMonth() + 1) < 9) {
      tempDate = this.selectDate.getFullYear() + "-0" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    } else {
      tempDate = this.selectDate.getFullYear() + "-" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    }
    if (tempDate !== this.lastDate) {
      this.lastDate = tempDate;
      this.searchListMedical(this.id, tempDate);
    }
  }

  searchListPatientDoctor(medical: MedicalDto) {
    let date: string;
    if ((this.selectDate.getMonth() + 1) <= 9) {
      date = this.selectDate.getFullYear() + "-0" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    } else {
      date = this.selectDate.getFullYear() + "-" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    }
    this.id = medical.id;
    this.searchListMedical(this.id, date);
  }

  selectAll(event: any) {
    // const checked = event.target.checked;
    // this.dataTable.forEach(item => {
    //   item.selected = checked;
    // });
  }

  searchListMedical(id: string, date: string) {
    this.medicalAppointments = [];
    this.citaMedicaService.listarCitaMedica(sessionStorage.getItem('header')!, id, date).subscribe((data: any) => {
      this.processMedicalAppointmentsData(data);
    });
  }

  processMedicalAppointmentsData(data: any) {
    if (data.body != null) {
      const lista= data.body.detalles.lista;
      for (let i = 0; i < lista.length; i++) {
        let medicalAppointment = new MedicalAppointmentDTO();
        medicalAppointment.dt_final = new Date(lista[i].dt_cita_med);
        medicalAppointment.dt_start = new Date(lista[i].dt_cita_med);
        medicalAppointment.state = lista[i].estado;
        medicalAppointment.id = lista[i].id;
        medicalAppointment.motive = lista[i].motivo;
        if (lista[i].id_paciente) {
          medicalAppointment.id_paciente = lista[i].id_paciente;
        }
        medicalAppointment.patientName = lista[i].nombre_paciente;
        medicalAppointment.dt_cita_med = lista[i].dt_cita_med;
        if (lista[i].resumen) {
          medicalAppointment.summary.arrivalTime = lista[i].resumen.hora_llegada;
          medicalAppointment.summary.phone = lista[i].resumen.telefono;
          medicalAppointment.summary.identification = lista[i].resumen.cedula;
        }
        this.medicalAppointments.push(medicalAppointment);
      }
    } else {
      this.medicalAppointments = [];
    }
  }

  parseDate(dateString: string) {
   return new Date(dateString).toLocaleDateString("es-MX",{
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  }

  convertirFecha(fechaStr: string): Date | null {
    // Mapeo de los meses en español a su índice correspondiente
    const meses: { [key: string]: number } = {
      "enero": 0, "febrero": 1, "marzo": 2, "abril": 3, "mayo": 4, "junio": 5,
      "julio": 6, "agosto": 7, "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
    };

    // Dividir la fecha en partes
    const partes = fechaStr.toLowerCase().split(" ");
    if (partes.length !== 3) return null; // Si no tiene el formato esperado, retorna null

    const dia = parseInt(partes[0], 10); // Día como número
    const mes = meses[partes[1]];        // Mes como índice
    const anio = parseInt(partes[2], 10); // Año como número

    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null; // Validación adicional

    // Crear el objeto Date
    return new Date(anio, mes, dia);
  }
  resumePatient(medicalAppointments: MedicalAppointmentDTO) {
    if (medicalAppointments.state !== "NoDisponible") {
      this.resumeDataPatient = medicalAppointments;

      //this.resumeDataPatient.dt_start = this.convertirFecha(this.resumeDataPatient.dt_start.toString())!;

      let arrivalTime: Date = new Date();
      arrivalTime = this.convertirFecha(this.resumeDataPatient.summary.arrivalTime.toString())!;
      if (arrivalTime && arrivalTime.constructor === Date) {
        this.resumeDataPatient.summary.arrivalTime = arrivalTime.toISOString();
      }
      this.updateWaitingTime();
    }
  }

  validateStateTable(medicalAppointment: MedicalAppointmentDTO) {
    switch (medicalAppointment.state) {
      case "SinConfirmar":
        return 'listNormal';
      case "NoDisponible":
        return 'alertTable';
      case "Confirmado":
        return 'confirmTable';
      case "EnConsulta":
        return 'consultTable';
      case "Cancelado":
        return 'cancelTable';
      case "Llego":
        return 'comeTable';
      default:
        return 'attentTable'
    }
  }

  startWaitingTimeUpdater() {
    this.timer = setInterval(() => {
      this.updateWaitingTime();
    }, 20000); // Actualiza cada minuto
    this.updateWaitingTime(); // Calcula inmediatamente al cargar
  }

  updateWaitingTime() {
    // Reemplaza `resumeDataPatient.summary` con el objeto correcto en tu contexto
    if (this.resumeDataPatient.summary.arrivalTime) {
      this.waitingTimeText = this.calculateWaitingTime(this.resumeDataPatient);
    }
  }

  calculateWaitingTime(medicalAppointment: MedicalAppointmentDTO): string {
    let currentDate = new Date();
    let appointmentDate = new Date(medicalAppointment.dt_cita_med);
    let diff = currentDate.getTime() - appointmentDate.getTime();
    let diffMinutes = Math.floor(diff / (1000 * 60));

    return `${diffMinutes} Minutos`;
  }
}
