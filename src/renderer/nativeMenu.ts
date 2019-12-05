import { remote, MenuItemConstructorOptions } from 'electron';
import RendererUtils from './helper/rendererUtils';
import IpcRendererHelper from './helper/ipcRendererHelper';
const { Menu } = remote;

const getTemplate = function() {
    const template: MenuItemConstructorOptions[] = [
        {
            label: RendererUtils.getLang('Menus.offline_file'),
            submenu: [
                {
                    label: RendererUtils.getLang('Workspace.file_new'),
                    accelerator: 'CmdOrCtrl+n',
                    click() {
                        Entry && Entry.dispatchEvent('newWorkspace');
                    },
                },
                {
                    label: RendererUtils.getLang('Workspace.file_upload'),
                    accelerator: 'CmdOrCtrl+o',
                    click() {
                        Entry && Entry.dispatchEvent('loadWorkspace');
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: RendererUtils.getLang('Workspace.file_save'),
                    accelerator: 'CmdOrCtrl+s',
                    click() {
                        Entry && Entry.dispatchEvent('saveWorkspace');
                    },
                },
                {
                    label: RendererUtils.getLang('Workspace.file_save_as'),
                    accelerator: 'Shift+CmdOrCtrl+S',
                    click() {
                        Entry && Entry.dispatchEvent('saveAsWorkspace');
                    },
                },
            ],
        },
        {
            label: RendererUtils.getLang('Menus.offline_edit'),
            submenu: [
                {
                    label: RendererUtils.getLang('Menus.offline_undo'),
                    accelerator: 'CmdOrCtrl+z',
                    click() {
                        Entry && Entry.dispatchEvent('undo');
                    },
                },
                {
                    label: RendererUtils.getLang('Menus.offline_redo'),
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
            ],
        },
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: RendererUtils.getLang('Menus.Entry'),
            submenu: [
                {
                    label: RendererUtils.getLang('Menus.help'),
                    click() {
                        IpcRendererHelper.openAboutPage();
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: RendererUtils.getLang('Menus.hide_entry'),
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: RendererUtils.getLang('Menus.hide_others'),
                    accelerator: 'Command+Alt+H',
                    role: 'hideOthers',
                },
                {
                    label: RendererUtils.getLang('Menus.show_all'),
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    label: RendererUtils.getLang('Menus.offline_quit'),
                    accelerator: 'Command+Q',
                    click() {
                        IpcRendererHelper.quitApplication();
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
            }
        );
    } else {
        (template[0].submenu as MenuItemConstructorOptions[]).push(
            {
                type: 'separator',
            },
            {
                label: RendererUtils.getLang('Menus.offline_quit'),
                accelerator: 'Alt+F4',
                click() {
                    window.close();
                },
            }
        );

        template.push({
            label: RendererUtils.getLang('Menus.help'),
            submenu: [
                {
                    label: RendererUtils.getLang('Menus.entry_info'),
                    accelerator: 'F1',
                    click() {
                        IpcRendererHelper.openAboutPage();
                    },
                },
            ],
        });
    }

    return template;
};

export default {
    init: () => {
        const template = getTemplate();
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    },
};
