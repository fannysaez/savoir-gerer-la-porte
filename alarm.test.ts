import { describe, expect, it } from "vitest";
import { Alarm } from "./alarm";
import { Player } from "./player";

describe("Alarm", () => {
  it("est inactive par défaut", () => {
    const alarm = new Alarm();

    expect(alarm.isActive()).toBe(false);
  });

  it("peut être activé lors d'une action", () => {
    const alarm = new Alarm();
    alarm.activate();

    expect(alarm.isActive()).toBe(true);
  });
});

describe("Alarm - désactivation avec code", () => {
  it("se désactive si le joueur possède le bon code", () => {
    const alarm = new Alarm(true, "1234");
    const player = new Player(["1234"]);

    const success = alarm.deactivate(player);

    expect(success).toBe(true); // le joueur a le bon code, l'alarme se désactive
    expect(alarm.isActive()).toBe(false);
  });

  it("ne se désactive pas si le joueur n'a pas le bon code", () => {
    const alarm = new Alarm(true, "1234");
    const player = new Player(["0000"]); // mauvais code dans l'inventaire

    const success = alarm.deactivate(player);

    expect(success).toBe(false); // mauvais code, l'alarme reste active
    expect(alarm.isActive()).toBe(true);
  });

  it("permet d'avoir plusieurs alarmes avec des codes différents", () => {
    const alarmA = new Alarm(true, "1234");
    const alarmB = new Alarm(true, "5678");
    const player = new Player(["5678"]);

    expect(alarmA.deactivate(player)).toBe(false); // le code de B ne marche pas sur A
    expect(alarmA.isActive()).toBe(true);
    expect(alarmB.deactivate(player)).toBe(true); // le bon code pour B
  });
});

describe("Alarm - retrait du code de l'inventaire", () => {
  it("retire le code de l'inventaire du joueur une fois utilisé", () => {
    const alarm = new Alarm(true, "1234");
    const player = new Player(["1234", "torch"]);

    alarm.deactivate(player);

    expect(alarm.isActive()).toBe(false); // l'alarme est bien désactivée
    expect(player.inventory).not.toContain("1234"); // le code est consommé
    expect(player.inventory).toContain("torch"); // les autres objets sont conservés
  });
});