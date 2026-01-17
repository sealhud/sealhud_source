// LapEvents.ts
// Sistema de detecção de volta + popup colorido seguro para RaceRoom
import { formatTime } from "./utils";
import r3e from "./../lib/r3e";
import { IDriverData } from "./../types/r3eTypes";

export class LapEvents {
  private static lastLapTime = new Map<number, number>();
  private static showLapTimeUntil = new Map<number, number>();
  private static LAPTIME_DURATION = 8000; // ms

  // --- CACHE dos drivers atualizado em update() ---
  private static cachedDrivers: IDriverData[] = [];

  static update(drivers: IDriverData[]) {
    const now = performance.now();

    // atualiza cache para que chamadas posteriores sem argumento possam usar
    this.cachedDrivers = drivers.slice(); // shallow copy, evita aliasing direto

    // Melhor volta global da sessão (referência oficial do jogo)
    // const sessionBest = r3e.data.SectorTimesSessionBestLap.Sector3 ?? -1;

    // Construir melhor volta POR CLASSE (igual ao Otter)
    const bestLapByClass = new Map<number, number>();
    for (const d of drivers) {
      const classId = d.DriverInfo.ClassPerformanceIndex;
      const bestSelf = d.SectorTimeBestSelf.Sector3; // melhor volta pessoal (S3 é a volta completa)
      if (bestSelf > 0) {
        if (
          !bestLapByClass.has(classId) ||
          bestSelf < (bestLapByClass.get(classId) as number)
        ) {
          bestLapByClass.set(classId, bestSelf);
        }
      }
    }

    // Detectar novas voltas e armazenar apenas o tempo e janela de exibição
    for (const d of drivers) {
      const slot = d.DriverInfo.SlotId;
      if (slot == null) continue;

      const previousLapStored = this.lastLapTime.get(slot) ?? -1;
      const lapTime = d.SectorTimePreviousSelf.Sector3; // VOLTA COMPLETA (S1 + S2 + S3)

      if (lapTime > 0 && lapTime !== previousLapStored) {
        this.lastLapTime.set(slot, lapTime);
        this.showLapTimeUntil.set(slot, now + this.LAPTIME_DURATION);
      }
    }
  }

  static shouldShowLapTime(slot: number): boolean {
    return performance.now() < (this.showLapTimeUntil.get(slot) ?? 0);
  }

  static getLapTimeFormatted(slot: number): string {
    const t = this.lastLapTime.get(slot) ?? -1;
    if (t < 0) return "-";

    return t > 60 ? formatTime(t, "m:ss.SSS") : formatTime(t, "s.SSS");
  }

  /**
   * getLapTimeColor: aceita driverData opcional.
   * - Se driverData for passado, usa ele.
   * - Caso contrário, usa o cache atualizado pelo último update().
   *
   * Retorna a cor correta de acordo com o estado ATUAL do jogo.
   */
  static getLapTimeColor(slot: number, driverData?: IDriverData[]): string {
    const lapTime = this.lastLapTime.get(slot);
    if (!lapTime) return "#0bacd8ff"; // default

    // decide qual fonte de dados usar
    const drivers = driverData ?? this.cachedDrivers;
    if (!drivers || drivers.length === 0) return "#0bacd8ff";

    // Referência global da sessão (vinda do jogo)
    const sessionBest = r3e.data.SectorTimesSessionBestLap.Sector3 ?? -1;

    // localizar driver atual (por slot)
    const driver = drivers.find((d) => d.DriverInfo.SlotId === slot);
    if (!driver) return "#46d7ffff";

    const personalBest = driver.SectorTimeBestSelf.Sector3;

    // calcular melhor volta da classe dinamicamente (S3)
    const classId = driver.DriverInfo.ClassPerformanceIndex;
    let classBest = Infinity;
    for (const d of drivers) {
      if (d.DriverInfo.ClassPerformanceIndex === classId) {
        const best = d.SectorTimeBestSelf.Sector3;
        if (best > 0 && best < classBest) classBest = best;
      }
    }

    // Prioridades de cor (avaliadas com dados ATUAIS)
    if (sessionBest > 0 && lapTime === sessionBest) {
      return "#8718c7ff"; // melhor volta da sessão (única por definição)
    }

    if (classBest < Infinity && lapTime === classBest) {
      return "#ba7edfff"; // melhor volta da classe
    }

    if (personalBest > 0 && lapTime === personalBest) {
      return "#00CC66"; // melhor volta pessoal
    }

    return "#46d7ffff"; // volta comum
  }

  static reset() {
    this.lastLapTime.clear();
    this.showLapTimeUntil.clear();
    this.cachedDrivers = [];
  }
}