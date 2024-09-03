import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities.service';
import { Action } from './action';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheduleService implements Action{
  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }
  persistir(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  editar(objeto: any): void {
    throw new Error('Method not implemented.');
  }
  listar(): void {
    throw new Error('Method not implemented.');
  }

  consultarDoc(){
    return of({
      code: 200,
      message: "Success",
      data: [
        { id: 1, nombre: "Juan" },
        { id: 2, nombre: "Ana" },
        { id: 3, nombre: "Carlos" },
        { id: 4, nombre: "María" },
        { id: 5, nombre: "Pedro" }
      ]
    });
  }
}
