import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EClassCollor } from '../../../domain/enums/eclass-collor';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-client-data',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './client-data.component.html',
  styleUrl: './client-data.component.css'
})
export class ClientDataComponent implements OnInit {
  date: string;
  color: any; // Variable que almacena algún tipo de color

 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ClientDataComponent>) {
    this.color = EClassCollor;
    this.date = data.fecha;
  }

  ngOnInit(): void {
  }
  
}