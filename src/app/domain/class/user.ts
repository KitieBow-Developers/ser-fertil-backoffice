import { Generic } from "./generic";

export class User extends Generic{
    id!: number;
    nombre!: string;
    usuario!: string;
    password!: string;
    rol!: string;
    permisos!: string;
}
