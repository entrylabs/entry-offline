var gui = require('nw.gui');
var nwWindow = gui.Window.get();
var isOsx = false;

$(document).on('mousewheel', function(e){
    if(e.originalEvent.wheelDelta /120 > 0 && e.ctrlKey) {
        Entry.plugin.setZoomInPage();
    }
    else if(e.ctrlKey){
        Entry.plugin.setZoomOutPage();
    }
});

// Create menu
var native_menu = new gui.Menu({
	type : 'menubar'
});

nwWindow.on('close', function () {
	var canLoad = false;
	if(!Entry.stateManager.isSaved()) {
		canLoad = !confirm(Lang.Menus.save_dismiss);
	}

	if(!canLoad) {
		this.close(true);
	}
});

var shortCutObj = {};
if (process.platform === 'darwin') {
	isOsx = true;
	// create MacBuiltin
	native_menu.createMacBuiltin('Entry', {
		hideEdit : true,
		hideWindow : true
	});
} else {
	isOsx = false;

}

function makeNativeMenu(menus) {
	menus.forEach(function (menu, index) {
		var sub_menu = new gui.Menu();
		if(menu.sub) {
			menu.sub.forEach(function (menu_item, index) {
				var shortcut = {};
				if('shortcut' in menu_item) {
					$.each(Object.keys(menu_item.shortcut), function (idx, key) {
						if(isOsx && key === 'osx') {
							shortcut = menu_item.shortcut[key];
							return false;
						} else if(!isOsx && key === 'win') {
							shortcut = menu_item.shortcut[key];
							return false;
						}
					});
				}

				var menu_scheme = {
					label : menu_item.label,
					click : menu_item.click,
					key: shortcut.key,
				  	modifiers: shortcut.modifiers
				};
				if(menu_item.type) {
					menu_scheme.type = menu_item.type;
				}
				sub_menu.append(new gui.MenuItem(menu_scheme));
			});
		}

		var click_fn = function () {};
		if($.isFunction(menu.click)) {
			click_fn = menu.click;
		}
		native_menu.append(new gui.MenuItem({
			label: menu.label,
			click : click_fn,
			submenu: sub_menu
		}));
	});
}

var menu_set = [{
	'label': Lang.Menus.offline_file,
	'sub': [{
		'label': Lang.Workspace.file_new,
		'click': function () {
			angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
		},
		'shortcut' : {
			'osx' : {
				'key' : 'n',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 'n',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'label': Lang.Workspace.file_open,
		'click': function () {
			Entry.dispatchEvent('loadWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'o',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 'o',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'type': 'separator'
	}, {
		'label': Lang.Workspace.file_save,
		'click': function () {
			Entry.dispatchEvent('saveWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 's',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 's',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'label': Lang.Workspace.file_save_as,
		'click': function () {
			Entry.dispatchEvent('saveAsWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 's',
				'modifiers' : 'cmd + shift'
			},
			'win' : {
				'key' : 's',
				'modifiers' : 'ctrl + shift'
			}
		}
	}]
}, {
	'label': Lang.Menus.offline_edit,
	'sub': [{
		'label': Lang.Menus.offline_undo,
		'click': function () {
			Entry.dispatchEvent('undo');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'z',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 'z',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'label': Lang.Menus.offline_redo,
		'click': function () {
			Entry.dispatchEvent('redo');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'z',
				'modifiers' : 'cmd + shift'
			},
			'win' : {
				'key' : 'y',
				'modifiers' : 'ctrl'
			}
		}

	}]
},  {
	'label': Lang.Menus.view,
	'sub': [{
		'key': 'actual',
		'label': Lang.Menus.actual_size, //Actual Size
		'click': function () {
			Entry.plugin.setZoomLevel(0);
		},
		'shortcut' : {
			'osx' : {
				'key' : '0',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : '0',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'key': 'zoomin',
		'label': Lang.Menus.zoom_in, //Zoom In
		'click': function () {
			Entry.plugin.setZoomInPage();
		},
		'shortcut' : {
			'osx' : {
				'key' : '+',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : '=',
				'modifiers' : 'ctrl'
			}
		}
	}, {
		'key': 'zoomout',
		'label': Lang.Menus.zoom_out, //Zoom Out
		'click': function () {
            Entry.plugin.setZoomOutPage();
		},
		'shortcut' : {
			'osx' : {
				'key' : '-',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : '-',
				'modifiers' : 'ctrl'
			}
		}
	}]
}];

if(!isOsx) {
	var window_menu = [{
		'type': 'separator'
	}, {
		'label': Lang.Menus.offline_quit,
		'click': function () {
			gui.Window.get().close();
		},
		'shortcut' : {
			'win' : {
				'key' : 'f4',
				'modifiers' : 'alt'
			}
		}

	}];

	var about_menu = {
		'label': Lang.Menus.help,
		'sub': [{
			'label': Lang.Menus.entry_info,
			'click': function () {
				Entry.plugin.openAboutPage();
			}
		}]
	};
	menu_set.push(about_menu);

	menu_set[0].sub = menu_set[0].sub.concat(window_menu);
}

makeNativeMenu(menu_set);
// Append Menu to Window
gui.Window.get().menu = native_menu;
