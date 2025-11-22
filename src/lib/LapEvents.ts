// LapEvents.ts
// Sistema de detecção de volta + popup colorido seguro para RaceRoom

import { 
    formatTime,
    showDebugMessageSmall
} from "./utils";
import r3e from "./../lib/r3e";
import {
    IDriverData    
} from "./../types/r3eTypes";

export class LapEvents {
    private static lastLapTime = new Map<number, number>();
    private static showLapTimeUntil = new Map<number, number>();
    private static lapColors = new Map<number, string>();
    private static LAPTIME_DURATION = 8000; // ms

    static update(drivers: IDriverData[]) {
        const now = performance.now();

        // Melhor volta global da sessão
        const sessionBest = r3e.data.SectorTimesSessionBestLap.Sector3 ?? -1;

        // ====== construir best lap por classe ======
        const bestLapByClass = new Map<number, number>();
        for (const d of drivers) {
            const classId = d.DriverInfo.ClassPerformanceIndex;
            const bestSelf = d.SectorTimeBestSelf.Sector3;
            if (bestSelf > 0) {
                if (!bestLapByClass.has(classId) || bestSelf < bestLapByClass.get(classId)!) {
                    bestLapByClass.set(classId, bestSelf);
                }
            }
        }
        // ============================================
        for (const d of drivers) {
            const slot = d.DriverInfo.SlotId;
            if (slot == null) continue;

            const prevLap = this.lastLapTime.get(slot) ?? -1;
            const lapTime = d.SectorTimePreviousSelf.Sector3;

            // Detecta volta válida e nova
            if (lapTime > 0 && lapTime !== prevLap) {

                // best pessoal fornecido pelo RaceRoom
                const personalBest = d.SectorTimeBestSelf.Sector3;

                const classId = d.DriverInfo.ClassPerformanceIndex;
                const classBest = bestLapByClass.get(classId) ?? -1;

                // Escolher cor
                let color = "#0bacd8ff"; // cor default

                // PRIORIDADE 1 — Melhor volta da sessão
                if (sessionBest > 0 && lapTime === sessionBest) {
                    color = "#8718c7ff"; 
                }
                // PRIORIDADE 2 — Melhor volta da classe
                else if (classBest > 0 && lapTime === classBest) {
                    color = "#ba7edfff"; 
                }
                // PRIORIDADE 3 — Melhor volta pessoal
                else if (personalBest > 0 && lapTime <= personalBest) {
                    color = "#00CC66";
                }

                // Armazena popup
                this.lastLapTime.set(slot, lapTime);
                this.lapColors.set(slot, color);
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

        return t > 60
            ? formatTime(t, "m:ss.SSS")
            : formatTime(t, "s.SSS");
    }

    static getLapTimeColor(slot: number): string {
        return this.lapColors.get(slot) ?? "#0bacd8ff";
    }

    static reset() {
        this.lastLapTime.clear();
        this.showLapTimeUntil.clear();
        this.lapColors.clear();
    }
}