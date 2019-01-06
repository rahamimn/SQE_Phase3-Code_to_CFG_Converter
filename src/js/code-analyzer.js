import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

let argsMap;
let graphCode;
let nodesArrayRawCode;
let nodesArrayGraphCode;
let nodesCounter;
let prevNode;
let originalPrevNode;


export const convert_rawCode_to_graphCode = (rawCode, inputArgs) => {
    init();
    let funcExp = esprima.parseScript(rawCode);
    let funcParams = funcExp.body[0].params;
    let funcBody = funcExp.body[0].body;
    argsHandler(funcParams, inputArgs);
    functionHandler([funcBody]);
    connectNodes();
    return graphCode;
};

const _handler_BlockStatement = (JExp, argsMap, spec) => {
    let originalPrevNode = ['st'];
    if (!arraysEqual(prevNode,['st'])) originalPrevNode = nodesArrayGraphCode[nodesArrayGraphCode.length-1].name;
    for (let i = 0; i < JExp.body.length; i++) {
        JExpHandler[JExp.body[i].type](JExp.body[i], argsMap, spec);
    }
    prevNode = originalPrevNode;
};

const make_node_if = (lineOfRawCode, symTable, spec) => {

    originalPrevNode = [];

    let prefix = 'cond';
    let operator = '=>condition: ';
    let nodeName = prefix + nodesCounter;
    let index = ' (' + nodesCounter + ') ';
    let graphCodeLine = nodeName + operator + index + lineOfRawCode + '\n';
    let yesOrNo = '';
    if (spec === 'dif' && (!prevNode[0].startsWith('op'))) yesOrNo = '(no)';
    prevNode = [prevNode + yesOrNo];
    let node = {type: prefix, idx : nodesCounter, name : nodeName, lineOfRawCode : lineOfRawCode, isRunning : false, prevNode : prevNode};
    nodesArrayGraphCode.push(node);

    prevNode = [nodesArrayGraphCode[nodesArrayGraphCode.length-1].name];
    return graphCodeLine;
};

function make_node_normal(lineOfRawCode, symTable, spec) {
    let prefix = 'op';
    let operator = '=>operation: ';
    let nodeName = prefix + nodesCounter;
    let index = ' (' + nodesCounter + ') ';
    let graphCodeLine = nodeName + operator + index + lineOfRawCode + '\n';
    let yesOrNo = '';
    if (spec === 'dit' && (!prevNode[0].startsWith('op'))) yesOrNo = '(yes)';
    if (spec === 'dif' && (!prevNode[0].startsWith('op'))) yesOrNo = '(no)';
    prevNode = [prevNode + yesOrNo];
    let node = {type: prefix, idx : nodesCounter, name : nodeName, lineOfRawCode : lineOfRawCode, isRunning : false, prevNode : prevNode};
    nodesArrayGraphCode.push(node);
    originalPrevNode.push(prevNode);
    prevNode = [nodesArrayGraphCode[nodesArrayGraphCode.length-1].name];
    return graphCodeLine;
}

function make_node_return(lineOfRawCode) {
    let prefix = 'op';
    let operator = '=>end: ';
    let nodeName = prefix + nodesCounter;
    let index = ' (' + nodesCounter + ') ';
    let graphCodeLine = nodeName + operator + index + lineOfRawCode + '\n';
    prevNode = [originalPrevNode];
    let node = {type: prefix, idx : nodesCounter, name : nodeName, lineOfRawCode : lineOfRawCode, isRunning : false, prevNode : prevNode};
    nodesArrayGraphCode.push(node);
    prevNode = [nodesArrayGraphCode[nodesArrayGraphCode.length-1].name];
    return graphCodeLine;
}

const convertRawCodeToGraphCode = {
    'IfStatement': make_node_if,
    'AssignmentExpression': make_node_normal,
    'AssignmentExpressionRightSide': make_node_normal,
    'BinaryExpression': make_node_normal,
    'BlockStatement': make_node_normal,
    'ExpressionStatement': make_node_normal,
    'FunctionDeclaration': make_node_normal,
    'Identifier': make_node_normal,
    'Literal': make_node_normal,
    'ReturnStatement': make_node_return,
    'VariableDeclaration': make_node_normal,
    'WhileStatement': make_node_normal,
};

function addToGraphCode(lineOfRawCode, nodeType, spec) {

    let lineOfGraphCode = convertRawCodeToGraphCode[nodeType](lineOfRawCode, nodeType, spec);
    graphCode = graphCode + lineOfGraphCode;
}

const _handler_VariableDeclaration = (JExp, symTable, spec) => {

    let variable = JExp.declarations[0].id.name;
    let value = JExp.declarations[0].init;
    argsMap.set(variable, value);

    let lineOfRawCode = escodegen.generate(JExp);
    addToGraphCode(lineOfRawCode,JExp.type, spec);
    nodesArrayRawCode[nodesCounter++] = lineOfRawCode;
};

const _handler_IfStatement = (JExp, symTable, spec) => {

    let test = escodegen.generate(JExp.test);
    addToGraphCode(test, JExp.type, spec);
    nodesArrayRawCode[nodesCounter++] = test;
    JExpHandler[JExp.consequent.type](JExp.consequent, symTable, 'dit');
    JExpHandler[JExp.alternate.type](JExp.alternate, symTable, 'dif');

};

const _handler_ExpressionStatement = (JExp, symTable, spec) => {
    let lineOfGraphCode = escodegen.generate(JExp);
    addToGraphCode(lineOfGraphCode, JExp.type, spec);
    nodesArrayRawCode[nodesCounter++] = lineOfGraphCode;
};

const _handler_ReturnStatement = (JExp, symTable, spec) => {
    let lineOfRawCode = escodegen.generate(JExp);
    addToGraphCode(lineOfRawCode, JExp.type, spec);
    nodesArrayRawCode[nodesCounter++] = lineOfRawCode;
};

const JExpHandler = {
    'BlockStatement': _handler_BlockStatement,
    'ExpressionStatement': _handler_ExpressionStatement,
    'IfStatement': _handler_IfStatement,
    'ReturnStatement': _handler_ReturnStatement,
    'VariableDeclaration': _handler_VariableDeclaration,
    'WhileStatement': _handler_ReturnStatement,
};

const functionHandler = (funcBody) => {
    let JExp;
    for (let i = 0; i < funcBody.length; i++) {
        JExp = funcBody[i];
        JExpHandler[JExp.type](JExp, [[], []], true, 'st');
    }
};

const argsHandler = (params, inputArgs) => {
    let variable;
    let value;

    for (let i = 0; i < params.length; i++) {
        variable = params[i].name;
        value = inputArgs.split(',')[i];
        argsMap.set(variable, value);
    }
};

function connectNodes() {
    for (let i = 0; i < nodesArrayGraphCode.length ; i++){
        let currentNode = nodesArrayGraphCode[i].name;
        let previousNode = nodesArrayGraphCode[i].prevNode;
        graphCode = graphCode + ( previousNode + '->' + currentNode+ '\n');
    }
}

function init(){
    graphCode = 'st=>start\n';
    originalPrevNode = [];
    nodesArrayRawCode = [];
    nodesArrayGraphCode = [];
    prevNode = ['st'];
    nodesCounter = 0;
    argsMap = new Map();
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i)
        if (a[i] !== b[i]) return false;

    return true;
}
