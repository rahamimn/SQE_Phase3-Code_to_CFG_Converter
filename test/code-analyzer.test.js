import assert from 'assert';
import {convert_rawCode_to_graphCode} from '../src/js/code-analyzer';

const test1 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z){ let a = x + 1; let b = a + y; let c = 0; if (b < z) { c = c + 5; } else if (b < z * 2) { c = c + x + 5; } else { c = c + z + 5; } return c; }',
            '1,2,3'),
        'st=>start\n' + 'op0=>operation:  (0) let a = x + 1;\n' + 'op1=>operation:  (1) let b = a + y;\n' + 'op2=>operation:  (2) let c = 0;\n' + 'cond3=>condition:  (3) b < z\n' + 'op4=>operation:  (4) c = c + 5;\n' + 'cond5=>condition:  (5) b < z * 2\n' + 'op6=>operation:  (6) c = c + x + 5;\n' + 'op7=>operation:  (7) c = c + z + 5;\n' + 'op8=>end:  (8) return c;\n' + 'st->op0\n' + 'op0->op1\n' + 'op1->op2\n' + 'op2->cond3\n' + 'cond3(yes)->op4\n' + 'cond3(no)->cond5\n' + 'cond5(yes)->op6\n' + 'cond5(no)->op7\n' + 'cond5(yes),cond5(no)->op8\n'
    );};

const test2 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z){' +
            ' let b = y + 1; let c = b' +
            ' + x; let a = 0; if (b < z) ' +
            '{ c = c + 5; } else if (b < z * 2) { c = c + x + 5; } else { c = c + z + 5; }' +
            ' return c; }',
            '4,5,6'),
        'st=>start\n' + 'op0=>operation:' +
        '  (0) let b = y + 1;\n' +
        'op1=>operation:  (1) let c = b + x;\n' + 'op2=>operation: ' +
        ' (2) let a = 0;\n' + 'cond3=>condition:  (3) b < z\n' + 'op4=>operation:  (4) c = c + 5;\n' + 'cond5=>condition:' +
        '  (5) b < z * 2\n' + 'op6=>operation:  (6) c = c + x + 5;\n' + 'op7=>operation:  (7) c = c + z + 5;\n' + 'op8=>end:  (8) return c;\n' + 'st->op0\n' + 'op0->op1\n' + 'op1->op2\n' + 'op2->cond3\n' + 'cond3(yes)->op4\n' + 'cond3(no)->cond5\n' + 'cond5(yes)->op6\n' + 'cond5(no)->op7\n' + 'cond5(yes),cond5(no)->op8\n'
    );};

const test3 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z)' +
            '{ let e = y + 1; let i = b + x; let l = 0; if (e < z) ' +
            '{ i = i + 5; } else if (e < z * 2) { i = i + x + 5; } else if (e < x * 2)' +
            '{ i = i + z + 5; } else{ i = 3;} return l; }',
            '7,8,9'),
        'st=>start\n' + 'op0=>operation:  (0) let e = y + 1;\n' + 'op1=>operation:  (1) let i = b + x;\n' + 'op2=>operation:  (2) let l = 0;\n' + 'cond3=>condition:  (3) e < z\n' + 'op4=>operation:  (4) i = i + 5;\n' + 'cond5=>condition:  (5) e < z * 2\n' + 'op6=>operation:  (6) i = i + x + 5;\n' + 'cond7=>condition:  (7) e < x * 2\n' + 'op8=>operation:  (8) i = i + z + 5;\n' + 'op9=>operation:  (9) i = 3;\n' + 'op10=>end:  (10) return l;\n' + 'st->op0\n' + 'op0->op1\n' + 'op1->op2\n' + 'op2->cond3\n' + 'cond3(yes)->op4\n' + 'cond3(no)->cond5\n' + 'cond5(yes)->op6\n' + 'cond5(no)->cond7\n' + 'cond7(yes)->op8\n' + 'cond7(no)->op9\n' + 'cond7(yes),cond7(no)->op10\n'
    );};

