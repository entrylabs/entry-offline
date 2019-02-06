import { remote } from 'electron';
const { Menu } = remote;

const template = [
    {
        label: Lang.Menus.offline_file,
        submenu: [
            {
                label: Lang.Workspace.file_new,
                accelerator: 'CmdOrCtrl+n',
                click(item, focusedWindow) {
                    alert('new Project called');
                    Entry && Entry.dispatchEvent('newWorkspace');
                },
            },
            {
                label: Lang.Workspace.file_upload,
                accelerator: 'CmdOrCtrl+o',
                click() {
                    Entry && Entry.dispatchEvent('loadWorkspace');
                },
            },
            {
                type: 'separator',
            },
            {
                label: Lang.Workspace.file_save,
                accelerator: 'CmdOrCtrl+s',
                click() {
                    Entry && Entry.dispatchEvent('saveWorkspace');
                },
            },
            {
                label: Lang.Workspace.file_save_as,
                accelerator: 'Shift+CmdOrCtrl+S',
                click() {
                    Entry && Entry.dispatchEvent('saveAsWorkspace');
                },
            },
        ],
    },
    {
        label: Lang.Menus.offline_edit,
        submenu: [
            {
                label: Lang.Menus.offline_undo,
                accelerator: 'CmdOrCtrl+z',
                click(item, focusedWindow) {
                    Entry && Entry.dispatchEvent('undo');
                },
            },
            {
                label: Lang.Menus.offline_redo,
                accelerator: (function() {
                    if (process.platform == 'darwin') {
                        return 'Shift+Cmd+z';
                    } else {
                        return 'Ctrl+y';
                    }
                })(),
                click(item, focusedWindow) {
                    Entry && Entry.dispatchEvent('redo');
                },
            },
        ],
    },
];

if (process.platform === 'darwin') {
    template.unshift({
        label: Lang.Menus.Entry,
        submenu: [
            {
                label: Lang.Menus.help,
                click() {
                    Entry && Entry.plugin.openAboutPage();
                },
            },
            {
                type: 'separator',
            },
            {
                label: Lang.Menus.hide_entry,
                accelerator: 'Command+H',
                role: 'hide',
            },
            {
                label: Lang.Menus.hide_others,
                accelerator: 'Command+Alt+H',
                role: 'hideothers',
            },
            {
                label: Lang.Menus.show_all,
                role: 'unhide',
            },
            {
                type: 'separator',
            },
            {
                label: Lang.Menus.offline_quit,
                accelerator: 'Command+Q',
                click() {
                    if (app) {
                        app.quit();
                    }
                },
            },
        ],
    });
    template[2].submenu.push(
        {
            type: 'separator',
        },
        {
            label: 'Bring All to Front',
            role: 'front',
        }
    );
} else {
    template[0].submenu.push(
        {
            type: 'separator',
        },
        {
            label: Lang.Menus.offline_quit,
            accelerator: 'Alt+F4',
            click() {
                window.close();
            },
        }
    );

    template.push({
        label: Lang.Menus.help,
        submenu: [
            {
                label: Lang.Menus.entry_info,
                accelerator: 'F1',
                click() {
                    Entry && Entry.plugin.openAboutPage();
                },
            },
        ],
    });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
