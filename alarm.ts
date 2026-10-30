import { Player } from "./player";

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

  // Désactive l'alarme si le joueur possède le code attendu par cette alarme (le code est alors consommé)
  deactivate(player: Player): boolean {
    const hasCode = player.removeItem(this.code); // vérifie et retire le code en une seule étape

    if (!hasCode) {
      return false; // le joueur n'a pas le bon code, l'alarme reste active
    }

    this.active = false;
    return true;
  }
}