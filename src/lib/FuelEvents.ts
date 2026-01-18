import r3e from "./../lib/r3e";
import {
	showDebugMessage,
	showDebugMessageSmall,
} from './../lib/utils';

interface FuelPersistedData {
  avgFuelPerLap1x?: number;
  avgLapSec?: number;
  bestLapSec?: number;
  avgSpeedMs?: number; // metros/segundo
  samples: number;
}

export class FuelEvents {
  // -----------------------
  // Estado interno
  // -----------------------

  private static persistKey: string | null = null;
  private static persisted: FuelPersistedData | null = null;
  private static pendingLapStats = false;
  private static pendingLapTries = 0;
  private static lastProcessedLapTime = -1;

  // Estado da volta atual
  private static lapStartFuel = -1;
  //private static lapStartFraction = -1;
  private static lapPassedMid = false;
  private static lapInvalid = false;

  // Última volta válida (runtime)
  private static lastLapFuel: number | null = null;

  // -----------------------
  // API pública (getters)
  // -----------------------

  static get avgFuelPerLap() {
    if (!this.persisted?.avgFuelPerLap1x) return r3e.data.FuelPerLap;
    return this.persisted.avgFuelPerLap1x * this.getFuelMultiplier();
  }

  static get avgLapTimeSec() {
    return this.persisted?.avgLapSec ?? null;
  }

  static get bestLapTimeSec() {
    return this.persisted?.bestLapSec ?? null;
  }

  static get avgSpeedMs() {
    return this.persisted?.avgSpeedMs ?? null;
  }

  static get lastLapFuelUsed() {
    return this.lastLapFuel;
  }

  static get samples() {
    return this.persisted?.samples ?? 0;
  }
  

  // -----------------------
  // Update principal
  // -----------------------

  static update() {
    // Se Fuel desativado → não mede nada
    if (r3e.data.FuelUseActive <= 0) return;

    this.ensurePersistence();

    // Invalida a volta em curso se algo forte acontecer
    if (
      !this.lapInvalid &&
      (
        r3e.data.GamePaused > 0 ||
        r3e.data.GameInMenus > 0 ||
        r3e.data.InPitlane > 0 ||
        r3e.data.CompletedLaps === 0 ||
        r3e.data.CurrentLapValid <= 0 ||
        r3e.data.FuelUseActive <= 0
      )
    ) {
      this.lapInvalid = true;
      this.lastProcessedLapTime = -1;
    }
    this.detectLap();
    this.tryUpdateLapStats();
  }
  

  // -----------------------
  // Persistência
  // -----------------------

  private static ensurePersistence() {
    const key = this.buildPersistKey();
    if (this.persistKey === key) return;

    this.persistKey = key;
    this.persisted = this.loadPersisted(key);

    // Reset TOTAL de estado de volta
    this.lapStartFuel = -1;
    //this.lapStartFraction = -1;
    this.lapPassedMid = false;
    this.lapInvalid = false;
    this.lastLapFuel = null;
  }

  private static buildPersistKey(): string {
    return [
      r3e.data.TrackId,
      r3e.data.LayoutId,
      r3e.data.VehicleInfo?.ModelId,
    ].join("_");
  }

