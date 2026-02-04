export interface SaldosVacaciones {
  idSaldoPeriodo: number;
  idEmpleado: number;
  periodo: number;
  diasPorPeriodo: number;
  saldoDias: number
  fechaVencimiento: Date;
  diasAdelantados: number;
}