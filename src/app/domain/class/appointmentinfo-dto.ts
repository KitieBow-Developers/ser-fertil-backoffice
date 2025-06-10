import { Generic } from "./generic";
import { SummaryInfoDto } from "./summary-info-dto";

export class AppointmentinfoDTO extends Generic{
    id!: string;
    nombrePacient!: string;
    idPacient!: string;
    motive!: string;
    dtCitaMed!: string;
    dtInitial!: string;
    dtFinish!: string;
    estate!: string;
    idNote!: string;
    summary: SummaryInfoDto;

    constructor(){
        super();
        this.summary = new SummaryInfoDto();
    }
}