const test4 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y)' +
            '{ let e = y + ' +
            '1; let i = b + x; let l = 0; if (e < 3) { i = i + 5; } else if (e < 2) { i = i + x + 5; } else if (e < x * 2){ i = i + 5; } else{ i = 3;} return l; }',
            '1,2'),
        'st=>start\n' + 'op0=>operation:  (0) let e = y + 1;\n' + 'op1=>operation:  (1) let i = b + x;\n' + 'op2=>operation:  (2) let l = 0;\n' + 'cond3=>condition:  (3) e < 3\n' + 'op4=>operation:  (4) i = i + 5;\n' + 'cond5=>condition:  (5) e < 2\n' + 'op6=>operation:  (6) i = i + x + 5;\n' + 'cond7=>condition:  (7) e < x * 2\n' + 'op8=>operation:  (8) i = i + 5;\n' + 'op9=>operation:  (9) i = 3;\n' + 'op10=>end:  (10) return l;\n' + 'st->op0\n' + 'op0->op1\n' + 'op1->op2\n' + 'op2->cond3\n' + 'cond3(yes)->op4\n' + 'cond3(no)->cond5\n' + 'cond5(yes)->op6\n' + 'cond5(no)->cond7\n' + 'cond7(yes)->op8\n' + 'cond7(no)->op9\n' + 'cond7(yes),cond7(no)->op10\n'
    );};

const test5 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z' +
            '){0}\n',
            '1,2,3'),

        'st=>start\n' + 'op0=>operation:  (0) 0;\n' + 'st->op0'

        +'\n'
    );};

const test6 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function toCelsius(fahrenheit)' +
            ' { let c = (5/9) * (fahrenheit-32); return c; }',
            '50'),

        'st=>start\n' +
        'op0=>operation:  (0) let c = 5 / 9 * (fahrenheit - 32);\n' +
        'op1=>end:  (1) return c;\n' +
        'st->op0\n' +
        'st->op1'

        +'\n'
    );};


const test7 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function checkAge(age) ' +
            '{\n' + 'let bool = true\n' + '  if (age > 18) {\n' + '    bool = true;\n' + '  } else {\n' + '    bool = false;\n' + '  }\n' + 'return bool;\n' + '}',
            '21'),
        'st=>start\n' +
        'op0=>operation:  (0) let bool = true;\n' +
        'cond1=>condition:  (1) age > 18\n' +
        'op2=>operation:  (2) bool = true;\n' +
        'op3=>operation:  (3) bool = false;\n' + 'op4=>end:  (4) return bool;\n' +
        'st->op0\n' +
        'op0->cond1\n' +
        'cond1(yes)->op2\n' +
        'cond1(no)->op3\n' +
        'cond1(yes),cond1(no)->op4'

        +'\n'
    );};


const test8 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function fibonacci(num)' +
            '' +
            '{ let first = 1; let b = 0; let second= 0; if(num >= 0){ temp = first; first = first + second; second = temp; num = num - 1; } else{ num = 3; } return second; }',
            '12'),

        'st=>start\n' +
        'op0=>operation:  (0) let first = 1;\n' + 'op1=>operation:  (1) let b = 0;\n' +
        'op2=>operation:  (2) let second = 0;\n' + 'cond3=>condition:  (3) num >= 0\n' + 'op4=>operation:  (4) temp = first;\n' + 'op5=>operation:  (5) first = first + second;\n' + 'op6=>operation:  (6) second = temp;\n' + 'op7=>operation:  (7) num = num - 1;\n' + 'op8=>operation:  (8) num = 3;\n' + 'op9=>end:  (9) return second;\n' + 'st->op0\n' + 'op0->op1\n' +
        'op1->op2\n' +
        'op2->cond3\n' +
        'cond3(yes)->op4\n' + 'op4->op5\n' +
        'op5->op6\n' +
        'op6->op7\n' + 'cond3(no)->op8\n' + 'cond3(yes),op4,op5,op6,cond3(no)->op9'

        +'\n'
    );};


const test9 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function fact(x) ' +
            '' +
            '{ let res = 1; if(x == 0) { res = 1; } else if(x < 0 ) { res = -1; } else if(x < 1) { res = x + 1; } else{ res = res +1} return res ; }', '42'),
        'st=>start\n' + 'op0=>operation:  (0) let res = 1;\n' +
        'cond1=>condition:  (1) x == 0\n' + 'op2=>operation:  (2) res = 1;\n' +
        'cond3=>condition:  (3) x < 0\n' +
        'op4=>operation:  (4) res = -1;\n' + 'cond5=>condition:  (5) x < 1\n' + 'op6=>operation:  (6) res = x + 1;\n' + 'op7=>operation:  (7) res = res + 1;\n' + 'op8=>end:  (8) return res;\n' + 'st->op0\n' + 'op0->cond1\n' +
        'cond1(yes)->op2\n' + 'cond1(no)->cond3\n' + 'cond3(yes)->op4\n' +
        'cond3(no)->cond5\n' +
        'cond5(yes)->op6\n' +
        'cond5(no)->op7\n' +
        'cond5(yes),cond5(no)->op8'

        +'\n'
    );};

