import { describe, expect, it } from "vitest";
import { Alarm } from "./alarm";

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
  it("se désactive avec le bon code", () => {
    const alarm = new Alarm(true, "1234");

    const success = alarm.deactivate("1234");

    expect(success).toBe(true); // le code est bon, l'alarme se désactive
    expect(alarm.isActive()).toBe(false);
  });

  it("ne se désactive pas avec un mauvais code", () => {
    const alarm = new Alarm(true, "1234"); // alarme avec un vrai code défini

    const success = alarm.deactivate("0000"); // mauvais code fourni

    expect(success).toBe(false); // mauvais code, l'alarme reste active
    expect(alarm.isActive()).toBe(true);
  });

  it("permet d'avoir plusieurs alarmes avec des codes différents", () => {
    const alarmA = new Alarm(true, "1234");
    const alarmB = new Alarm(true, "5678");

    expect(alarmA.deactivate("5678")).toBe(false); // le code de B ne marche pas sur A
    expect(alarmA.isActive()).toBe(true);

    expect(alarmA.deactivate("1234")).toBe(true);
    expect(alarmB.deactivate("5678")).toBe(true);
  });
});

describe("Alarm - utilisation du code depuis une liste d'objets", () => {
  it("retire le code de la liste d'objets une fois utilisé et désactive l'alarme", () => {
    const alarm = new Alarm(true, "1234");
    const items = ["1234", "torch"];
    const codeIndex = items.indexOf("1234");

    const success = alarm.deactivate(items[codeIndex]);
    if (success) {
      items.splice(codeIndex, 1); // le code est consommé une fois utilisé
    }

    expect(success).toBe(true);
    expect(alarm.isActive()).toBe(false); // l'alarme est bien désactivée
    expect(items).not.toContain("1234");
    expect(items).toContain("torch"); // les autres objets sont conservés
  });
});