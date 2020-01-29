import EntryServer from 'entry-hw-server';

class ServerProcessManager {
    private readonly childProcess: any;
    private router: any;

    constructor() {
        this.childProcess = new EntryServer({http: true});
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
