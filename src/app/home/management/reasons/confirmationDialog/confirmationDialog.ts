import { EventEmitter, Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-client-data',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgClass,
  ],
  templateUrl: './confirmationDialog.html',
  styleUrl: './confirmationDialog.css'
})
export class ConfirmationDialog implements OnInit {
  @Output() cleanConfirmationEvent = new EventEmitter<string>();

  reason: string; // Variable que almacena el motivo
  isDisabled = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmationDialog>) {
    this.reason = data.reason;
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