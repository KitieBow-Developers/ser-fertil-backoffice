import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-data',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './client-data.component.html',
  styleUrl: './client-data.component.css'
})
export class ClientDataComponent implements OnInit {
  date: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ClientDataComponent>) {
    this.date = data.fecha;
  }

  ngOnInit(): void {
  }
  
}