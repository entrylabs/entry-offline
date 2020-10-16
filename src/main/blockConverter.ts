/* eslint-disable */
/*
 * 이 파일은 entryjs 에서 가져온 파일로직으로, legacy(xml 블록) 을 json 화 하기위해 만들어졌다.
 * 그렇기 때문에 새로 유지보수될 일이 없으며, 모든 타입은 any 처리되었다.
 */
'use strict';

import xml2js from 'xml2js';
import _ from 'lodash';
import entry from './entryBlocks';
import createLogger from './utils/functions/createLogger';

const parseString = xml2js.parseString;
const logger = createLogger('main/xmlBlockConverter');

function processCode(xml: any) {
    let code = [];
    const topBlocks = xml.xml.block;
    if (topBlocks) {
        code = topBlocks.map(processThread);
    }

    const locationsX: any[] = [];
    const locationsY: any[] = [];
    code.forEach(function(thread: any) {
        const block = thread[0];
        locationsX.push(block.x);
        locationsY.push(block.y);
    });

    const dX = 40 - Math.min.apply(null, locationsX);
    const dY = 50 - Math.min.apply(null, locationsY);

    code.forEach(function(thread: any) {
        const block = thread[0];
        block.x += dX;
        block.y += dY;
    });

    return code;
}

function processThread(block: any) {
    const thread: any[] = [];
    processBlock(block, thread);
    return thread;
}

function processFunctionGeneral(block: any, thread: any) {
    const parsedBlock = block.$;

    parsedBlock.x ? (parsedBlock.x = Number(parsedBlock.x)) : 0;
    parsedBlock.y ? (parsedBlock.y = Number(parsedBlock.y)) : 0;

    const mutation = block.mutation[0];

    parsedBlock.type = `func_${mutation.$.hashid}`;

    parsedBlock.params = [];
    const values = block.value;
    if (values) {
        for (const i in values) {
            const fieldBlock = values[i].block[0];
            const fieldThread: any[] = [];
            processBlock(fieldBlock, fieldThread);
            parsedBlock.params.push(fieldThread[0]);
        }
    }

    thread.push(parsedBlock);
    if (block.next) {
        processBlock(block.next[0].block[0], thread);
    }
}

function processFunctionCreate(block: any, thread: any) {
    const parsedBlock = block.$;

    parsedBlock.x ? (parsedBlock.x = Number(parsedBlock.x)) : 0;
    parsedBlock.y ? (parsedBlock.y = Number(parsedBlock.y)) : 0;

    thread.push(parsedBlock);
    if (block.next) {
        processBlock(block.next[0].block[0], thread);
    }
}

function processMutationField(block: any, thread: any) {
    const parsedBlock = block.$;

    parsedBlock.x ? (parsedBlock.x = Number(parsedBlock.x)) : 0;
    parsedBlock.y ? (parsedBlock.y = Number(parsedBlock.y)) : 0;

    switch (parsedBlock.type.substr(15, 25)) {
        case 'label':
            parsedBlock.params = [block.field[0]._];
            break;
        case 'string':
            var paramBlock = block.value.shift().block[0];
            parsedBlock.params = [];
            processMutationParam(paramBlock, parsedBlock.params);
            break;
        case 'boolean':
            var paramBlock = block.value.shift().block[0];
            parsedBlock.params = [];
            processMutationParam(paramBlock, parsedBlock.params);
            break;
    }

    if (block.value && block.value.length) {
        processMutationField(block.value[0].block[0], parsedBlock.params);
    }
    thread.push(parsedBlock);
}

function processMutationParam(block: any, thread: any) {
    const parsedBlock = block.$;

    parsedBlock.x ? (parsedBlock.x = Number(parsedBlock.x)) : 0;
    parsedBlock.y ? (parsedBlock.y = Number(parsedBlock.y)) : 0;

    switch (parsedBlock.type.substr(15, 25)) {
        case 'string':
            parsedBlock.type = `stringParam_${block.mutation[0].$.hashid}`;
            break;
        case 'boolean':
            parsedBlock.type = `booleanParam_${block.mutation[0].$.hashid}`;
            break;
    }

    thread.push(parsedBlock);
}

function processBlock(block: any, thread: any) {
    if (!block) {
        return;
    }
    const parsedBlock = block.$;

    if (parsedBlock.type === 'function_general') {
        return processFunctionGeneral(block, thread);
    } else if (parsedBlock.type.indexOf('function_field') == 0) {
        return processMutationField(block, thread);
    } else if (parsedBlock.type.indexOf('function_param') == 0) {
        return processMutationParam(block, thread);
    }

    parsedBlock.x ? (parsedBlock.x = Number(parsedBlock.x)) : 0;
    parsedBlock.y ? (parsedBlock.y = Number(parsedBlock.y)) : 0;

    if (parsedBlock.type == 'hamster_set_wheels_to') {
        parsedBlock.type = 'hamster_set_wheel_to';
    }
    const keyMap = entry.block[parsedBlock.type].paramsKeyMap;

    const blockValues: any[] | any = [];
    let fields = block.field;
    if (fields) {
        fields = fields.map(function(f: any) {
            let val = f._;
            const pType = parsedBlock.type;
            if ((pType === 'number' || pType === 'text') && val === undefined) {
                val = '';
            }
            blockValues[keyMap[f.$.name]] = val;
        });
    }

    let values = block.value;
    if (values) {
        values = values.map(function(v: any) {
            const fieldBlock = v.block[0];
            const fieldThread: any[] = [];
            processBlock(fieldBlock, fieldThread);
            let index = keyMap[v.$.name];
            if (blockValues.type === 'rotate_by_angle_time') {
                index = 0;
            }
            blockValues[index] = fieldThread[0];
        });
    }

    if (blockValues.length) {
        parsedBlock.params = blockValues;
    }

    let statements = block.statement;
    if (statements) {
        statements = statements.map(function(s: any) {
            if (s.block) {
                const topBlock = s.block[0];
                return processThread(topBlock);
            } else {
                return [];
            }
        });
        parsedBlock.statements = statements;
    }

    if (parsedBlock.type) {
        thread.push(parsedBlock);
    }
    if (block.next) {
        processBlock(block.next[0].block[0], thread);
    }
}

export default {
    convert(project: any) {
        logger.warn('legacy xml project request convert');
        logger.warn('project data is..');
        logger.warn(JSON.stringify(project));

        const objects = project.objects;
        const functions = project.functions;

        if (functions.length) {
            for (let i = 0; i < functions.length; i++) {
                const func = functions[i];
                parseString(func.content, function(err: any, xml: any) {
                    func.content = JSON.stringify(processCode(xml));
                });
            }
        }
        if (objects.length) {
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                parseString(object.script, function(err: any, xml: any) {
                    object.script = JSON.stringify(processCode(xml));
                });
            }
        }
        project.objects = objects;
        project.functions = functions;
        return project;
    },
};
