import { ipcRenderer, MenuItemConstructorOptions } from 'electron';
import { Menu } from '@electron/remote';

const getTemplate = function() {
    const { getLang } = window;
    const template: MenuItemConstructorOptions[] = [
        {
            label: getLang('Menus.offline_file'),
            submenu: [
                {
                    label: getLang('Workspace.file_new'),
                    accelerator: 'CmdOrCtrl+n',
                    click() {
                        Entry && Entry.dispatchEvent('newWorkspace');
                    },
                },
                {
                    label: getLang('Workspace.file_upload'),
                    accelerator: 'CmdOrCtrl+o',
                    click() {
                        Entry && Entry.dispatchEvent('loadWorkspace');
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: getLang('Workspace.file_save'),
                    accelerator: 'CmdOrCtrl+s',
                    click() {
                        Entry && Entry.dispatchEvent('saveWorkspace');
                    },
                },
                {
                    label: getLang('Workspace.file_save_as'),
                    accelerator: 'Shift+CmdOrCtrl+S',
                    click() {
                        Entry && Entry.dispatchEvent('saveAsWorkspace');
                    },
                },
            ],
        },
        {
            label: getLang('Menus.offline_edit'),
            submenu: [
                {
                    label: getLang('Menus.offline_undo'),
                    accelerator: 'CmdOrCtrl+z',
                    click() {
                        Entry && Entry.dispatchEvent('undo');
                    },
                },
                {
                    label: getLang('Menus.offline_redo'),
                    accelerator: (function() {
                        if (process.platform === 'darwin') {
                            return 'Shift+Cmd+z';
                        } else {
                            return 'Ctrl+y';
                        }
                    })(),
                    click() {
                        Entry && Entry.dispatchEvent('redo');
                    },
                },
                { label: getLang('Menus.offline_cut'), accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: getLang('Menus.offline_copy'), accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: getLang('Menus.offline_paste'), accelerator: 'CmdOrCtrl+V', role: 'paste' },
            ],
        },
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: getLang('Menus.Entry'),
            submenu: [
                {
                    label: getLang('Menus.help'),
                    click() {
                        ipcRenderer.send('openAboutWindow');
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: getLang('Menus.hide_entry'),
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: getLang('Menus.hide_others'),
                    accelerator: 'Command+Alt+H',
                    role: 'hideOthers',
                },
                {
                    label: getLang('Menus.show_all'),
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    label: getLang('Menus.offline_quit'),
                    accelerator: 'Command+Q',
                    click() {
                        ipcRenderer.invoke('quit');
                    },
                },
            ],
        });
        (template[2].submenu as MenuItemConstructorOptions[]).push(
            {
                type: 'separator',
            },
            {
                label: 'Bring All to Front',
                role: 'front',
            },
        );
    } else {
        (template[0].submenu as MenuItemConstructorOptions[]).push(
            {
                type: 'separator',
            },
            {
                label: getLang('Menus.offline_quit'),
                accelerator: 'Alt+F4',
                click() {
                    window.close();
                },
            },
        );

        template.push({
            label: getLang('Menus.help'),
            submenu: [
                {
                    label: getLang('Menus.entry_info'),
                    accelerator: 'F1',
                    click() {
                        ipcRenderer.send('openAboutWindow');
                    },
                },
            ],
        });
    }

    return template;
};

export default {
    init: () => {
        // require('@electron/remote/main').initialize();
        const template = getTemplate();
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    },
};
