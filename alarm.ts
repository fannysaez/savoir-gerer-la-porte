export class Alarm {
  private active: boolean; // indique si l'alarme est actuellement active
  private code: string; // code propre à cette alarme, permet d'avoir plusieurs alarmes avec des codes différents

  // crée une alarme inactive par défaut, avec son propre code de désactivation
  constructor(active: boolean = false, code: string = "alarm-code") {
    this.active = active;
    this.code = code;
  }

  // active l'alarme
  activate(): void {
    this.active = true;
  }

  // indique si l'alarme est actuellement active
  isActive(): boolean {
    return this.active;
  }

  // Désactive l'alarme si le code fourni correspond au code attendu par cette alarme
  deactivate(code: string): boolean {
    if (code !== this.code) {
      return false; // mauvais code, l'alarme reste active
    }

    this.active = false;
    return true;
  }
}