import { Generic } from "./generic";
import { SummaryInfoDto } from "./summary-info-dto";

export class PatientDTO extends Generic{
    names!: string;
    lastNames!: string;
    id!: string;
    principalPhone!: string;
    gender!: string;
    urlImage!: string;
    profession!: string;
    referredBy!: string;
    dateOfBirth!: string;
    numMedicalHistory!: string;
    numRuc!: string;
    email!: string;
    placeOfBirth!: string;
    address!: string;
    firstPhoneAdd!: string;
    secondPhoneAdd!: string;
    idConjugalPatien!: string;
}
