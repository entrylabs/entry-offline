import path from 'path';
import chai, { assert } from 'chai';
import chaifs from 'chai-fs';
import fs from 'fs-extra';
import HardwareModuleManager, { IHardwareModule } from './hardwareModuleManager';

chai.use(chaifs);

describe('HardwareModuleManager 테스트', function() {
    const devRemoteModuleUrl = 'http://dev.playentry.org/modules';
    const rootModuleFilePath = path.join(__dirname, '..', '..', 'temp');
    const metadataFilePath = path.join(rootModuleFilePath, 'metadata.json');
    const dummyHardwareList: IHardwareModule[] = [{
        moduleName: 'dummyHardware',
        version: '1.0.0',
        files: {
            image: '/modules/microbitBle/1.0.0/microbitBle.png',
            block: '/modules/microbitBle/1.0.0/block_microbit_ble.js',
            module: '/modules/microbitBle/1.0.0/microbitBle.zip',
        },
        properties: { platform: ['win32', 'darwin'], category: 'board', id: 'F00101' },
        sha1: 'dummy',
        title: { 'en': 'Dummy Hardware', 'ko': '더미 하드웨어' },
        type: 'hardware',
    }];

    const hardwareModuleManager = new HardwareModuleManager({
        remoteModuleUrl: devRemoteModuleUrl,
        localModulePath: rootModuleFilePath,
        initialRefresh: false,
    });

    beforeEach(function() {
        fs.ensureDirSync(rootModuleFilePath);
        fs.writeFileSync(metadataFilePath, JSON.stringify(dummyHardwareList));
    });

    it('로컬 목록, 리모트 목록의 병합 정상 확인', async function() {
        const { result, newList } = await hardwareModuleManager.getRefreshedLocalModuleList();

        assert.isArray(result);
        assert.isArray(newList);

        assert.deepInclude<IHardwareModule>(result, dummyHardwareList[0]);
        assert.notDeepInclude<IHardwareModule>(newList, dummyHardwareList[0]);
    });

    it('병합된 디바이스 목록의 반영 확인', async function() {
        await hardwareModuleManager.refreshModuleList();

        const currentModuleList = hardwareModuleManager.currentModuleList;

        assert.isArray(currentModuleList);
        assert.deepInclude<IHardwareModule>(currentModuleList, dummyHardwareList[0]);
        assert.isAbove(currentModuleList.length, 1);
    });

    it('가져온 디바이스의 파일 확인', async function() {
        await hardwareModuleManager.refreshModuleList();

        const currentModuleList = hardwareModuleManager.currentModuleList;
        const firstIndexDevice = currentModuleList.find(({moduleName}) => moduleName === 'microbitBle');

        const {moduleName} = firstIndexDevice || {};

        if (!moduleName) {
            assert.fail();
        }
        assert.isFile(hardwareModuleManager.getModuleFilePath(moduleName, 'block'));
        assert.isFile(hardwareModuleManager.getModuleFilePath(moduleName, 'image'));
        assert.isFile(hardwareModuleManager.getModuleFilePath(moduleName, 'module'));
    });

    afterEach(function() {
        fs.removeSync(rootModuleFilePath);
    });
});
