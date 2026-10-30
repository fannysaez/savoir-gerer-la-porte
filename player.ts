import { Room } from "./room";

export class Player {
  inventory: string[]; // inventaire du joueur

  // crée un joueur avec un inventaire (vide par defaut)
  constructor(inventory: string[] = []) {
    this.inventory = inventory; // initialise l'inventaire du joueur
  }

  //Ramasse un objet présent dans la salle : l'ajoute à l'inventaire et la retire de la salle
  pickUp(item: string, room: Room): boolean {
    const itemIndex = room.items.indexOf(item); // position de l'objet dans la salle

    if (itemIndex === -1) {
      return false; // l'objet n'est pas dans la salle, rien à ramasser
    }

    room.items.splice(itemIndex, 1); //retire l'objet de la salle
    this.inventory.push(item); //ajoute l'objet à l'inventaire du joueur
    return true;
  }

  // Vérifie que le joueur possède l'objet avant de l'utiliser
  use(item: string): boolean {
    const itemIndex = this.inventory.indexOf(item); // position de l'objet dans l'inventaire

    if (itemIndex === -1) {
      return false; // le joueur ne possède pas l'objet, il ne peut pas l'utiliser
    }

    return true; // le joueur possède l'objet, il peut l'utiliser
  }

  // Retire un objet de l'inventaire s'il y est présent (utilisé par Door/Alarm pour consommer clés et codes)
  removeItem(item: string): boolean {
    const itemIndex = this.inventory.indexOf(item); // position de l'objet dans l'inventaire

    if (itemIndex === -1) {
      return false; // le joueur ne possède pas l'objet, rien à retirer
    }

    this.inventory.splice(itemIndex, 1); // retire l'objet de l'inventaire
    return true;
  }
}