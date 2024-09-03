import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientDataComponent } from '../client-data/client-data.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  date = new Date();
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  days: any = [];
  selectedDate = this.date.getDate();
  @HostListener('contextmenu', ['$event'])

  onRightClick(event: any) {
    event.preventDefault();
  }
  @Output() childEmitter = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {
    this.getDays(this.date.getMonth(), this.date.getFullYear());
  }
  ngOnInit(): void {
    let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
    this.childEmitter.emit(fecha.toString());
  }

  getDays(month: any, year: any) {
    let start = new Date(year, month, 1);
    let end = new Date(year, month + 1, 0);
    let prevMonthEnd = new Date(year, month, 0);
    this.days = [];
    for (let i = 1; i <= (start.getDay() + 6) % 7; i++) {
      this.days.unshift({ date: prevMonthEnd.getDate() - i + 1, outside: true });
    }
    for (let i = start.getDate(); i <= end.getDate(); i++) {
      this.days.push({ date: i, outside: false });
    }
    let nextDay = 1;
    while (this.days.length % 7 !== 0) {
      this.days.push({ date: nextDay++, outside: true });
    }
  }

  prevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.getDays(this.date.getMonth(), this.date.getFullYear());
    let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
    this.childEmitter.emit(fecha.toString());
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.getDays(this.date.getMonth(), this.date.getFullYear());
    let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
    this.childEmitter.emit(fecha.toString());
  }

  @HostListener('wheel', ['$event'])
  handleWheelEvent(event: any) {
    if (event.deltaY > 0) {
      let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
      this.childEmitter.emit(fecha.toString());
      this.nextMonth();
    } else {
      let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
      this.childEmitter.emit(fecha.toString());
      this.prevMonth();
    }
  }

  selectDate(day: any) {
    if (!day.outside) {
      this.selectedDate = day.date;
      let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
      this.childEmitter.emit(fecha.toString());
    }
  }

  isSelected(day: any) {
    let fecha = this.selectedDate + " " + this.monthNames[this.date.getMonth()] + " " + this.date.getFullYear();
    this.childEmitter.emit(fecha.toString());
    return !day.outside && day.date === this.selectedDate;
  }

  prueba(event: MouseEvent) {
    event.stopPropagation(); // Detiene la propagación del evento
    event.preventDefault(); // Evita el menú contextual del navegador
    let fecha = this.selectedDate + "|" + this.monthNames[this.date.getMonth()] + "|" + this.date.getFullYear();
    const dialogRef = this.dialog.open(ClientDataComponent, {
      data: { 
        fecha: fecha,
      },
      width: '667px',
    });
  }
}