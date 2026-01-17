import r3e from "./../lib/r3e";
import { FuelEvents } from "./FuelEvents";
import {
	showDebugMessage,
	showDebugMessageSmall,
} from './../lib/utils';

export class FuelStrategy {
  // -----------------------
  // Estado calculado
  // -----------------------

  private static fuelToEnd: number | null = null;
  private static fuelToAdd: number | null = null;
  private static roundsLeft: number | null = null;
  private static lap0Started = false;

  // -----------------------
  // API pública (getters)
  // -----------------------

  static get FuelToEnd() {
    return this.fuelToEnd;
  }

  static get FuelToAdd() {
    return this.fuelToAdd;
  }

  static get RoundsLeft() {
    return this.roundsLeft;
  }

  // -----------------------
  // Update principal
  // -----------------------

  static update() {
    const perLap = FuelEvents.avgFuelPerLap;
    
    if (!perLap || perLap <= 0) {
      this.reset();
      return;
    }

    const secsRemain = r3e.data.SessionTimeRemaining;
    let fastestLapLeader = r3e.data.LapTimeBestLeader;

    let fastestLap =
      FuelEvents.avgLapTimeSec ??
      FuelEvents.bestLapTimeSec ??
      (r3e.data.LapTimeBestSelf > 0
        ? r3e.data.LapTimeBestSelf
        : null);

    if (!fastestLap || fastestLap <= 0) {
      this.reset();
      return;
    }

    if (fastestLapLeader <= 0) {
      fastestLapLeader = fastestLap;
    }

    let roundsLeft = 0;
    let roundsLeftFloat = 0.0;

    let leader = 999;
    let leaderLaps = -1;

    const playerLaps = r3e.data.CompletedLaps;
    const playerPercent = r3e.data.LapDistanceFraction;
    // start_modif: modificador que verifica se está no início da corrida
    // para evitar saltos no cálculo de combustivel 
    // Detecta início REAL da volta 0 (apenas uma vez)
    if (r3e.data.SessionPhase <= 2) { // antes de iniciar a corrida
      this.lap0Started = false;
    }
    if (!this.lap0Started && playerLaps === 0 && playerPercent === 0.00) {
      this.lap0Started = true;
    }
    const start_modif = !this.lap0Started && playerLaps === 0
      ? 0 
      : playerPercent;
    
    let leaderPercent = 0;
    let timeLeft = 0;

    // -----------------------
    // Sessão por voltas
    // -----------------------

    if (r3e.data.SessionLengthFormat === 1) {
      let maxLaps = 0;

      const myDist = r3e.data.LapDistance;

      r3e.data.DriverData.forEach((driver) => {
        const driverDist = driver.LapDistance;
        let lap_modif = 0;        
        lap_modif = myDist > driverDist 
          ? 0 
          : 1;

        const laps = driver.CompletedLaps + lap_modif;

        if (laps > maxLaps) {
          maxLaps = laps;
        }
      });

      roundsLeft =
        r3e.data.SessionPhase === 6
          ? 0
          : r3e.data.NumberOfLaps - maxLaps;

      roundsLeftFloat = roundsLeft + (1 - start_modif);

    // -----------------------
    // Sessão por tempo
    // -----------------------

    } else if (r3e.data.SessionType !== -1) {
      // Practice / Qualy
      if (r3e.data.SessionType < 2) {
        roundsLeft =
          r3e.data.SessionPhase === 6
            ? 0
            : Math.floor(secsRemain / fastestLap);

        roundsLeftFloat = roundsLeft + (1 - playerPercent);

      // Race
      } else if (r3e.data.SessionType === 2) {
        if (r3e.data.SessionPhase === 6) {
          roundsLeft = 0;
          roundsLeftFloat = roundsLeft + (1 - start_modif);
        } else {
          r3e.data.DriverData.forEach((driver) => {
            if (driver.Place != null && driver.Place < leader) {
              leader = driver.Place;
              leaderLaps = driver.CompletedLaps;
              leaderPercent =
                driver.LapDistance / r3e.data.LayoutLength;
            }
          });

          roundsLeft = Math.floor(secsRemain / fastestLap);
          timeLeft = secsRemain - fastestLap * roundsLeft;

          if (
            start_modif !== 0 &&
            leaderLaps > playerLaps &&
            leaderPercent < playerPercent
          ) {
            roundsLeft++;
          }

          if (
            start_modif !== 0 &&
            timeLeft >
            fastestLapLeader * (1 - leaderPercent)
          ) {
            roundsLeft++;
          }
          roundsLeftFloat = roundsLeft + (1 - start_modif );
        }
      }
    }

    const fuelToEnd = perLap * roundsLeftFloat;
    const fuelToAdd =
      fuelToEnd >= 0 ? fuelToEnd - r3e.data.FuelLeft : 0;

    this.fuelToEnd = fuelToEnd > 0 ? fuelToEnd : null;
    this.fuelToAdd = fuelToAdd !== 0 ? fuelToAdd : null;
    this.roundsLeft = roundsLeftFloat;
  }

  // -----------------------
  // Utils
  // -----------------------

  private static reset() {
    this.fuelToEnd = null;
    this.fuelToAdd = null;
    this.roundsLeft = null;
  }
}
