export interface IngresosDiaDto{
    dia:number,
    total:number
}

export interface DashboardResumenDto{
    citasHoy:number,
    clientasActivas:number,
    ingresosHoy:number,
    ingresosMes:number,
    graficaMes:IngresosDiaDto[]
}

export interface TopClientaDto{
    clienteId:number,
    nombre:string,
    alias?:string,
    totalCitas:number,
    totalIngresos:number
}