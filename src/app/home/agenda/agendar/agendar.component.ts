import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { EClassCollor } from '../../../domain/enums/eclass-collor';
import { TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { MatRadioModule } from '@angular/material/radio';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    MatButtonModule,
    CalendarModule,
    FileUploadModule,
    MatRadioModule,
    InputTextModule,
  ],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  color: any; // Variable que almacena algún tipo de color
  orientation: boolean = false;
  dataExtra: boolean = false;

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {
    this.color = EClassCollor;
  }
  ngOnInit(): void {
    this.translateService.setDefaultLang('es');
    this.translate('es');
  }

  changeSelectRelation() {
    if (this.orientation) {
      this.orientation = false;
    } else {
      this.orientation = true;
    }
  }
  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  onUpload(event: any) {
    console.log(event)
  }

  hiddenExtraData() {
    this.dataExtra = this.dataExtra ? false : true;
  }

}

