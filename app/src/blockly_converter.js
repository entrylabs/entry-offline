'use strict';

var parseString = require('xml2js').parseString,
    _ = require('lodash'),
    xmlBuilder = require('xmlbuilder');

function processCode(script, funcMap) {
    script = JSON.parse(script);
    var xml = xmlBuilder.create("xml");
    xml.att("xmlns", "http://www.w3.org/1999/xhtml");

    for (var i = 0; i < script.length; i++) {
        if (script[i].length)
            processBlock(xml, script[i], funcMap);
    }

    return xml.end({pretty: false}).substr(21);
};

function processBlock(parent, data, funcMap) {
    if (!data || data.length === 0) return;
    var blockData = data.shift();
    var blockNode = parent.ele("block");
    blockNode.att("type", blockData.type);
    handleMutation(blockNode, blockData, funcMap);
    var blockSchema = entry.block[blockData.type] ||
        funcMap[blockData.type.substr(5)];
    if (blockData.x || blockData.y) {
        blockNode.att("x", blockData.x);
        blockNode.att("y", blockData.y);
    }
    if (blockData.deletable === false)
        blockNode.att("deletable", "false");
    var paramsKeyMap = _.invert(blockSchema.paramsKeyMap);
    if (blockData.type === "rotate_by_angle_time")
        paramsKeyMap["1"] = "VALUE";
    for (var i in blockData.params) {
        var param = blockData.params[i];
        if (param === null)
            continue;
        if (typeof param === "object") {
            var value = blockNode.ele("value");
            value.att("name", paramsKeyMap[i]);
            processBlock(value, [param], funcMap);
        } else {
            var field = blockNode.ele(
                "field",
                {"name": paramsKeyMap[i]}
            ).dat(param);
        }
    }
    if (blockData.statements && blockData.statements.length) {
        var statementsKeyMap = _.invert(blockSchema.statementsKeyMap);
        for (var i in blockData.statements) {
            var statement = blockData.statements[i];
            var statementNode = blockNode.ele(
                "statement",
                {"name": statementsKeyMap[i]}
            );
            processBlock(statementNode, statement, funcMap);
        }
    }

    if (data.length)
        processBlock(blockNode.ele("next"), data, funcMap);
};

function handleMutation(blockNode, blockData, funcMap) {
    var blockType = blockData.type;
    if (blockType === "function_create") {
    } else if (blockType.substr(0, 5) === 'func_') {
        blockNode.att("type", "function_general");
        var hash = blockType.substr(5);
        var mutationNode = blockNode.ele(
            "mutation",
            {"hashid": hash}
        );
        var mutations = funcMap[hash].mutation;
        for (var i in mutations) {
            var mutation = mutations[i];
            var att = {type: mutation[0]}
            if (mutation[0] === "label")
                att.content = mutation[1]
            else
                att.hashid = mutation[1]
            mutationNode.ele("field", att);
        }
    } else if (blockType.substr(0, 12) === 'stringParam_') {
        blockNode.att("type", "function_param_string");
        blockData.type = "function_param_string";
        blockNode.ele(
            "mutation",
            {"hashid": blockType.substr(12)}
        );
    } else if (blockType.substr(0, 13) === 'booleanParam_') {
        blockNode.att("type", "function_param_boolean");
        blockData.type = "function_param_boolean";
        blockNode.ele(
            "mutation",
            {"hashid": blockType.substr(13)}
        );
    }
};

function createFuncMap(id, content, funcMap) {
    var code = JSON.parse(content);
    for (var i in code) {
        var firstBlock = code[i][0];
        if (firstBlock.type === "function_create") {
            var data = firstBlock.params[0];
            var mutation = [];
            var paramsKeyMap = {};
            var i = 0;
            while(data) {
                switch (data.type) {
                    case "function_field_label":
                        mutation.push(["label", data.params[0]])
                        break;
                    case "function_field_boolean":
                        var hash = data.params[0].type.substr(13);
                        mutation.push(["boolean", hash])
                        paramsKeyMap[hash] = i;
                        i++;
                        break;
                    case "function_field_string":
                        var hash = data.params[0].type.substr(12);
                        mutation.push(["string", hash])
                        paramsKeyMap[hash] = i;
                        i++;
                        break;
                }
                data = data.params[1];
            }
            funcMap[id] = {
                mutation: mutation,
                paramsKeyMap: paramsKeyMap
            }
        }
    }
};

module.exports = {
    convert: function(project, cb) {
        var objects = project.objects;

        var functions = project.functions;

        var funcMap = {};

        var done = _.after(functions.length, function() {
            done = _.after(objects.length, function() {
                cb(project);
            });

            if (!objects.length)
                done();

            for (var i = 0; i < objects.length; i++) {
                var object = objects[i];
                object.script = processCode(object.script, funcMap);
                done();
            }
        });

        if (!functions.length)
            done();

        for (var i = 0; i < functions.length; i++) {
            var func = functions[i];
            createFuncMap(func.id, func.content, funcMap);
        };

        for (var i = 0; i < functions.length; i++) {
            var func = functions[i];
            func.content = processCode(func.content, funcMap);
            done();
        }
    }
};
