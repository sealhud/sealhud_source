declare module 'speed-date' {
  interface SpeedDateFunction {
    (format?: string, date?: Date, utc?: boolean): string;

    UTC: {
      (format?: string, date?: Date): string;
      cached(format: string, date?: Date): string;
    };

    cached(format: string, date?: Date): string;
  }

  const speedDate: SpeedDateFunction;
  export = speedDate;
}