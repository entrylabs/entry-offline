$(document).on('mousewheel', function(e){
    if(e.originalEvent.wheelDelta /120 > 0 && e.ctrlKey) {
        Entry && Entry.plugin.setZoomInPage();
    } else if(e.ctrlKey) {
        Entry && Entry.plugin.setZoomOutPage();
    }
});

var template = [{
    label: Lang.Menus.offline_file,
    submenu: [{
        label: Lang.Workspace.file_new,
        accelerator: 'CmdOrCtrl+n',
        click: function(item, focusedWindow) {
            angular && angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
        }
    }, {
        label: Lang.Workspace.file_upload,
        accelerator: 'CmdOrCtrl+o',
        click: function () {
            Entry && Entry.dispatchEvent('loadWorkspace');
        }
    }, {
        type: 'separator'
    }, {
        label: Lang.Workspace.file_save,
        accelerator: 'CmdOrCtrl+s',
        click: function () {
            Entry && Entry.dispatchEvent('saveWorkspace');
        }
    }, {
        label: Lang.Workspace.file_save_as,
        accelerator: 'Shift+CmdOrCtrl+S',
        click: function () {
            Entry && Entry.dispatchEvent('saveAsWorkspace');
        }
    }]
}, {
    label: Lang.Menus.offline_edit,
    submenu: [{
        label: Lang.Menus.offline_undo,
        accelerator: 'CmdOrCtrl+z',
        click: function(item, focusedWindow) {
            Entry && Entry.dispatchEvent('undo');
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
            Entry && Entry.dispatchEvent('redo');
        }
    }]
}, {
    label: Lang.Menus.view,
    submenu: [{
        label: Lang.Menus.actual_size,
        accelerator: 'CmdOrCtrl+0',
        click: function () {
            Entry && Entry.plugin.setZoomLevel(0);
        }
    }, {
        label: Lang.Menus.zoom_in,
        accelerator: 'CmdOrCtrl+=',
        click: function () {
            Entry && Entry.plugin.setZoomInPage();
        }
    }, {
        label: Lang.Menus.zoom_out,
        accelerator: 'CmdOrCtrl+-',
        click: function () {
            Entry && Entry.plugin.setZoomOutPage();
        }
    }]
}, 
// {
//     label: Lang.Menus.language,
//     submenu: [
//         {
//             label: Lang.Menus.korean,
//             type: 'checkbox',
//             checked: localStorage.getItem('lang') === 'ko',
//             click: function (menuItem) {
//                 if (localStorage.getItem('lang') !== 'ko') {
//                     angular && angular.element('[data-ng-controller=HeaderController]').scope().setLanguage('ko');
//                 } else {
//                     menuItem.checked = true;
//                 }
//             }
//         }, {
//             label: Lang.Menus.english,
//             type: 'checkbox',
//             checked: localStorage.getItem('lang') === 'en',
//             click: function (menuItem) {
//                 if (localStorage.getItem('lang') !== 'en') {
//                     angular && angular.element('[data-ng-controller=HeaderController]').scope().setLanguage('en');
//                 } else {
//                     menuItem.checked = true;
//                 }
//             }
//         }, {
//             label: Lang.Menus.viet,
//             type: 'checkbox',
//             checked: localStorage.getItem('lang') === 'vn',
//             click: function (menuItem) {
//                 if (localStorage.getItem('lang') !== 'vn') {
//                     angular && angular.element('[data-ng-controller=HeaderController]').scope().setLanguage('vn');
//                 } else {
//                     menuItem.checked = true;
//                 }
//             }
//         },
//     ]
// }
];

if (process.platform == 'darwin') {
    template.unshift({
        label: Lang.Menus.Entry,
        submenu: [{
            label: Lang.Menus.help,
            role: 'about',
        }, {
            type: 'separator'
        }, {
            label: Lang.Menus.hide_entry,
            accelerator: 'Command+H',
            role: 'hide'
        }, {
            label: Lang.Menus.hide_others,
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        }, {
            label: Lang.Menus.show_all,
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            label: Lang.Menus.offline_quit,
            accelerator: 'Command+Q',
            click: function() {
                if(app) {
                    app.quit(); 
                }
            }
        }]
    });
    template[2].submenu.push(
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
                window.close();
            }
        }
    );

    template.push({
        label: Lang.Menus.help,
        submenu: [{
            label: Lang.Menus.entry_info,
            accelerator: 'F1',
            click: function () {
                Entry && Entry.plugin.openAboutPage();
            }
        }]
    })
}

var menu = Menu.buildFromTemplate(template);
if(isOsx) {
    Menu.setApplicationMenu(menu);
} else {
    BrowserWindow.fromWebContents(_webContents).setMenu(menu)
}

