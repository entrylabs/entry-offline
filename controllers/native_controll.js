'use strict';

var fs = require('fs');
var sizeOf = require('image-size');
var path = require('path');
var Q = require('q');
var gm = require('gm');
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

	var TARGET_SIZE = 960;
	var THUMB_SIZE = 96;

	var dimension = function(path) {
	    var defer = Q.defer();
	    //gm(path).trim().size(function(err, value) {
	    gm(path).size(function(err, value) {
	        if (err || !value) {
	            defer.resolve(null);
	        } else {
	            defer.resolve(value);
	        }
	    });
	    return defer.promise;
	};

	var checkTrim = function(filepath) {
	    var dfd = Q.defer();

	    filepath = filepath.replace('./', '/Users/Naver/Desktop/jobs/entry-offline/');
	    gm(filepath).write(filepath + '.png', function(err1) {
	        if (err1) {
	            if (fs.existsSync(filepath+".png"))
	                fs.unlinkSync(filepath+".png");
	            dfd.resolve(false);
	        } else {
	            fs.createReadStream(filepath+".png").pipe(new PNG())
	            .on('parsed', function(data) {
	                var trim = false;

	                var r = data[0];
	                var g = data[1];
	                var b = data[2];
	                var a = data[3];

	                if (a===0 || r==255 && g==255 && b==255)
	                    trim = true;//white or transparent

	                fs.unlinkSync(filepath+".png");
	                dfd.resolve(trim);

	            }).on('error', function(err2) {
	                if (fs.existsSync(filepath+".png"))
	                    fs.unlinkSync(filepath+".png");
	                dfd.resolve(false);
	            });

	        }

	    });
	    return dfd.promise;

	};

	var resize = function(srcPath, targetPath, toSize, trim, crop) {
	    var defer = Q.defer();
	    dimension(srcPath).then(function(size) {
	        var image = gm(srcPath);
	        if (trim) {
	            image = image.trim();
	        }

	        if (crop) {
	            if (size.width > toSize && size.height > toSize) {
	                if (size.width <= size.height) {
	                    image = image.resize(toSize);
	                } else {
	                    image = image.resize(null, toSize);
	                }
	            }
	            var x = 0;
	            var y = 0;
	            var centerX = size.width / 2;
	            var centerY = size.height / 2;
	            if (centerX > centerY)
	                x = centerX - centerY;
	            else
	                y = centerY - centerX;

	            image = image.crop(toSize, toSize, x, y);
	        } else {
	            if (size.width > toSize || size.height > toSize) {
	                if (size.width <= size.height) {
	                    image = image.resize(null, toSize);
	                } else {
	                    image = image.resize(toSize);
	                }
	            }
	        }
	        image = image.autoOrient();

	        image.write(targetPath, function(err) {
	            if (err)
	                defer.resolve(err);
	            else
	                defer.resolve(targetPath);
	        });

	    });
	    return defer.promise;
	};

	var getUploadPath = function(fileId) {

	    // prepare upload directory
	    var baseDir = './temp';
	    var uploadDir = path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2));

	    if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2))))
	        fs.mkdirSync(path.join(baseDir, fileId.substr(0,2)));

	    if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2))))
	        fs.mkdirSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2))); // uploadDir

	    if (!fs.existsSync(path.join(uploadDir, 'thumb')))
	        fs.mkdirSync(path.join(uploadDir, 'thumb'));

	    if (!fs.existsSync(path.join(uploadDir, 'image')))
	        fs.mkdirSync(path.join(uploadDir, 'image'));

	    //Path of upload folder where you want to upload fies/
	    var thumbPath = path.join(uploadDir, 'thumb', fileId + '.png'); // thumbnail
	    var imagePath = path.join(uploadDir, 'image', fileId + '.png'); // main image

	    var baseUrl = path.join(fileId.substr(0,2) + '/' + fileId.substr(2,2)); // uploads/xx/yy/[tmp/thumb/image]/[hashkey].png

	    return {
	        uploadDir: uploadDir,
	        thumbPath: thumbPath,
	        imagePath: imagePath,
	        baseUrl: baseUrl
	    }

	};

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

	that.mkdir = function(path, cb) {
		fs.access(path, function (err, files) {
			if(err){
				fs.mkdir(path, function (err) {
					if(err) {
						throw err;
					}

					if($.isFunction(cb)) {
						cb();
					}
				});
			} else {
				if($.isFunction(cb)) {
					cb();
				}
			}
		})
	}

	//임시 이미지 저장
	that.saveTempImageFile = function (file_path, data, cb) {
	    var randomStr = (Math.random().toString(16)+"000000000").substr(2,8);
	    var fileId = require('crypto').createHash('md5').update(randomStr).digest("hex");

		var image = new Buffer(data, 'base64');
		var arr_path = file_path.split('/');
		arr_path.pop();
		var directory_path = arr_path.join('/');
		file_path = directory_path + '/' + fileId + '.png';
		var dest = getUploadPath(fileId);

		that.mkdir(directory_path, function () {
			fs.writeFile(file_path, image, { encoding: 'base64' }, function (err) {
				checkTrim(file_path).then(function(trim) {
		            resize(file_path, dest.imagePath, TARGET_SIZE, trim).then(function() {
		                resize(dest.imagePath, dest.thumbPath, THUMB_SIZE).then(function() {
		                    
		                	var dimensions = sizeOf(file_path);
							if(err) {
								throw err;
							}

							if($.isFunction(cb)) {
								cb(dimensions);
							}

		                });
		            });
		        });
				
			});
		});
	}


	return that;
})();