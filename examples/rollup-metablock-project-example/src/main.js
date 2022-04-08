import { sum } from 'lodash';
import { add, add42 } from './add';

console.log('0.1 + 0.2 =', add(0.1, 0.2));
console.log('-42 + 42 =', add42(-42));
console.log('sum([1, 2, 3]) =', sum([1, 2, 3]));