const test10 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z){ let d = -1; let e = -1; let f = -1; let a = x + 1; let b = a + y; let c = 0; if (b < z) { c = c + 5; } else if (b < z * 2) { c = c + x + 5; } else { c = c + z + 5; d = c + z + 5; e = c + z + 5; f = c + z + 5; } return c; } ',
            '11,22,33'),

        'st=>start\n' + 'op0=>operation:  (0) let d = -1;\n' +
        'op1=>operation:  (1) let e = -1;\n' + 'op2=>operation:  (2) let f = -1;\n' + 'op3=>operation:  (3) let a = x + 1;\n' +
        'op4=>operation:  (4) let b = a + y;\n' +
        'op5=>operation:  (5) let c = 0;\n' + 'cond6=>condition:  (6) b < z\n' + 'op7=>operation:  (7) c = c + 5;\n' + 'cond8=>condition:  (8) b < z * 2\n' + 'op9=>operation:  (9) c = c + x + 5;\n' + 'op10=>operation:  (10) c = c + z + 5;\n' + 'op11=>operation:  (11) d = c + z + 5;\n' + 'op12=>operation:  (12) e = c + z + 5;\n' + 'op13=>operation:  (13) f = c + z + 5;\n' + 'op14=>end:  (14) return c;\n' + 'st->op0\n' + 'op0->op1\n' + 'op1->op2\n' + 'op2->op3\n' + 'op3->op4\n' + 'op4->op5\n' + 'op5->cond6\n' + 'cond6(yes)->op7\n' + 'cond6(no)->cond8\n' + 'cond8(yes)->op9\n' + 'cond8(no)->op10\n' + 'op10->op11\n' + 'op11->op12\n' + 'op12->op13\n' + 'cond8(yes),cond8(no),op10,op11,op12->op14'

        +'\n'
    );};

const test11 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x, y, z){ let d = -1; let e = -1; let f = -1; if (e < z) { d = d + 5; } else if (e < z * 2) { f = f + x + 5; } else { f = f + z + 5; } return c; } ',
            '-1,0,3'),

        'st=>start\n' +
        'op0=>operation:  (0) let d = -1;\n' + 'op1=>operation:  (1) let e = -1;\n' + 'op2=>operation:  (2) let f = -1;\n' +
        'cond3=>condition:  (3) e < z\n' +
        'op4=>operation:  (4) d = d + 5;\n' + 'cond5=>condition:  (5) e < z * 2\n' + 'op6=>operation:  (6) f = f + x + 5;\n' + 'op7=>operation:  (7) f = f + z + 5;\n' + 'op8=>end:  (8) return c;\n' + 'st->op0\n' +
        'op0->op1\n' + 'op1->op2\n' + 'op2->cond3\n' + 'cond3(yes)->op4\n' +
        'cond3(no)->cond5\n' +
        'cond5(yes)->op6\n' +
        'cond5(no)->op7\n' + 'cond5(yes),cond5(no)->op8'

        +'\n'
    );};

const test12 = () => {
    assert.equal(
        convert_rawCode_to_graphCode(
            'function foo(x){ if (x = 0){ d = -1}else{ let d = -1; let e = -1; let f = -1; } return x; } ',
            '99'),

        'st=>start\n' +
        'cond0=>condition:  (0) x = 0\n' + 'op1=>operation:  (1) d = -1;\n' + 'op2=>operation:  (2) let d = -1;\n' +
        'op3=>operation:  (3) let e = -1;\n' +
        'op4=>operation:  (4) let f = -1;\n' +
        'op5=>end:  (5) return x;\n' + 'st->cond0\n' + 'cond0(yes)->op1\n' + 'cond0(no)->op2\n' + 'op2->op3\n' +
        'op3->op4\n' +
        'cond0(yes),cond0(no),op2,op3->op5'

        +'\n'
    );};






describe('ALL TESTS', () => {

    it('test 1:', test1);
    it('test 2:', test2);
    it('test 3:', test3);
    it('test 4:', test4);
    it('test 5:', test5);
    it('test 6:', test6);
    it('test 7:', test7);
    it('test 8:', test8);
    it('test 9:', test9);
    it('test 10:', test10);
    it('test 11:', test11);
    it('test 12:', test12);




});

