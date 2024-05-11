export default function hasAdjSide(tri1: number[], tri2: number[]) {
    let found = 0;
    for(let i = 0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if(tri1[i]==tri2[j]) {
                found++;
                break;
            }
        }
    }
    return found > 1;
}