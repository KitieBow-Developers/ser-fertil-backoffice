import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EClassCollor } from '../../../domain/enums/eclass-collor';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { MatRadioModule } from '@angular/material/radio';
import { InputTextModule } from 'primeng/inputtext';
import { PatientDTO } from '../../../domain/class/patient-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    MatButtonModule,
    CalendarModule,
    FileUploadModule,
    MatRadioModule,
    InputTextModule,
    FormsModule
  ],
  providers: [
  ],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  color: any; // Variable que almacena algún tipo de color
  orientation: boolean = false;
  dataExtra: boolean = false;
  patient: PatientDTO;
  age!: number;
  constructor(private config: PrimeNGConfig) {
    this.color = EClassCollor;
    this.patient = new PatientDTO();
  }
  ngOnInit(): void {
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

}

