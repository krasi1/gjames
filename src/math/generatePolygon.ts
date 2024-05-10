import { Math as PhaserMath } from 'phaser';

export default function generatePolygon(center: [number, number],
    angleRange: [number, number],
    radiusRange: [number, number],
    avgRadius: number,
    irregularity: number, spikiness: number,
    numVertices: number): [number, number][] {
    if (irregularity < 0 || irregularity > 1) {
        throw new Error("Irregularity must be between 0 and 1.");
    }
    if (spikiness < 0 || spikiness > 1) {
        throw new Error("Spikiness must be between 0 and 1.");
    }

    irregularity *= 2 * Math.PI / numVertices;
    spikiness *= avgRadius;
    const angleSteps = randomAngleSteps(numVertices, irregularity);

    const points: [number, number][] = [];
    let angle = PhaserMath.FloatBetween(angleRange[0], angleRange[1]);
    for (let i = 0; i < numVertices; i++) {
        const radius = clip(PhaserMath.FloatBetween(radiusRange[0], radiusRange[1]) * avgRadius, 0, 2 * avgRadius);
        const point: [number, number] = [
            center[0] + radius * Math.cos(angle),
            center[1] + radius * Math.sin(angle)
        ];
        points.push(point);
        angle += angleSteps[i];
    }

    return points;
}

function randomAngleSteps(steps: number, irregularity: number): number[] {
    const angles: number[] = [];
    const lower = (2 * Math.PI / steps) - irregularity;
    const upper = (2 * Math.PI / steps) + irregularity;
    let cumsum = 0;
    for (let i = 0; i < steps; i++) {
        const angle = Math.random() * (upper - lower) + lower;
        angles.push(angle);
        cumsum += angle;
    }

    cumsum /= (2 * Math.PI);
    for (let i = 0; i < steps; i++) {
        angles[i] /= cumsum;
    }
    return angles;
}

function clip(value: number, lower: number, upper: number): number {
    return Math.min(upper, Math.max(value, lower));
}
