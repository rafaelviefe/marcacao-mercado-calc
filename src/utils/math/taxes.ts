export function getAliquotaIR(dias: number, isento: boolean): number {
  if (isento) return 0;
  
  if (dias <= 180) return 0.225;
  if (dias <= 360) return 0.20;
  if (dias <= 720) return 0.175;
  return 0.15;
}