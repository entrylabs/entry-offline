'use strict';

var fs = require('fs');
var gui = require('nw.gui');

// Create menu
var menu = new gui.Menu({
	type : 'menubar'
});

var shortCutObj = {};
if (process.platform === 'darwin') {
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
		}
	}
} else {
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
		}
	}
}
// Create file-menu
var fileMenu = new gui.Menu();

fileMenu.append(new gui.MenuItem({
	label : '새로 만들기',
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
	},
	key: shortCutObj.newProject.key,
  	modifiers: shortCutObj.newProject.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : '불러오기',
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
	label : '저장하기',
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveWorkspace();
	},
	key: shortCutObj.saveWorkspace.key,
  	modifiers: shortCutObj.saveWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : '다른 이름으로 저장하기',
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveAsWorkspace();
	},
	key: shortCutObj.saveAsWorkspace.key,
  	modifiers: shortCutObj.saveAsWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	type : 'separator'
}));

// Append MenuItem as a Submenu
menu.append(new gui.MenuItem({
	label : '파일',
	submenu : fileMenu
// menu elements from fileMenu object
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