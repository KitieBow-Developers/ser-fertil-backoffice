import { Generic } from "./generic";

export class User extends Generic{
    id!: number;
    nombre!: string;
    usuario!: string;
    password!: string;
    rol!: string;
    permisos!: string;
}
export class filterDataUser extends Generic{
    name!: string;
    cedula!: string;
    HClinica!: string;
    page!: number;
}