  private static loadPersisted(key: string): FuelPersistedData {
    try {
      const raw = localStorage.getItem(`fuel-${key}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { samples: 0 };
  }

  private static savePersisted() {
    if (!this.persistKey || !this.persisted) return;
    localStorage.setItem(
      `fuel-${this.persistKey}`,
      JSON.stringify(this.persisted)
    );
  }

  static clearCurrentPersisted() {
    if (!this.persistKey) return;
    localStorage.removeItem(`fuel-${this.persistKey}`);
    // Reseta persistência
    this.persisted = { samples: 0 };
    // Reseta estado de volta / runtime
    this.lapStartFuel = -1;
    this.lapPassedMid = false;
    this.lapInvalid = false;
    this.lastLapFuel = null;
  }

  static clearAllPersisted() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("fuel-"))
      .forEach((k) => localStorage.removeItem(k));
    // Reseta tudo em memória
    this.persistKey = null;
    this.persisted = null;
    this.lapStartFuel = -1;
    this.lapPassedMid = false;
    this.lapInvalid = false;
    this.lastLapFuel = null;
  }

  // -----------------------
  // Detecção de volta limpa
  // -----------------------

  private static detectLap() {
    const frac = r3e.data.LapDistanceFraction;
    const fuel = r3e.data.FuelLeft;

    // Início de volta
    if (
      this.lapStartFuel < 0 &&
      frac < 0.05 &&
      r3e.data.LapTimeCurrentSelf >= 0
    ) {
      this.lapStartFuel = fuel;
      //this.lapStartFraction = frac;
      this.lapPassedMid = false;
      this.lapInvalid = false;
      return;
    }

    // Confirma que percorreu a pista
    if (
      this.lapStartFuel >= 0 &&
      !this.lapPassedMid &&
      frac > 0.5
    ) {
      this.lapPassedMid = true;
      return;
    }
    // Fechamento da volta
    if (
      this.lapStartFuel >= 0 &&
      frac < 0.05 &&
      this.lapPassedMid
    ) {
      this.closeLap();
    }
  }

  private static closeLap() {
    const fuelNow = r3e.data.FuelLeft;
    const used = this.lapStartFuel - fuelNow;

    const valid =
      !this.lapInvalid &&
      used >= 0 &&
      used <= r3e.data.FuelCapacity;

    if (valid) {
      const mult = this.getFuelMultiplier();
      const used1x = used / mult;
      this.lastLapFuel = used;
      this.updateFuelAvg(used1x);
      this.pendingLapStats = true;
      this.pendingLapTries = 0;
    }

    // Reset SEMPRE
    this.lapStartFuel = fuelNow;
    this.lapPassedMid = false;
    this.lapInvalid = false;
  }

  // -----------------------
  // Atualizações persistidas
  // -----------------------

  private static updateFuelAvg(used1x: number) {
    if (!this.persisted) return;

    this.persisted.avgFuelPerLap1x =
      this.persisted.avgFuelPerLap1x === undefined
        ? used1x
        : this.persisted.avgFuelPerLap1x * 0.7 + used1x * 0.3;

    this.persisted.samples++;
    this.savePersisted();
  }

  private static tryUpdateLapStats() {
    if (!this.pendingLapStats || !this.persisted) return;

    const lapSec = r3e.data.LapTimePreviousSelf;

    // Ainda não chegou ou é repetido
    if (
      lapSec <= 0 ||
      lapSec === this.lastProcessedLapTime
    ) {
      this.pendingLapTries++;
      if (this.pendingLapTries > 10) {
        this.pendingLapStats = false;
      }
      return;
    }

    // Agora temos o tempo NOVO da volta recém-fechada

    const len = r3e.data.LayoutLength;
    if (
      this.persisted.bestLapSec === undefined ||
      lapSec < this.persisted.bestLapSec
    ) {
      this.persisted.bestLapSec = lapSec;
    }

    this.persisted.avgLapSec =
      this.persisted.avgLapSec === undefined
        ? lapSec
        : this.persisted.avgLapSec * 0.8 + lapSec * 0.2;

    if (len > 0) {
      const speedMs = len / lapSec;
      this.persisted.avgSpeedMs =
        this.persisted.avgSpeedMs === undefined
          ? speedMs
          : this.persisted.avgSpeedMs * 0.8 + speedMs * 0.2;
    }

    this.savePersisted();

    // Finaliza
    this.pendingLapStats = false;
    this.lastProcessedLapTime = lapSec;
    this.pendingLapStats = false;
  }


  // -----------------------
  // Utils
  // -----------------------

  private static getFuelMultiplier(): number {
    const f = r3e.data.FuelUseActive;
    return f > 1 ? f : 1;
  }
}