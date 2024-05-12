import { GameObjects, Scene } from "phaser";

export default class HealthSystem {
  trackedObjects = new Map<
    GameObjects.GameObject,
    {
      health: number;
      onDestroy: () => void;
      onDamage?: (damage?: number) => void;
    }
  >();

  constructor(protected scene: Scene) {}

  addObject(
    obj: GameObjects.GameObject,
    health: number,
    onDestroy: () => void,
    onDamage?: (damage?: number) => void
  ) {
    this.trackedObjects.set(obj, { health, onDamage, onDestroy });
  }

  takeDamage(obj: GameObjects.GameObject, damage: number) {
    const curr = this.trackedObjects.get(obj);

    if (!curr) return console.warn(`Object not tracked`);

    curr.onDamage?.(damage);

    if (curr.health - damage <= 0) {
      curr.onDestroy();
      this.trackedObjects.delete(obj);
      return;
    }

    this.trackedObjects.set(obj, { ...curr, health: curr.health - damage });
  }
}
