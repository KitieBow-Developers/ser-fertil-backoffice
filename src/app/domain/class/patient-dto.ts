import { Generic } from "./generic";
import { SummaryInfoDto } from "./summary-info-dto";

export class PatientDTO extends Generic{
    id!: string;
    /*names*/ 
    nombres!: string;
    /*lastNames*/
    apellidos!: string;
    cedula!: string;
    /*principalPhone*/
    tel_principal!: string;
    /*gender*/
    sexo!: any;
    /*urlImage*/
    url_imagen!: string;
    /*profession*/
    profesion!: string;
    /*referedBy*/
    referido_por!: string;
    /*dateOfBirth*/
    fecha_nacimiento!: any;
    /*numMedicalHistory*/
    num_historia_clinica!: string;
    /*numRuc*/
    num_ruc!: string;
    /*email*/
    correo_electronico!: string;
    /*placeOfBirth*/
    lugar_nacimiento!: string;
    /*address*/
    direccion!: string;
    /*firstPhoneAdd*/
    primer_tel_add!: string;
    /*secondPhoneAdd*/
    segundo_tel_add!: string;
    /*idConjugalPatien*/
    id_paciente_conyugue!: string;
}
