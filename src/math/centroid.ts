export default function centroid(points: [number, number][]): [number, number] {
    let x = 0;
    let y = 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const f = p1[0] * p2[1] - p2[0] * p1[1];
        x += (p1[0] + p2[0]) * f;
        y += (p1[1] + p2[1]) * f;
        area += f;
    }
    area /= 2;
    x /= 6 * area;
    y /= 6 * area;
    return [x, y];
}

