(function() {
    const lastCheckVersion = localStorage.getItem('lastCheckVersion');
    const newVersion = localStorage.getItem('hasNewVersion');

    window.modal = new Modal();

    if (newVersion) {
        localStorage.removeItem('hasNewVersion');
        modal
            .alert(
                Lang.Msgs.version_update_msg1.replace(/%1/gi, newVersion),
                Lang.General.update_title,
                {
                    positiveButtonText: Lang.General.recent_download,
                    positiveButtonStyle: {
                        width: '180px',
                    },
                    parentClassName: 'versionAlert',
                }
            )
            .one('click', (event) => {
                if (event === 'ok') {
                    shell.openExternal(
                        'https://playentry.org/#!/offlineEditor'
                    );
                }
            });
    } else {
        ipcRenderer.on(
            'checkUpdateResult',
            (e, { hasNewVersion, version } = {}) => {
                if (hasNewVersion && version != lastCheckVersion) {
                    localStorage.setItem('hasNewVersion', version);
                    localStorage.setItem('lastCheckVersion', version);
                }
            }
        );
        ipcRenderer.send('checkUpdate');
    }
})();
