import EntryServer from 'entry-hw-server';
import { app } from 'electron';
import CommonUtils from '../commonUtils';
import HardwareModuleManager from './hardwareModuleManager';
import path from 'path';

class ServerProcessManager {
    private readonly childProcess: any;
    private readonly moduleManager: HardwareModuleManager;
    private router: any;

    constructor() {
        this.moduleManager = new HardwareModuleManager({
            initialRefresh: false,
            remoteModuleUrl: global.sharedObject.remoteModuleResourceUrl,
            localModulePath: path.resolve(app.getAppPath(), 'modules'),
        });
        this.childProcess = new EntryServer({
            http: true,
            handleModuleListRequest: async () => {
                await this.moduleManager.refreshModuleList();
                return await this.moduleManager.currentModuleList;
            },
            handleModuleFileRequest: (moduleName: string, type: string) => {
                console.log(moduleName, type);
                return this.moduleManager.getModuleFilePath(moduleName, type as any);
            },
        });
    }

    setRouter(router: any) {
        this.router = router;
    }

    open() {
        this._receiveFromChildEventRegister();
        const offlineVersion = CommonUtils.getPaddedVersion(global.sharedObject.version);
        const getEntryDomain = CommonUtils.getEntryDomain();
        console.log('============== ServerProcessManager open', offlineVersion, getEntryDomain);
        this.childProcess.open(offlineVersion, getEntryDomain);
    }

    close() {
        this.childProcess && this.childProcess.close();
    }

    addRoomIdsOnSecondInstance(roomId: string) {
        this.childProcess.addRoomId(roomId);
    }

    disconnectHardware() {
        this.childProcess.disconnectHardware();
    }

    send(data: any) {
        this.childProcess.sendToClient(data);
    }

    connectHardwareSuccess(hardwareId: string) {
        this.childProcess.connectHardwareSuccess(hardwareId);
    }

    connectHardwareFailed() {
        this.childProcess.connectHardwareFailed();
    }

    _receiveFromChildEventRegister() {
        this.childProcess.on('cloudModeChanged', (mode: string) => {
            this.router.notifyCloudModeChanged(mode);
        });
        this.childProcess.on('runningModeChanged', (mode: string) => {
            this.router.notifyServerRunningModeChanged(mode);
        });
        this.childProcess.on('data', (message: any) => {
            this.router.handleServerData(message);
        });
        this.childProcess.on('close', () => {});
    }
}

export default ServerProcessManager;
