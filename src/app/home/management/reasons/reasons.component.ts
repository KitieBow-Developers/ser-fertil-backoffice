import { Component,Inject,OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { ReasonsService } from '../../../domain/services/reasons.service';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialog } from './confirmationDialog/confirmationDialog';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reasons',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './reasons.component.html',
  styleUrl: './reasons.component.css'
})
export class ReasonsComponent implements OnInit {
  reasons: Array<{id: number, reason: string}> = [];

  activeEditId: number = -1;
  inputAddReason: string = '';
  inputUpdateReason: string = '';
  inputSearch: string = '';
  timeoutId : any;

  constructor(private reasonsService:ReasonsService, public dialog: MatDialog,private toast: ToastrService) { }

  ngOnInit(): void {
    this.reasonsService.listarMotivos(sessionStorage.getItem('header')!,).subscribe((data: any) => {
        if (data?.body != null) {
          let arrayReasons = [];

          const arrayData= data.body?.detalles?.motivos;
          for(let i = 0; i < arrayData.length; i++){
            arrayReasons.push({
              id:arrayData[i].id, 
              reason:arrayData[i].motivo
            }
            );
          }
         this.reasons = arrayReasons;
        }
    
      });
  }

  searchChange() {
    if(this.timeoutId)
      clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(()=>{
      this.reasons = [];
      this.getReasonsPage(this.inputSearch)
    }, 1000);
  }


  getReasonsPage(search:string){
    this.reasonsService.getReasonsPage(sessionStorage.getItem('header')!,search).subscribe((data: any) => {
      if (data?.body != null) {
          let arrayReasons = [];

          const arrayData= data.body?.detalles?.motivos;
          for(let i = 0; i < arrayData.length; i++){
            arrayReasons.push({
              id:arrayData[i].id, 
              reason:arrayData[i].motivo
            }
            );
          }
         this.reasons = arrayReasons;
        }
    
      });
  }

  trackReason(index: number, reason: any) {
    return reason.id;
  }

  editReason(id: number, reason: string) {
    this.activeEditId = id;
    this.inputUpdateReason = reason;
  }

  saveEdit() {

    this.reasonsService.updateReason(sessionStorage.getItem('header')!,this.activeEditId.toString(),{motivo:this.inputUpdateReason}).subscribe((data: any) => {
      if (data?.body != null) {
        this.inputAddReason = '';
        this.activeEditId = -1;
        this.toast.success('Motivo actualizado correctamente');
        this.getReasonsPage("");
      }
    });

  }

  cancelEdit() {
    this.activeEditId = -1;
  }


  deleteReason(event: MouseEvent, id: number, reason: string) {
      event.stopPropagation(); // Detiene la propagación del evento
      event.preventDefault(); // Evita el menú contextual del navegador
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: { 
          reason,
        },
        width: '508px',
      });
      dialogRef.afterClosed().subscribe(result =>{
        if(result){
          this.reasonsService.deleteReason(sessionStorage.getItem('header')!,id.toString()).subscribe((data: any) => {
            if (data?.body != null) {
              this.toast.success('Motivo eliminado correctamente');
              this.getReasonsPage("");
            }
          });
        }
      })
    }

    addReason() {
       this.reasonsService.addReason(sessionStorage.getItem('header')!,{motivo: this.inputAddReason}).subscribe((data: any) => {
          if (data?.body != null) {
            this.inputAddReason = '';
            this.toast.success('Motivo agregado correctamente');
            this.getReasonsPage("");
          }
      });
    }

}
