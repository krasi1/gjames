import { GameObjects, Scene } from "phaser";

export default class HealthSystem {

    trackedObjects = new Map<GameObjects.GameObject, { health: number, onDestroy: () => void, onDamage?: () => void }>()

    constructor(protected scene: Scene) {

    }


    addObject(obj: GameObjects.GameObject, health: number, onDestroy: () => void, onDamage?: () => void,) {
        this.trackedObjects.set(obj, { health, onDamage, onDestroy })
    }

    takeDamage(obj: GameObjects.GameObject, damage: number) {
        const curr = this.trackedObjects.get(obj)

        if (!curr) return console.warn(`Object not tracked`)

        if (curr.health - damage <= 0) {
            curr.onDestroy()
            return
        }

        this.trackedObjects.set(obj, { ...curr, health: curr.health - damage, });
    }
}