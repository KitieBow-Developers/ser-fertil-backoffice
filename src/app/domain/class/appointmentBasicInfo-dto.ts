import { Generic } from "./generic";


export class AppointmentBasicInfoDto extends Generic{
    id!: string;
    id_paciente!: string;
    id_cuenta_med!: string;
    nombre_med!: string;
    fecha_hora!: string;
    motivo!: string;
    estado!: string;
    fecha!: string;
    hora!: string;
}
