import $ from 'jquery';
import {convert_rawCode_to_graphCode} from './code-analyzer';
import * as flowchart from 'flowchart.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let rawCode = $('#codePlaceholder').val();
        let inputArgs = $('#argsPlaceholder').val();
        let graphCode = convert_rawCode_to_graphCode(rawCode, inputArgs);
        const diagram = flowchart.parse(graphCode);
        diagram.drawSVG('diagram', opt);
    });
});

const opt = {
    'x': 0,
    'y': 0,
    'line-width': 2,
    'line-length': 30,
    'text-margin': 10,
    'font-size': 12,
    'font-color': 'black',
    'line-color': 'black',
    'element-color': 'black',
    'fill': 'white',
    'yes-text': 'T',
    'no-text': 'F',
    'arrow-end': 'block',
    'scale': 1,

    // style symbol types
    'symbols': {
        'start': {'font-color': 'black', 'element-color': 'white', 'fill': 'white'},
        'end':{'class': 'end-element'}
    },
    'flowstate' : {
        'running-code' : {'fill' : 'green', 'font-color' : 'white'},
    }
};