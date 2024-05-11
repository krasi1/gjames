
import { Triangle } from './triangleTypes';

export default function hasAdjSide(tri1: Triangle, tri2: Triangle) {
    let found = 0;
    for(let i = 0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if(tri1[i][0] == tri2[j][0] && tri1[i][1] == tri2[j][1]) {
                found++;
                break;
            }
        }
    }
    return found > 1;
}