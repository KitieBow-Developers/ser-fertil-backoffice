import { Generic } from "./generic";
import { SummaryInfoDto } from "./summary-info-dto";

export class MedicalAppointmentDTO extends Generic{
    select!: boolean;
    dt_final!: Date;
    dt_start!: Date;
    dt_cita_med!: Date;
    state!: string;
    id!: string;
    motive!: string;
    patientName!: string;
    summary: SummaryInfoDto;
    constructor(){
        super();
        this.summary = new SummaryInfoDto();
    }
}
