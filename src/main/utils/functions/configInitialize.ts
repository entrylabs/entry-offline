import { app } from 'electron';

const { forEach, merge } = require('lodash');
const path = require('path');
const fs = require('fs');

/**
 * 외부 config 파일이 존재하지 않는 경우의 기본값.
 */
const defaultConfigSchema: FileConfigurations = {
    'baseUrl': 'https://playentry.org',
};

function getExtraResourcePath() {
    const appPath = app.getAppPath();
    if (appPath.indexOf('app.asar') > -1) {
        return path.join(appPath, '..');
    }
    return appPath;
}

export default (configName: string = 'ko'): Readonly<FileConfigurations> => {
    const configFilePath = path.join(getExtraResourcePath(), 'config', `config.${configName}.json`);

    console.log(`load ${configFilePath}...`);

    if (!fs.existsSync(configFilePath)) {
        return defaultConfigSchema;
    }

    const fileData = fs.readFileSync(configFilePath);
    const mergedConfig: FileConfigurations = merge(defaultConfigSchema, JSON.parse(fileData));

    console.log('applied configuration');
    forEach(mergedConfig, (value: any, key: string) => {
        console.log(`${key}: ${value}`);
    });

    return mergedConfig;
};
