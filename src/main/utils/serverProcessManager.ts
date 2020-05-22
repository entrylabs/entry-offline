import EntryServer from 'entry-hw-server';
import path from 'path';

class ServerProcessManager {
    private readonly childProcess: any;
    private router: any;

    constructor() {
        this.childProcess = new EntryServer({
            http: true,
            handleModuleListRequest: () => {
                return [
                    {
                        'moduleName': 'microbitBle',
                        'version': '1.0.0',
                        'files': {
                            'image': '\\modules\\microbitBle\\1.0.0\\microbitBle.png',
                            'block': '\\modules\\microbitBle\\1.0.0\\block_microbit_ble.js',
                            'module': '\\modules\\microbitBle\\1.0.0\\microbitBle.zip',
                        },
                        'properties': {
                            'platform': [
                                'win32',
                                'darwin',
                            ],
                            'category': 'board',
                            'id': 'F00101',
                        },
                        'sha1': 'dummy',
                        'title': {
                            'en': 'Microbit BLE',
                            'ko': '마이크로빗 무선',
                        },
                        'type': 'hardware',
                    },
                ];
            },
            handleModuleFileRequest: (moduleName: string, version: string, type: string) => {
                console.log(moduleName, version, type);
                return path.join(__dirname, '..', '..', 'renderer', 'resources', 'images', 'gnb', 'btn_workspace_undo_textbook_mode.png');
            },
        });
    }

    setRouter(router: any) {
        this.router = router;
    }

    open() {
        this._receiveFromChildEventRegister();
        this.childProcess.open();
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
        this.childProcess.on('close', () => {

        });
    }
}

export default ServerProcessManager;
