import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core'
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
      for (let i = 0; i < data.body.detalles.length; i++) {
        let medico = new MedicalDto();
        medico.name = data.body.detalles[i].nombre;
        medico.id = data.body.detalles[i].id;
        this.medicos.push(medico);
      }
      console.log(this.medicos)
    });
    this.startWaitingTimeUpdater();
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
      if (data.body != null) {
        console.log(data.body.detalles);
        for (let i = 0; i < data.body.detalles.length; i++) {
          let medicalAppointment = new MedicalAppointmentDTO();
          medicalAppointment.dt_final = new Date(data.body.detalles[i].dt_final);
          medicalAppointment.dt_start = new Date(data.body.detalles[i].dt_inicio);
          medicalAppointment.state = data.body.detalles[i].estado;
          medicalAppointment.id = data.body.detalles[i].id;
          medicalAppointment.motive = data.body.detalles[i].motivo;
          if (data.body.detalles[i].id_paciente) {
            medicalAppointment.id_paciente = data.body.detalles[i].id_paciente;
          }
          medicalAppointment.patientName = data.body.detalles[i].nombre_paciente;
          medicalAppointment.dt_cita_med = data.body.detalles[i].dt_cita_med;
          if (data.body.detalles[i].resumen) {
            medicalAppointment.summary.arrivalTime = data.body.detalles[i].resumen.hora_llegada;
            medicalAppointment.summary.phone = data.body.detalles[i].resumen.telefono;
            medicalAppointment.summary.identification = data.body.detalles[i].resumen.cedula;
          }
          this.medicalAppointments.push(medicalAppointment);
        }
      } else {
        this.medicalAppointments = [];
      }
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
      this.resumeDataPatient.dt_start = this.convertirFecha(this.resumeDataPatient.dt_start.toString())!;

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
