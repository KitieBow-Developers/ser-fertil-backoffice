import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../domain/class/user';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { EClassCollor } from '../domain/enums/eclass-collor';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { UserService } from '../domain/services/user.service';
import { UtilitiesService } from '../domain/services/utilities.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PasswordModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    NgClass,
    MatStepperModule,
    InputTextModule,
    DialogModule,
    QRCodeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // Definición de variables de la clase
  visible: boolean = false; // Controla la visibilidad de algún elemento en la interfaz
  controlatorVisibility: boolean = true;
  hide = true; // Variable booleana para ocultar o mostrar algo
  user: User; // Instancia de la clase User
  color: any; // Variable que almacena algún tipo de color
  digits: string[] = Array(6).fill(''); // Arreglo que representa los dígitos, inicializado con 6 elementos vacíos
  isSmallScreen!: boolean; // Indica si la pantalla es pequeña o no
  dataQR!: string; // Variable que almacena datos para un código QR
  clave_2fa!: string; // Texto de ejemplo Lorem Ipsum
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>; // Lista de elementos referenciados por la directiva @ViewChildren
  validar!: boolean;
  messageError!: string;
  AttemptsRegistered!: string;
  validateMessageErrorLogin: boolean = false;
  headerValue!: string;
  

  // Constructor de la clase
  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object, private userService: UserService, private utilitiesService: UtilitiesService, 
  private router: Router) {
    this.user = new User(); // Inicializa la instancia de User
    this.color = EClassCollor; // Asigna un valor a la variable color desde la enumeración EClassCollor
    if(sessionStorage.getItem("user")){
      this.router.navigate(["home"]);
    }
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.dataQR = "Hola mundo"; // Asigna un valor inicial a dataQR
    // Verificar el tamaño de la pantalla al cargar la página
    this.checkScreenSize();

    // Agregar un listener para el evento resize usando Renderer2
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen('window', 'resize', () => {
        this.checkScreenSize(); // Función que maneja el cambio en el tamaño de la pantalla
      });
    }
  }


  // Método que se ejecuta al escribir en un campo de dígito
  onDigitKeyUp(index: number, event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.value.length === 1) {
      // Mover al siguiente campo de entrada de dígitos
      const nextIndex = index < this.digits.length - 1 ? index + 1 : index;
      const nextInput = this.digitInputs.toArray()[nextIndex];

      if (nextInput) {
        nextInput.nativeElement.focus(); // Enfoca el siguiente campo de entrada de dígitos
      }
    }
  }

  // Método para copiar texto al portapapeles
  copyToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.value = this.clave_2fa;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  // Método para mostrar un cuadro de diálogo
  showDialog() {
    this.visible = true;
  }

  // Listener para el evento de redimensionar la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize(); // Función que maneja el cambio en el tamaño de la pantalla
  }

  // Función privada para verificar el tamaño de la pantalla
  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth <= 600; // Verifica si la pantalla es pequeña
      this.validar = window.innerWidth <= 600;
    }
  }

  validateUser(stepper: MatStepper) {
    this.validateMessageErrorLogin = false;
    if (this.user.usuario && this.user.password) {
      if (this.user.password.length >= 8) {
        this.userService.login(this.user).subscribe((response: any) => {
          console.log('Respuesta:', response);
          if (response.headers) {
            if(response.body.estado == 'error'){
              this.controlatorVisibility = true;
              this.headerValue = response.headers.get('authorization');
              stepper.next();
              this.code2FA(this.headerValue);
            }else{
              this.controlatorVisibility = false;
              this.headerValue = response.headers.get('authorization');
              stepper.next();
            }
          }
        }, (err: any) => {
          let error: any = JSON.parse(err);
          if (error.error.detalles.ValidationError) {
            switch (error.error.detalles.ValidationError[0].tipo_error) {
              case 'FieldRequired':
                this.messageError = "Todos los campos son obligatorios";
                break;
              case 'PasswordLength':
                this.messageError = "La contraseña debe tener un minimo de 8 caractares";
                break;

            }
          }
          if (error.error.detalles.AuthError) {
            switch (error.error.detalles.AuthError.tipo_error) {
              case 'PassOrUserInvalid':
                this.messageError = "Puede ser por un usuario erroneo o una contraseña erronea";
                this.AttemptsRegistered = "Intentos restantes: <b> 1 </b> de <b> 3 </b>";
                break;
              case 'UserBlocked':
                this.messageError = "El usuario supero los 3 intentos posibles";
                this.AttemptsRegistered = "Intentos restantes: <b> 3 </b> de <b> 3 </b>";
                break;
            }
          }
          this.validateMessageErrorLogin = true;
          setTimeout(() => {
            this.validateMessageErrorLogin = false;
          }, 3000);
        });
      } else {
        this.messageError = "La contraseña debe tener un minimo de 8 caractares";
        this.validateMessageErrorLogin = true;
        setTimeout(() => {
          this.validateMessageErrorLogin = false;
        }, 3000);
      }
    } else {
      this.validateMessageErrorLogin = true;
      setTimeout(() => {
        this.validateMessageErrorLogin = false;
      }, 3000);
      this.messageError = "Todos los campos son obligatorios";
    }
  }

  code2FA(code: string) {
    this.utilitiesService.generarCodigo2FA(code).subscribe((data: any) => {
      this.clave_2fa = data.detalles.clave_2fa;
      this.dataQR = data.detalles.auth_url_2fa;
    });
  }
  
  verificationCode(){
    if(this.controlatorVisibility){
      this.utilitiesService.validarCodigo2FA(this.digits.join(''), this.headerValue).subscribe((data: any)=> {
        sessionStorage.setItem('header', data.headers);
        sessionStorage.setItem('user', data.detalles);
        this.router.navigate(["home"]);
      })
    }else{
      console.log("entro")
      this.utilitiesService.verificarCodigo2FA(this.digits.join(''), this.headerValue).subscribe((data: any)=> {
        sessionStorage.setItem('header', data.headers);
        sessionStorage.setItem('user', data.detalles);
        this.router.navigate(["home"]);
      })
    }
  }

  closeMessageError() {
    this.validateMessageErrorLogin = false;
  }
}