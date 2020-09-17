import path from 'path';
import fs from 'fs-extra';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';
import axios from 'axios';
import createDebug from 'debug';

const debug = createDebug('HardwareModuleManager');

type InitialOptions = {
    remoteModuleUrl: string;
    localModulePath: string;
    initialRefresh?: boolean;
};

type IModuleType = 'hardware' | 'block';

interface LanguageTemplateObject {
    ko?: string;
    en?: string;
    jp?: string;
}

export type IHardwareModule = {
    moduleName: string;
    version: string;
    title: LanguageTemplateObject | string;
    files: {
        image: string;
        block: string;
        [key: string]: string;
    };
    properties?: {
        [key: string]: any;
    };
    sha1?: string;
    type: IModuleType;
};

class HardwareModuleManager {
    private readonly localModulePath: string;
    private readonly remoteModuleUrl: string;

    private _moduleList: IHardwareModule[];

    get currentModuleList() {
        return this._moduleList;
    }

    constructor({ initialRefresh = true, localModulePath, remoteModuleUrl }: InitialOptions) {
        this.remoteModuleUrl = remoteModuleUrl;
        this.localModulePath = localModulePath;
        this._moduleList = [];
        if (initialRefresh) {
            this.refreshModuleList();
        }
    }

    public getModuleFilePath(moduleName: string, type: 'image' | 'module' | 'block'): string {
        return path.join(this.localModulePath, moduleName, type);
    }

    public async refreshModuleList(): Promise<void> {
        const { result, newList } = await this.getRefreshedLocalModuleList();

        debug('moduleList refreshed. new module :\n%O', newList);

        if (!isEqual(this._moduleList, result)) {
            this._moduleList = result;
            //TODO newList 의 값들은 전부 서버에서 다시 다운 받아야함
            await Promise.all(newList.map(this.refreshLocalModuleFile.bind(this)));
        }
    }

    public async getRefreshedLocalModuleList(): Promise<{
        result: IHardwareModule[];
        newList: IHardwareModule[];
    }> {
        const localModuleList = await this.getLocalModuleList();
        const remoteModuleList = await this.getRemoteModuleList();

        debug('refreshLocalModules..');
        debug('localModuleList\n%O', localModuleList);
        debug('remoteModuleList\n%O', remoteModuleList);

        let newList: IHardwareModule[] = [];
        const result = unionWith(localModuleList, remoteModuleList, (remoteElem, localElem) => {
            const isDuplicated =
                isEqual(remoteElem.moduleName, localElem.moduleName) &&
                isEqual(remoteElem.version, localElem.version);
            !isDuplicated && newList.push(remoteElem);
            return isDuplicated;
        });
        if (localModuleList.length === 0) {
            newList = remoteModuleList;
        }

        return { result, newList };
    }

    private async refreshLocalModuleFile(hardwareMetadata: IHardwareModule) {
        // 파일이 있는지 확인
        // const imageTargetPath = path.join(this.localModulePath, path.normalize(hardwareMetadata.files.image));
        // const blockTargetPath = path.join(this.localModulePath, path.normalize(hardwareMetadata.files.block));
        // const moduleTargetPath = path.join(this.localModulePath, path.normalize(hardwareMetadata.files.module));

        await Promise.all(
            Object.entries(hardwareMetadata.files).map(async ([key, value]) => {
                try {
                    const requestUrl = `${this.remoteModuleUrl}/${hardwareMetadata.moduleName}/files/${key}`;
                    const response = await axios({
                        url: requestUrl,
                        method: 'GET',
                        responseType: 'arraybuffer',
                    });
                    await fs.ensureDir(
                        path.join(this.localModulePath, hardwareMetadata.moduleName)
                    );
                    await fs.writeFile(
                        path.join(this.localModulePath, hardwareMetadata.moduleName, key),
                        Buffer.from(response.data, 'binary')
                    );
                } catch (e) {
                    console.error(e);
                }
            })
        );
        // 파일이 없으면, request 를 보내서 채워넣음
        // 파일이 있으면 그대로 넘어감
    }

    private async getLocalModuleList(): Promise<IHardwareModule[]> {
        await fs.ensureDir(this.localModulePath);
        const metadataFilePath = path.join(this.localModulePath, 'metadata.json');
        if (fs.existsSync(metadataFilePath)) {
            const metadataFileBuffer = await fs.readFile(metadataFilePath);
            return JSON.parse(metadataFileBuffer.toString('utf8'));
        } else {
            return [];
        }
    }

    private async getRemoteModuleList(): Promise<IHardwareModule[]> {
        try {
            const response = await axios.get(this.remoteModuleUrl);
            return await response.data;
        } catch (e) {
            debug('getRemoteModuleList failed with error %O', e);
            return [];
        }
    }
}

export default HardwareModuleManager;
