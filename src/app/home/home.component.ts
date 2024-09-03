import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  name: string = "Dr. Óscar Manual Hernandez Cicadios";
  cerrarMenu!: boolean;
  agendar!: boolean;
  cuentas!: boolean;
  sistema!: boolean;
  ayuda!: boolean;

  isMenuOpen: boolean = false;

  constructor(public route: ActivatedRoute) {
    // Obtener el nombre del componente actual
    if (this.route) {
      const componentName = this.route.firstChild?.component ? this.route.firstChild?.component.name : '';
      console.log(componentName);
      switch (componentName) {
        case '_AgendaComponent':
          this.agendar = true;
          break;
      }
    }

  }

  ngOnInit(): void {

  }

  openMenu() {
    console.log("d")
    this.isMenuOpen = true;
  }

  closeMenu() {
    console.log("f")
    this.isMenuOpen = false;
  }
}
