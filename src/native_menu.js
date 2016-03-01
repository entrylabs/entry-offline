var template = [{
    label: Lang.Menus.offline_file,
    submenu: [{
        label: Lang.Workspace.file_new,
        accelerator: 'CmdOrCtrl+n',
        click: function(item, focusedWindow) {
            angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
        }
    }, {
        label: Lang.Workspace.file_open,
        accelerator: 'CmdOrCtrl+o',
        click: function () {
            Entry.dispatchEvent('loadWorkspace');
        }
    }, {
        type: 'separator'
    }, {
        label: Lang.Workspace.file_save,
        accelerator: 'CmdOrCtrl+s',
        click: function () {
            Entry.dispatchEvent('saveWorkspace');
        }
    }, {
        label: Lang.Workspace.file_save_as,
        accelerator: 'Shift+CmdOrCtrl+s',
        click: function () {
            Entry.dispatchEvent('saveAsWorkspace');
        }
    }]
}, {
    label: Lang.Menus.offline_edit,
    submenu: [{
        label: Lang.Menus.offline_undo,
        accelerator: 'CmdOrCtrl+z',
        click: function(item, focusedWindow) {
            Entry.dispatchEvent('undo');
        }
    }, {
        label: Lang.Menus.offline_redo,
        accelerator: (function() {
            if (process.platform == 'darwin')
                return 'Shift+Cmd+z';
            else
                return 'Ctrl+y';
        })(),
        click: function(item, focusedWindow) {
            Entry.dispatchEvent('redo');
        }
    }]
}, {
    label: Lang.Menus.view,
    submenu: [{
        label: Lang.Menus.actual_size,
        accelerator: 'CmdOrCtrl+0',
        click: function () {
            Entry.plugin.setZoomLevel(1);
        }
    }, {
        label: Lang.Menus.zoom_in,
        accelerator: (function() {
            if (process.platform == 'darwin')
                return 'Cmd++';
            else
                return 'Ctrl+=';
        })(),
        click: function () {
            Entry.plugin.setZoomInPage();
        }
    }, {
        label: Lang.Menus.zoom_out,
        accelerator: 'CmdOrCtrl+-',
        click: function () {
            Entry.plugin.setZoomOutPage();
        }
    }]
}];

if (process.platform == 'darwin') {
    template.unshift({
        label: 'Electron',
        submenu: [{
            label: 'About Electron',
            role: 'about'
        }, {
            type: 'separator'
        }, {
            label: 'Services',
            role: 'services',
            submenu: []
        }, {
            type: 'separator'
        }, {
            label: 'Hide Electron',
            accelerator: 'Command+H',
            role: 'hide'
        }, {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        }, {
            label: 'Show All',
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
        }]
    });
    template[3].submenu.push(
        {
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        }
    );
} else {
    template[0].submenu.push(
        {
            type: 'separator'
        }, {
            label: Lang.Menus.offline_quit,
            accelerator: 'Alt+F4',
            click: function () {
                app.quit();
            }
        }
    );

    template.push({
        label: Lang.Menus.help,
        submenu: [{
            label: Lang.Menus.entry_info,
            click: function () {
                Entry.plugin.openAboutPage();
            }
        }]
    })
}

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
