import r3e from "./../lib/r3e";
import { FuelStrategy } from "./FuelStrategy";
import { EnergyEvents } from "./EnergyEvents";
import {
	showDebugMessage,
	showDebugMessageSmall,
} from './../lib/utils';

export class EnergyStrategy {
  private static battToEnd: number | null = null;
  private static veToEnd: number | null = null;
  private static veToAdd: number | null = null;
  private static veNow: number | null = null;
  private static veAvg: number | null = null;

  // -----------------------
  // API pública
  // -----------------------

  static get battToEndValue() {
    return this.battToEnd;
  }

  static get veToEndValue() {
    return this.veToEnd;
  }

  static get veToAddValue() {
    return this.veToAdd;
  }

  static get veNowValue() {
    return this.veNow;
  }

  static get veAvgValue() {
    return this.veAvg;
  }

  // -----------------------
  // Update
  // -----------------------

    static update() {
        // -----------------------
        // VE atual (%) — SEMPRE atualizado
        // -----------------------
        const veNowAbs = r3e.data.VirtualEnergyLeft;
        const veCap = r3e.data.VirtualEnergyCapacity;

        if (veNowAbs > 0 && veCap > 0) {
            const veNowPct = (veNowAbs / veCap) * 100;
            this.veNow = veNowPct > 0
            ? Math.round(veNowPct)
            : null;
        } else {
            this.veNow = null;
        }

        // -----------------------
        // Estratégia
        // -----------------------
        const roundsLeft = FuelStrategy.RoundsLeft;

        if (roundsLeft === null || roundsLeft < 0) {
            this.veToEnd = null;
            this.veToAdd = null;
            this.battToEnd = null;
            //showDebugMessageSmall(`${roundsLeft}`, 10000);
            return;
        }

        this.computeBattery(roundsLeft);
        this.computeVirtualEnergy(roundsLeft);
    }


  // -----------------------
  // Battery
  // -----------------------

  private static computeBattery(roundsLeft: number) {
    const avgBatt = EnergyEvents.avgBattPerLap;
    const battNow = r3e.data.BatterySoC;

    if (
      avgBatt === null ||
      avgBatt <= 0 ||
      battNow <= 0
    ) {
      this.battToEnd = null;
      return;
    }
  
    const needed = (avgBatt * roundsLeft) - battNow;
    this.battToEnd = battNow >= 0 ? needed : null;
  }

  // -----------------------
  // Virtual Energy
  // -----------------------

    private static computeVirtualEnergy(roundsLeft: number) {
        const avgVE = EnergyEvents.avgVEPerLap;
        const veNow = r3e.data.VirtualEnergyLeft;
        const veCap = r3e.data.VirtualEnergyCapacity;

        if (
            avgVE === null ||
            avgVE <= 0 ||
            veNow <= 0 ||
            veCap <= 0
        ) {
            this.veToEnd = null;
            this.veToAdd = null;
            this.veAvg = null;
            return;
        }

        // Energia absoluta necessária até o fim
        const veNeededAbs = avgVE * roundsLeft;

        // Conversão para %
        const veNowPct = (veNow / veCap) * 100;
        const veNeededPct = (veNeededAbs / veCap) * 100;
        const veToAddPct = veNeededPct - veNowPct;
        const veAvgPct = (avgVE / veCap) * 100;

        // Exporta sempre em %
        this.veToEnd = veNeededPct > 0
            ? Math.round(veNeededPct)
            : null;

        this.veToAdd = veToAddPct !== 0
            ? Math.round(veToAddPct)
            : null;

        this.veAvg = veAvgPct !== 0
            ? Math.round(veAvgPct)
            : null;
    }
}
