import { EventEmitter, Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EClassCollor } from '../../../domain/enums/eclass-collor';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-client-data',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgClass,
  ],
  templateUrl: './clean_client_data.component.html',
  styleUrl: './clean_client_data.component.css'
})
export class CleanClientData implements OnInit {
  @Output() cleanConfirmationEvent = new EventEmitter<string>();

  date: string;
  color: any; // Variable que almacena algún tipo de color
  isDisabled = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CleanClientData>) {
    this.date = data.fecha;
    this.color = EClassCollor;

  }

  ngOnInit(): void {
  }
  
  changeDelete(evt : any){
    if(evt.target.value === "borrar")
      this.isDisabled  = false;
    else
      this.isDisabled  = true;
  }

  cleanData(){
    this.dialogRef.close(true);
  }
}