(function () {
    const lastCheckVersion = localStorage.getItem('lastCheckVersion');
    const newVersion = localStorage.getItem('isNewVersion');
    
    window.modal = new Modal();

    if(newVersion) {
        localStorage.removeItem('isNewVersion')
        modal.alert(Lang.Msgs.version_update_msg1.replace(/%1/gi, newVersion), Lang.General.update_title, {
            positiveButtonText: Lang.General.recent_download,
            positiveButtonStyle: {
                width: '180px'
            },
            parentClassName: 'versionAlert',
        }).on('click', (event)=> {
            if(event === 'ok') {
                shell.openExternal(
                    'https://playentry.org/#!/offlineEditor'
                );
            }
        });
    } else {
        ipcRenderer.on('checkUpdateResult', (e, { isNewVersion, version } = {}) => {
            if (isNewVersion && version != lastCheckVersion) {
                localStorage.setItem('isNewVersion', version);
                localStorage.setItem('lastCheckVersion', version);
            }
        });
        ipcRenderer.send('checkUpdate');
    }
})();