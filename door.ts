import { Alarm } from "./alarm";
import { Player } from "./player";

export class Door {
  private isOpen: boolean; // indique si la porte est actuellement ouverte
  private requiredKey: string | null; // la clé nécessaire pour ouvrir la porte (null si aucune clé n'est requise)
  private riddleAnswer: string | null; // réponse correcte de l'énigme (null si aucune énigme)
  private riddleSolved: boolean; // indique si l'énigme a été résolue
  private failedAttempts: number; // nombre de tentatives échouées pour cette énigme
  private alarm: Alarm | null; // alarme éventuellement liée à cette porte (null si aucune)

  // créer une porte fermée par defaut, sauf indication contraire
  constructor(
    isOpen: boolean = false,
    requiredKey: string | null = null,
    riddleAnswer: string | null = null,
    alarm: Alarm | null = null,
  ) {
    this.isOpen = isOpen; // définit l'état initial de la porte
    this.requiredKey = requiredKey; // mémorise la clé nécessaire pour ouvrir la porte
    this.riddleAnswer = riddleAnswer; // mémorise la réponse correcte de l'énigme
    this.riddleSolved = false; // l'énigme n'est pas résolue par défaut
    this.failedAttempts = 0; // aucune tentative échouée au départ
    this.alarm = alarm; // mémorise l'alarme liée à cette porte
  }

  // Ouvre la porte si le joueur possède la clé requise (ou si aucune clé n'est nécessaire)
  // Si une clé est utilisée, elle est retirée de l'inventaire du joueur
  open(player: Player): boolean {
    if (this.requiredKey === null) {
      this.isOpen = true; // aucune clé requise, la porte s'ouvre directement
      return true;
    }

    const hasKey = player.removeItem(this.requiredKey); // vérifie et retire la clé en une seule étape

    if (!hasKey) {
      return false; // le joueur n'a pas la bonne clé, la porte reste fermée
    }

    this.isOpen = true;
    return true;
  }

  // renvoie le nombre de tentatives échouées pour cette énigme
  getFailedAttempts(): number {
    return this.failedAttempts;
  }

  // vérifie si la porte est franchie (ouverte, et énigme résolue si elle en a une, et alarme inactive si elle en a une)
  canBeCrossed(): boolean {
    if (!this.isOpen) {
      return false;
    }
    if (this.riddleAnswer !== null && !this.riddleSolved) {
      return false;
    }
    if (this.alarm !== null && this.alarm.isActive()) {
      return false; // une alarme liée et active bloque le passage
    }
    return true;
  }

  // Tente de résoudre l'énigme avec la réponse fournie par le joueur
  solveRiddle(answer: string): boolean {
    if (this.riddleSolved) {
      return false; // déjà résolue, ne peut pas l'être une seconde fois
    }
    if (this.failedAttempts >= 3) {
      return false; // trop de mauvaises réponses, l'énigme est verrouillée (conséquence)
    }
    if (answer !== this.riddleAnswer) {
      this.failedAttempts++; // une tentative échouée de plus
      return false; // mauvaise réponse, l'énigme reste non résolue
    }
    this.riddleSolved = true; // bonne réponse, l'énigme est résolue
    return true;
  }
}