import { app } from 'electron';

const { forEach } = require('lodash');
const path = require('path');
const fs = require('fs');

/**
 * 외부 config 파일이 존재하지 않는 경우의 기본값.
 */
const defaultConfigSchema: ExternalConfigurations = {
    'baseUrl': 'https://playentry.org',
};

// target 에 있는 키만 병합한다.
function mergeExistProperties(target: ExternalConfigurations, src: ExternalConfigurations): ExternalConfigurations {
    const result: ExternalConfigurations = target;
    forEach(src, (value: any, key: keyof ExternalConfigurations) => {
        result[key] = value;
    });
    return result;
}

function getExtraResourcePath() {
    const appPath = app.getAppPath();
    if (appPath.indexOf('app.asar') > -1) {
        return path.join(appPath, '..');
    }
    return appPath;
}

export default (configName: string = 'ko'): Configurations => {
    const getMergedConfig = (target: ExternalConfigurations) => mergeExistProperties(defaultConfigSchema, target);
    const configFilePath = path.join(getExtraResourcePath(), 'config', `config.${configName}.json`);

    console.log(`load ${configFilePath}...`);

    const fileData = fs.readFileSync(configFilePath);
    const mergedConfig: ExternalConfigurations = getMergedConfig(JSON.parse(fileData));

    console.log('applied configuration');
    forEach(mergedConfig, (value: any, key: string) => {
        console.log(`${key}: ${value}`);
    });

    return mergedConfig;
};
