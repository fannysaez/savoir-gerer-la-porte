import { describe, expect, it } from "vitest";
import { Door } from "./door";
import { Alarm } from "./alarm";
import { Player } from "./player";

describe("Door", () => {
  it("ne peut pas être franchie lorsqu'elle est fermée", () => {
    const door = new Door();

    expect(door.canBeCrossed()).toBe(false);
  });

  it("peut être franchie lorsqu'elle est ouverte", () => {
    const door = new Door(true);

    expect(door.canBeCrossed()).toBe(true);
  });
});

describe("Door avec une clé", () => {
  it("peut être ouverte si le joueur possède la bonne clé", () => {
    const door = new Door(false, "red-key");
    const player = new Player(["red-key"]);

    const success = door.open(player);

    expect(success).toBe(true);
    expect(door.canBeCrossed()).toBe(true);
  });

  it("ne peut pas être ouverte si le joueur ne possède pas la bonne clé", () => {
    const door = new Door(false, "red-key");
    const player = new Player(["blue-key"]);

    const success = door.open(player);

    expect(success).toBe(false);
    expect(door.canBeCrossed()).toBe(false);
  });
});

describe("Door - retrait de la clé utilisée", () => {
  it("retire la clé de l'inventaire du joueur une fois la porte ouverte", () => {
    const door = new Door(false, "red-key");
    const player = new Player(["red-key", "torch"]);

    door.open(player);

    expect(door.canBeCrossed()).toBe(true);
    expect(player.inventory).not.toContain("red-key");
    expect(player.inventory).toContain("torch");
  });
});

describe("Door avec une énigme", () => {
  it("résout l'énigme avec la bonne réponse", () => {
    const door = new Door(true, null, "azur");
    const solved = door.solveRiddle("azur");

    expect(solved).toBe(true);
  });

  it("ne résout pas l'énigme avec une mauvaise réponse", () => {
    const door = new Door(true, null, "azur");
    const solved = door.solveRiddle("rouge");

    expect(solved).toBe(false);
  });

  it("ne peut pas être franchie si l'énigme n'est pas résolue", () => {
    const door = new Door(true, null, "azur");

    expect(door.canBeCrossed()).toBe(false);
  });

  it("peut être franchie si l'énigme est résolue", () => {
    const door = new Door(true, null, "azur");
    door.solveRiddle("azur");

    expect(door.canBeCrossed()).toBe(true);
  });
});

describe("Door - énigme avec tentatives", () => {
  it("incrémente le nombre de tentatives échouées après une mauvaise réponse", () => {
    const door = new Door(true, null, "azur");
    door.solveRiddle("rouge");

    expect(door.getFailedAttempts()).toBe(1);
  });

  it("n'est pas verrouillée après 2 mauvaises réponses, une bonne réponse résout l'énigme", () => {
    const door = new Door(true, null, "azur");
    door.solveRiddle("rouge");
    door.solveRiddle("vert");

    expect(door.getFailedAttempts()).toBe(2);

    const solved = door.solveRiddle("azur");

    expect(solved).toBe(true);
  });

  it("déclenche une conséquence après 3 mauvaises réponses : la bonne réponse ne fonctionne plus", () => {
    const door = new Door(true, null, "azur");
    door.solveRiddle("rouge");
    door.solveRiddle("vert");
    door.solveRiddle("jaune");

    expect(door.getFailedAttempts()).toBe(3);

    const solved = door.solveRiddle("azur");

    expect(solved).toBe(false);
  });

  it("ne peut pas résoudre une énigme déjà résolue une seconde fois", () => {
    const door = new Door(true, null, "azur");
    const firstSolve = door.solveRiddle("azur");

    expect(firstSolve).toBe(true);
    expect(door.canBeCrossed()).toBe(true);

    const secondSolve = door.solveRiddle("azur");

    expect(secondSolve).toBe(false);
  });
});

describe("Door avec une alarme", () => {
  it("ne peut pas être franchie si l'alarme liée est active", () => {
    const alarm = new Alarm();
    alarm.activate();
    const door = new Door(true, null, null, alarm);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("peut être franchie si l'alarme liée est inactive", () => {
    const alarm = new Alarm();
    const door = new Door(true, null, null, alarm);

    expect(door.canBeCrossed()).toBe(true);
  });

  it("reste franchissable si elle n'est liée à aucune alarme, même si une alarme existe et est active", () => {
    const alarm = new Alarm();
    alarm.activate();
    const door = new Door(true);

    expect(door.canBeCrossed()).toBe(true);
  });

  it("une porte bloquée redevient franchissable une fois l'alarme désactivée", () => {
    const alarm = new Alarm(true, "alarm-code");
    const door = new Door(true, null, null, alarm);
    const player = new Player(["alarm-code"]);

    alarm.deactivate(player);

    expect(door.canBeCrossed()).toBe(true);
  });
});

describe("Door du laboratoire - conditions combinées", () => {
  it("ne peut pas être franchie si aucune condition n'est remplie", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec uniquement la clé", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-key"]);
    door.open(player);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec uniquement l'énigme résolue", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    door.solveRiddle("labyrinthe");

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec uniquement l'alarme désactivée", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-code"]);
    alarm.deactivate(player);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec clé + énigme seulement", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-key"]);
    door.open(player);
    door.solveRiddle("labyrinthe");

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec clé + alarme désactivée seulement", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-key", "lab-code"]);
    door.open(player);
    alarm.deactivate(player);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("ne peut pas être franchie avec énigme + alarme désactivée seulement", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-code"]);
    door.solveRiddle("labyrinthe");
    alarm.deactivate(player);

    expect(door.canBeCrossed()).toBe(false);
  });

  it("peut être franchie quand les trois conditions sont réunies", () => {
    const alarm = new Alarm(true, "lab-code");
    const door = new Door(false, "lab-key", "labyrinthe", alarm);
    const player = new Player(["lab-key", "lab-code"]);
    door.open(player);
    door.solveRiddle("labyrinthe");
    alarm.deactivate(player);

    expect(door.canBeCrossed()).toBe(true);
  });
});