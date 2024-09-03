import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core'
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
    NgClass,
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
export class AgendaComponent implements OnInit {

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

  ngOnInit(): void {
    if (this.date) {
      console.log(this.user.id);
      this.citaMedicaService.listarCitaMedica(sessionStorage.getItem('header')!, this.user.id.$oid, this.date).subscribe((data: any) => {
      })
    }
    this.agendarService.listMedical(sessionStorage.getItem('header')!).subscribe((data: any) => {
      for (let i = 0; i < data.body.detalles.length; i++) {
        let medico = new MedicalDto();
        console.log(medico, data.body)
        medico.name = data.body.detalles[i].nombre;
        medico.id = data.body.detalles[i].id;
        this.medicos.push(medico);
      }
      console.log(this.medicos)
    });
  }

  emiitChildAgent(date: string) {
    this.date = date;
    let tempDate: string;
    this.selectDate = new Date(this.date);
    if ((this.selectDate.getMonth() + 1) < 9) {
      tempDate = this.selectDate.getFullYear() + "-0" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    } else {
      tempDate = this.selectDate.getFullYear() + "-" + (this.selectDate.getMonth() + 1) + "-" + this.selectDate.getDate();
    }
    if (tempDate !== this.lastDate) {
      this.lastDate = tempDate;
      this.citaMedicaService.listarCitaMedica(sessionStorage.getItem('header')!, this.user.id.$oid, tempDate).subscribe((data: any) => {
        // Aquí va tu lógica
      });
    }
  }

  selectAll(event: any) {
    // const checked = event.target.checked;
    // this.dataTable.forEach(item => {
    //   item.selected = checked;
    // });
  }


}
