// EnergyEvents.ts
import r3e from "./../lib/r3e";

interface EnergyPersistedData {
  // Bateria (SoC %)
  avgBattPerLap?: number;
  samplesBatt: number;

  // Energia Virtual
  avgVEPerLap?: number;
  samplesVE: number;
}

export class EnergyEvents {
  // -----------------------
  // Estado interno
  // -----------------------

  private static persistKey: string | null = null;
  private static persisted: EnergyPersistedData | null = null;

  // Estado da volta atual
  private static lapStartBatt = -1;
  private static lapStartVE = -1;
  private static lapPassedMid = false;
  private static lapInvalid = false;

  // Runtime
  private static lastLapBatt: number | null = null;
  private static lastLapVE: number | null = null;

  // -----------------------
  // API pública (getters)
  // -----------------------

  static get avgBattPerLap() {
    return this.persisted?.avgBattPerLap ?? null;
  }

  static get lastLapBattUsed() {
    return this.lastLapBatt;
  }

  static get avgVEPerLap() {
    return this.persisted?.avgVEPerLap ?? null;
  }

  static get lastLapVEUsed() {
    return this.lastLapVE;
  }

  static get samplesBatt() {
    return this.persisted?.samplesBatt ?? 0;
  }

  static get samplesVE() {
    return this.persisted?.samplesVE ?? 0;
  }

  // -----------------------
  // Update principal
  // -----------------------

  static update() {
    const battActive = r3e.data.BatterySoC > 0;
    const veActive = r3e.data.VirtualEnergyCapacity > 0;

    // Nenhuma fonte ativa → não mede nada
    if (!battActive && !veActive) return;

    this.ensurePersistence();

    // -----------------------
    // Invalidação forte da volta em curso
    // -----------------------
    if (
      !this.lapInvalid &&
      (
        r3e.data.GamePaused > 0 ||
        r3e.data.GameInMenus > 0 ||
        r3e.data.InPitlane > 0 ||
        r3e.data.CompletedLaps === 0 ||
        r3e.data.CurrentLapValid <= 0
      )
    ) {
      this.lapInvalid = true;
    }

    this.detectLap(battActive, veActive);
  }

  // -----------------------
  // Persistência
  // -----------------------

  private static ensurePersistence() {
    const key = this.buildPersistKey();
    if (this.persistKey === key) return;

    this.persistKey = key;
    this.persisted = this.loadPersisted(key);

    // Reset total de estado de volta
    this.lapStartBatt = -1;
    this.lapStartVE = -1;
    this.lapPassedMid = false;
    this.lapInvalid = false;
    this.lastLapBatt = null;
    this.lastLapVE = null;
  }

  private static buildPersistKey(): string {
    return [
      r3e.data.TrackId,
      r3e.data.LayoutId,
      r3e.data.VehicleInfo?.ModelId,
    ].join("_");
  }

  private static loadPersisted(key: string): EnergyPersistedData {
    try {
      const raw = localStorage.getItem(`energy-${key}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      samplesBatt: 0,
      samplesVE: 0,
    };
  }

  private static savePersisted() {
    if (!this.persistKey || !this.persisted) return;
    localStorage.setItem(
      `energy-${this.persistKey}`,
      JSON.stringify(this.persisted)
    );
  }

  // -----------------------
  // Detecção de volta limpa
  // -----------------------

  private static detectLap(battActive: boolean, veActive: boolean) {
    const frac = r3e.data.LapDistanceFraction;

    // Início de volta monitorada
    if (
      !this.lapPassedMid &&
      frac < 0.05 &&
      r3e.data.LapTimeCurrentSelf >= 0 &&
      this.lapStartBatt < 0 &&
      this.lapStartVE < 0
    ) {
      if (battActive) {
        this.lapStartBatt = r3e.data.BatterySoC;
      }
      if (veActive) {
        this.lapStartVE = r3e.data.VirtualEnergyLeft;
      }
      this.lapPassedMid = false;
      this.lapInvalid = false;
      return;
    }

    // Confirma que percorreu a pista
    if (!this.lapPassedMid && frac > 0.5) {
      this.lapPassedMid = true;
      return;
    }

    // Fechamento da volta
    if (
      this.lapPassedMid &&
      frac < 0.05
    ) {
      this.closeLap(battActive, veActive);
    }
  }

  // -----------------------
  // Fechamento da volta
  // -----------------------

  private static closeLap(battActive: boolean, veActive: boolean) {
    // -----------------------
    // Bateria
    // -----------------------
    if (
      battActive &&
      this.lapStartBatt >= 0
    ) {
      const battNow = r3e.data.BatterySoC;
      const battUsed = this.lapStartBatt - battNow;

      if (!this.lapInvalid && battUsed > 0) {
        this.lastLapBatt = battUsed;
        this.updateBattAvg(battUsed);
      }
    }

    // -----------------------
    // Energia Virtual
    // -----------------------
    if (
      veActive &&
      this.lapStartVE >= 0
    ) {
      const veNow = r3e.data.VirtualEnergyLeft;
      const veUsed = this.lapStartVE - veNow;

      if (!this.lapInvalid && veUsed > 0) {
        this.lastLapVE = veUsed;
        this.updateVEAvg(veUsed);
      }
    }

    // Reset SEMPRE
    this.lapStartBatt = -1;
    this.lapStartVE = -1;
    this.lapPassedMid = false;
    this.lapInvalid = false;
  }

  // -----------------------
  // Persistências
  // -----------------------

  private static updateBattAvg(used: number) {
    if (!this.persisted) return;

    this.persisted.avgBattPerLap =
      this.persisted.avgBattPerLap === undefined
        ? used
        : this.persisted.avgBattPerLap * 0.7 + used * 0.3;

    this.persisted.samplesBatt++;
    this.savePersisted();
  }

  private static updateVEAvg(used: number) {
    if (!this.persisted) return;

    this.persisted.avgVEPerLap =
      this.persisted.avgVEPerLap === undefined
        ? used
        : this.persisted.avgVEPerLap * 0.7 + used * 0.3;

    this.persisted.samplesVE++;
    this.savePersisted();
  }

  static clearCurrentPersisted() {
    if (!this.persistKey) return;

    localStorage.removeItem(`energy-${this.persistKey}`);

    // reset em memória
    this.persisted = { samplesBatt: 0, samplesVE: 0 };
    this.lastLapBatt = null;
    this.lastLapVE = null;
  }

  static clearAllPersisted() {
    Object.keys(localStorage)
      .filter(k => k.startsWith("energy-"))
      .forEach(k => localStorage.removeItem(k));

    // reset total
    this.persistKey = null;
    this.persisted = null;
    this.lastLapBatt = null;
    this.lastLapVE = null;
  }

}
