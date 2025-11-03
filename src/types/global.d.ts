export {};

declare global {
  interface Window {
    GoogleAnalyticsObject?: string;
    ga?: {
      (...args: any[]): void;
      q?: any[];
      l?: number;
    };
  }

  /** Declara a função global ga() para evitar erro TS */
  function ga(...args: any[]): void;
}