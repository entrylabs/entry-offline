'use strict';

var fs = require('fs');
var gui = require('nw.gui');
var isOsx = false;

// Create menu
var menu = new gui.Menu({
	type : 'menubar'
});

var shortCutObj = {};
if (process.platform === 'darwin') {
	isOsx = true;
	// create MacBuiltin
	menu.createMacBuiltin('Entry', {
		hideEdit : true,
		hideWindow : true
	});
	shortCutObj = {
		'newProject' : {
			'key' : 'n',
			'modifiers' : 'cmd'
		},
		'loadWorkspace' : {
			'key' : 'o',
			'modifiers' : 'cmd'
		},
		'saveWorkspace' : {
			'key' : 's',
			'modifiers' : 'cmd'
		},
		'saveAsWorkspace' : {
			'key' : 's',
			'modifiers' : 'cmd + shift'
		},
		'undo' : {
			'key' : 'z',
			'modifiers' : 'cmd'
		},
		'redo' : {
			'key' : 'z',
			'modifiers' : 'cmd + shift'
		}
	}
} else {
	isOsx = false;
	shortCutObj = {
		'newProject' : {
			'key' : 'n',
			'modifiers' : 'ctrl'
		},
		'loadWorkspace' : {
			'key' : 'o',
			'modifiers' : 'ctrl'
		},
		'saveWorkspace' : {
			'key' : 's',
			'modifiers' : 'ctrl'
		},
		'saveAsWorkspace' : {
			'key' : 's',
			'modifiers' : 'ctrl + shift'
		},
		'undo' : {
			'key' : 'z',
			'modifiers' : 'ctrl'
		},
		'redo' : {
			'key' : 'y',
			'modifiers' : 'ctrl'
		},
		'quit' : {
			'key' : 'x',
			'modifiers' : 'ctrl'
		}
	}
}
// Create file-menu
var fileMenu = new gui.Menu();
// Create edit-menu
var editMenu = new gui.Menu();

fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_new,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
	},
	key: shortCutObj.newProject.key,
  	modifiers: shortCutObj.newProject.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_open,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().loadWorkspace();
	},
	key: shortCutObj.loadWorkspace.key,
  	modifiers: shortCutObj.loadWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	type : 'separator'
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_save,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveWorkspace();
	},
	key: shortCutObj.saveWorkspace.key,
  	modifiers: shortCutObj.saveWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_save_as,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveAsWorkspace();
	},
	key: shortCutObj.saveAsWorkspace.key,
  	modifiers: shortCutObj.saveAsWorkspace.modifiers
}));
if(!isOsx) {
	fileMenu.append(new gui.MenuItem({
		type : 'separator'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '종료',
		click : function () {
			gui.App.quit();
		},
		key: shortCutObj.quit.key,
	  	modifiers: shortCutObj.quit.modifiers
	}));
}

editMenu.append(new gui.MenuItem({
	label : '되돌리기',
	click : function () {
		Entry.dispatchEvent('undo');
	},
	key: shortCutObj.undo.key,
  	modifiers: shortCutObj.undo.modifiers
}));

editMenu.append(new gui.MenuItem({
	label : '다시실행',
	click : function () {
		Entry.dispatchEvent('redo');
	},
	key: shortCutObj.redo.key,
  	modifiers: shortCutObj.redo.modifiers
}));

// Append MenuItem as a Submenu
menu.append(new gui.MenuItem({
	label : '파일',
	submenu : fileMenu
}));
menu.append(new gui.MenuItem({
	label : '편집',
	submenu : editMenu
}));

// Append Menu to Window
gui.Window.get().menu = menu;



// plugin
Entry.plugin = (function () {
	var that = {};

	// 파일 저장
	that.writeFile = function(path, data, cb, enc) {
		fs.writeFile(path, data, enc || 'utf8', function (err) {
			if(err) {
				throw err;
			}

			if($.isFunction(cb)) {
				cb();
			}
		});
	}

	// 파일 열기
	that.readFile = function(path, cb, enc) {
		fs.readFile(path, enc || 'utf8', function (err, data) {
			if(err) {
				throw err;
			}

			if($.isFunction(cb)) {
				cb(data);
			}
		});
	}


	return that;
})();