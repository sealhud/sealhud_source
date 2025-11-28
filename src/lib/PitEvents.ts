// PitEvents.ts — Sistema moderno de detecção e estado de Pit no SealHud

import r3e from "./../lib/r3e";
import { IDriverData } from "./../types/r3eTypes";

// Cada piloto terá um registro completo de estado do pit:
interface PitState {
  inPitlane: boolean;        // está no pitlane
  stoppedOnSpot: boolean;    // está parado no box
  leftSpot: boolean;         // saiu do box e está indo embora
  exitedPitlane: boolean;    // terminou pitlane (exit)
  pitCount: number;          // número de paradas (count oficial)
  timeEnterPitlane: number | null; // timestamp de entrada
  timeStopOnSpot: number | null;   // timestamp parou
  timeLeaveSpot: number | null;    // timestamp saiu do box
  timeExitPitlane: number | null;  // timestamp saída do pitlane
  laneDuration: number | null;     // timeExit - timeEnter
  spotDuration: number | null;     // timeLeaveSpot - timeStop
  pitTotalDuration: number | null; // timeExit - timeEnter
  highlightUntil: number | null;   // para transições (idem LapEvents)
}

export class PitEvents {
  private static states = new Map<number, PitState>();
  private static HIGHLIGHT_DURATION = 8000; // 8s para exibir a informação pós-exit

  // ==========================================================
  // Atualização a cada frame
  // ==========================================================
  static update(drivers: IDriverData[]) {
    const now = performance.now();

    for (const d of drivers) {
      const id = d.DriverInfo.SlotId;
      if (id == null) continue;

      // Estado atual vindo do jogo:
      const inPitlane = d.InPitlane > 0;
      const speed = d.CarSpeed;

      let st = this.states.get(id);
      if (!st) {
        st = {
          inPitlane: false,
          stoppedOnSpot: false,
          leftSpot: false,
          exitedPitlane: false,

          pitCount: 0,

          timeEnterPitlane: null,
          timeStopOnSpot: null,
          timeLeaveSpot: null,
          timeExitPitlane: null,

          laneDuration: null,
          spotDuration: null,
          pitTotalDuration: null,

          highlightUntil: null,
        };
      }

      // =============================
      // 1. Entrou no PIT LANE
      // =============================
      if (inPitlane && !st.inPitlane && d.FinishStatus === 0) {
        st.inPitlane = true;
        st.timeEnterPitlane = now;
        st.exitedPitlane = false;
        st.leftSpot = false;
        st.timeExitPitlane = null;
        st.timeLeaveSpot = null;
        // não incrementa pitCount ainda — só quando terminar exit
      }

      // =============================
      // 2. Parou no BOX (spot)
      // =============================
      if (
        st.inPitlane &&
        !st.stoppedOnSpot &&
        speed <= 0.1 &&
        d.FinishStatus === 0
      ) {
        st.stoppedOnSpot = true;
        st.timeStopOnSpot = now;
      }

      // =============================
      // 3. Começou a sair do BOX
      // =============================
      if (
        st.stoppedOnSpot &&
        !st.leftSpot &&
        speed > 1 &&
        d.FinishStatus === 0
      ) {
        st.leftSpot = true;
        st.timeLeaveSpot = now;

        // spotDuration = (leave - stop)
        st.spotDuration =
          st.timeStopOnSpot && st.timeLeaveSpot
            ? (st.timeLeaveSpot - st.timeStopOnSpot) / 1000
            : null;
      }

      // =============================
      // 4. Saiu do PIT LANE
      // =============================
      if (
        st.inPitlane &&
        !inPitlane &&
        !st.exitedPitlane
      ) {
        st.inPitlane = false;
        st.exitedPitlane = true;
        st.timeExitPitlane = now;

        // laneDuration e pitTotalDuration:
        if (st.timeEnterPitlane) {
          st.laneDuration = (now - st.timeEnterPitlane) / 1000;
          st.pitTotalDuration = st.laneDuration; // total = laneDuration
        }

        // incrementa pitCount:
        st.pitCount++;

        // popup de pit exit → aparece por 8s
        st.highlightUntil = now + this.HIGHLIGHT_DURATION;
      }

      this.states.set(id, st);
    }
  }

  // ==========================================================
  // Métodos de consulta
  // ==========================================================

  static isInPitlane(id: number): boolean {
    return this.states.get(id)?.inPitlane ?? false;
  }

  static isStoppedOnSpot(id: number): boolean {
    return this.states.get(id)?.stoppedOnSpot ?? false;
  }

  static hasExited(id: number): boolean {
    return this.states.get(id)?.exitedPitlane ?? false;
  }

  static shouldHighlight(id: number): boolean {
    const st = this.states.get(id);
    return st?.highlightUntil ? performance.now() < st.highlightUntil : false;
  }

  static getPitCount(id: number): number {
    return this.states.get(id)?.pitCount ?? 0;
  }

  static getPitLaneTime(id: number): number | null {
    return this.states.get(id)?.laneDuration ?? null;
  }

  static getSpotTime(id: number): number | null {
    return this.states.get(id)?.spotDuration ?? null;
  }

  static getPitTotalTime(id: number): number | null {
    return this.states.get(id)?.pitTotalDuration ?? null;
  }

  static getState(id: number): PitState | undefined {
    return this.states.get(id);
  }

  static reset() {
    this.states.clear();
  }
}