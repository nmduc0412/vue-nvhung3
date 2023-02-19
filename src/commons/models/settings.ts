// Thông tin thiết lập
export class Settings {
    consoleTheme: string;
    landingTheme: string = "Default";
    currency: string;
    constructor(
      consoleTheme: string = "Default",
      landingTheme: string = "Default",
      currency: string = ""
    ) {
      this.consoleTheme = consoleTheme;
      this.landingTheme = landingTheme;
      this.currency = currency;
    }
  }