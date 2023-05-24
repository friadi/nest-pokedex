/*Aca esta la definicion de lo que necesito que una clase adpatdora en este xcaso una clase adaptadora Http
Tenga que implementar para que yo la pueda utilizar en cualquier otro servicio*/

export interface HttpAdapter {
    get<T>( url: string ): Promise<T>; //patron adaptador desde el video de introduccion de TypeScript
}