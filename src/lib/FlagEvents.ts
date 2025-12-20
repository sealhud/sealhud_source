// FlagEvents.ts
// Nível 1 — leitura de flags (API usada pelos widgets)
// Nível 2 — modo simples: detecta causador na Yellow se velocidade < 30 km/h

import r3e from "./../lib/r3e";
import { IFlags, IDriverData } from "./../types/r3eTypes";
import { showDebugMessageSmall } from './../lib/utils';

export class FlagEvents {
    // -----------------------
    // Estado / Nível 1
    // -----------------------
    private static currentFlags: IFlags | null = null;
    private static lastUpdateTs = 0;

    // -----------------------
    // Nível 2 (simples)
    // -----------------------
    private static yellowActive = false;
    private static causerSlots = new Map<number, number>();
    

    // Config
    private static HIGHLIGHT_DURATION = 8000; // ms
    private static SPEED_THRESHOLD_REMOVE = 21; // 20 m/s -> remover quando acima

    // -----------------------
    // update chamado pelo loop principal
    // -----------------------
    static update(drivers: IDriverData[]) {
        const flags = r3e.data.Flags;
        if (!flags) return;

        const now = performance.now();
        this.currentFlags = flags;
        this.lastUpdateTs = now;

        // NÍVEL 2: detectar início/fim da yellow
        if (!this.yellowActive && flags.Yellow === 1) {
            this.yellowActive = true;
            this.causerSlots.clear();
        }
        if (this.yellowActive && flags.Yellow !== 1) {
            this.yellowActive = false;
            this.causerSlots.clear();
            return;
        }
        if (!this.yellowActive) {
            // nada a fazer no nível 2
            return;
        }
        // Yellow está ativa -> rodar heurística simples (nivel 2)
        if (this.yellowActive) {
            this.detectSimple(drivers);
            this.pruneSlots(drivers, now);
        }
    }
    // -----------------------
    // Heurística ultra-simples (Nível 2)
    // Critérios:
    // - Yellow ativa
    // - Não está no pit
    // - Não terminou a corrida
    // - Velocidade < Threshold progressivo [4, 8, 12, 16, 20] (metros por segundo)
    // Seleciona o primeiro que satisfaz e faz highlight por HIGHLIGHT_DURATION
    // -----------------------
    private static detectSimple(drivers: IDriverData[]) {
        const now = performance.now();

        // thresholds progressivos (em m/s)
        const thresholds = [4, 8, 12, 16, 20]; 

        for (const T of thresholds) {
            // coleta todos os drivers <= T
            const slowDrivers: { slot: number, speed: number }[] = [];
            for (const d of drivers) {
                const slot = d.DriverInfo?.SlotId;
                if (slot == null) continue;
                // ignorar quem está no box
                if (d.InPitlane > 0) continue;
                // ignorar quem terminou
                if (d.FinishStatus > 0) continue;
                const speed = d.CarSpeed ?? 0;
                if (speed <= T) {
                    slowDrivers.push({ slot, speed });
                }
            }

            // se achou algum grupo <= T, marcar todos e parar
            if (slowDrivers.length > 0) {
                for (const drv of slowDrivers) {
                    this.causerSlots.set(drv.slot, now + this.HIGHLIGHT_DURATION);
                }

                // debug:
                // showDebugMessageSmall(`Yellow: Found ${slowDrivers.length} drivers <= ${T} m/s`);
                return; // PARA A BUSCA — prioridade sempre vai ao menor threshold possível
            }
        }
    }

    // Remove o highlight quando o driver não cumpre mais requisito para Yellow
    private static pruneSlots(drivers: IDriverData[], now: number) {
        if (this.causerSlots.size === 0) return;

        // montar um map slot -> driver para acesso rápido
        const drvBySlot = new Map<number, IDriverData>();
        for (const d of drivers) {
            const s = d.DriverInfo?.SlotId;
            if (s != null) drvBySlot.set(s, d);
        }

        for (const [slot, expiry] of Array.from(this.causerSlots.entries())) {
            // remover por expiry
            if (now > expiry) {
                this.causerSlots.delete(slot);
                continue;
            }

            const driver = drvBySlot.get(slot);
            if (!driver) continue;

            // remover se entrou no pit ou terminou (ou outro critério)
            if (driver.InPitlane > 0 || driver.FinishStatus > 0) {
                this.causerSlots.delete(slot);
                continue;
            }

            // remover se recuperou velocidade acima do limite de remoção
            const speed = driver.CarSpeed ?? 0;
            if (speed >= this.SPEED_THRESHOLD_REMOVE) {
                // caso queira um pequeno debounce, poderia exigir N frames; aqui remoção imediata
                this.causerSlots.delete(slot);
                continue;
            }
        }
    }

    // -----------------------
    // APIs PÚBLICAS (NÍVEL 1) — consumo pelos widgets
    // -----------------------
    static getFlags(): IFlags | null {
        return this.currentFlags;
    }

    static isYellow(): boolean {
        return this.currentFlags?.Yellow === 1;
    }

    static yellowCausedIt(): boolean {
        return this.currentFlags?.YellowCausedIt === 1;
    }

    static isSectorYellow(sector: 1 | 2 | 3): boolean {
        if (!this.currentFlags) return false;
        const sy = this.currentFlags.SectorYellow;
        if (sector === 1) return sy.Sector1 === 1;
        if (sector === 2) return sy.Sector2 === 1;
        return sy.Sector3 === 1;
    }

    static isBlue(): boolean {
        return this.currentFlags?.Blue === 1;
    }
    static isGreen(): boolean {
        return this.currentFlags?.Green === 1;
    }
    static isBlack(): boolean {
        return this.currentFlags?.Black === 1;
    }
    static isCheckered(): boolean {
        return this.currentFlags?.Checkered === 1;
    }
    static whiteReason(): number {
        return this.currentFlags?.White ?? -1;
    }
    static blackAndWhiteReason(): number {
        return this.currentFlags?.BlackAndWhite ?? -1;
    }

    // -----------------------
    // NÍVEL 2 — consulta de highlight / causador
    // -----------------------
    static shouldHighlight(slot: number): boolean {
        if (!this.yellowActive) return false;
        const expiry = this.causerSlots.get(slot);
        if (!expiry) return false;
        return performance.now() <= expiry;
    }

    static getCausers(): number[] {
        return Array.from(this.causerSlots.keys());
    }

    // -----------------------
    // Reset/utility
    // -----------------------
    static reset() {
        this.currentFlags = null;
        this.lastUpdateTs = 0;
        this.yellowActive = false;
        this.causerSlots.clear();
    }

    static getLastUpdateTime(): number {
        return this.lastUpdateTs;
    }
}