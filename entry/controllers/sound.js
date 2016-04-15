'use strict';
var fs = require('fs');

angular.module('common').controller('SoundController', 
	['$scope', '$rootScope', '$modalInstance', '$routeParams', '$http', 'parent',
                     function ($scope, $rootScope, $modalInstance, $routeParams, $http, parent) {
	
    $scope.parent = parent;
	$scope.systemSounds = [];
    $scope.uploadSounds = [];

    $scope.isCollapsed1 = false;
    $scope.isCollapsed2 = true;
    $scope.isCollapsed3 = true;
    $scope.isCollapsed4 = true;
    $scope.isCollapsed5 = true;
    $scope.isCollapsed6 = true;
  
    $scope.main_menu = "사람";
    $scope.menu = "";

    $scope.searchWord = '';
    $scope.language = localStorage.getItem('lang') || 'ko';
    var data;
    
    var readSoundMeta = function(soundMapFile) {
        if (fs.existsSync(soundMapFile)) {
            var soundMapData = fs.readFileSync(soundMapFile, "utf8");
        }  
        //console.log("sound meta : " + soundMapData);
        
        data = JSON.parse(soundMapData);
    } 
        
    $scope.init = function() {
        var soundMapFile = 'resource_map/' + 'sounds.json'; 
        
        readSoundMeta(soundMapFile);
        
        $routeParams.type = 'default';
        $routeParams.main = '사람';

        $scope.findSounds($routeParams.type, $routeParams.main, $routeParams.sub);
        //console.log("collapse " + $scope.isCollapsed1);       
    };
    
    $scope.findSounds = function(type, main, sub) {

        //var url = '/api/sound/browse';
        if (!type)
            type = 'default';

        //url += ('/' + type);

        if (main) {
            $scope.main_menu = main;
            //url += ('/' + encodeURIComponent(main));
            if (sub) {
                $scope.menu = sub;
                //url += ('/' + encodeURIComponent(sub));
            } else {
                $scope.menu = '';
            }
        }

        $scope.systemSounds = [];

        var categorizedData = [];
        
        for(var i in data) {
            if($scope.menu === '') {
                if($scope.main_menu === data[i].category.main) {
                    categorizedData.push(data[i]); 
                    //console.log("All : " + $scope.main_menu + " " + data[i].category.main);
                }       
            }
            else {
                if($scope.menu === data[i].category.sub && $scope.main_menu === data[i].category.main) {
                    categorizedData.push(data[i]);
                    //console.log("Sub : " + data[i].category.sub);
                }
            }
        }        
        
        for (var i in categorizedData) {
            var sound = categorizedData[i];
          
            var path = '/uploads/' + sound.filename.substring(0,2)+'/'+sound.filename.substring(2,4)+'/'+sound.filename+sound.ext;
        
            //console.log(path);

            Entry.soundQueue.loadFile({
                id: sound._id,
                src: path,
                type: createjs.LoadQueue.SOUND
            });

            sound.selected = 'boxOuter';
            for (var j in $scope.selectedSystem) {
                if ($scope.selectedSystem[j]._id === sound._id) {
                    sound.selected = 'boxOuter selected';
                    break;
                }
            }
            $scope.systemSounds.push(sound);
        }
    };

    $scope.search = function() {
        $scope.searchWord = $('#searchWord').val();
        if (!$scope.searchWord || $scope.searchWord == '') {
            alert('검색어를 입력하세요.');
            return false;
        }

        $scope.systemSounds = [];
        
        for (var i in data) {
            var sound = data[i];
            var originalFileName = '';

            if($scope.language === 'ko') {
                originalFileName = sound.name;
            } else {
                originalFileName = SoundNames[sound.name];
            }
                        
            if(originalFileName.includes($scope.searchWord)) {
                var path = '/uploads/' + sound.filename.substring(0,2)+'/'+sound.filename.substring(2,4)+'/'+sound.filename+sound.ext;
        
                Entry.soundQueue.loadFile({
                    id: sound._id,
                    src: path,
                    type: createjs.LoadQueue.SOUND
                });
       
                sound.selected = 'boxOuter';
                for (var j in $scope.selectedSystem) {
                    if ($scope.selectedSystem[j]._id === sound._id) {
                        sound.selected = 'boxOuter selected';
                        break;
                    }
                }
        
                $scope.systemSounds.push(sound);
                // console.log("sound : " + sound + "==>" + $scope.searchWord);
            }
        }
    
        $scope.collapse(0);
        $scope.main_menu = '';
       
    };


    $scope.upload = function() {
        var uploadFile = document.getElementById("uploadFile").files;
        console.log("upload file : " + uploadFile);

        if (!uploadFile) {
            alert('파일은 필수입력 항목입니다.');
            return false;
        }

        if (uploadFile.length > 10) {
            alert('한번에 10개까지 업로드가 가능합니다.');
            return false;
        }

        for (var i=0, len=uploadFile.length; i<len; i++) {
            var file = uploadFile[i];

            //var isAudio = (/^audio\/mp3/).test(file.type);
            var isAudio = file.name.toLowerCase().indexOf('.mp3') + file.name.toLowerCase().indexOf('.wav');
            if (isAudio < 0) {
                alert('MP3, WAV 파일만 등록이 가능합니다.');
                return false;
            }

            if (file.size > 1024*1024*10) {
                alert('10MB 이하만 업로드가 가능합니다.');
                return false;
            }
            
        }

        $scope.$apply(function() {
            $scope.isUploading = true;
        });

//         var formData = new FormData();
//         formData.append("type", "user");
//         for (var i=0, len=uploadFile.length; i<len; i++) {
//             var file = uploadFile[i];
//             formData.append("uploadFile"+i, file);
// 
//         }
        $scope.uploadSoundFile(uploadFile);

    };

    $scope.uploadSoundFile = function(files) {

//         $.ajax({
//             url: '/api/sound/upload',
//             data: formData,
//             cache: false,
//             contentType: false,
//             processData: false,
//             type: 'POST',
//             success: function(data) {
//                 $scope.$apply(function() {
//                     $scope.isUploading = false;
//                     data.forEach(function(item) {
//                         var path = '/uploads/' + item.filename.substring(0,2)+'/'+
//                             item.filename.substring(2,4)+'/'+item.filename+item.ext;
//                         Entry.soundQueue.loadFile({
//                             id: item._id,
//                             src: path,
//                             type: createjs.LoadQueue.SOUND
//                         });
// 
//                         $scope.uploadSounds.push(item);
// 
//                         //if ($scope.loadings && $scope.loadings.length > 0)
//                         //    $scope.loadings.splice(0,1);
// 
//                     });
// 
//                 });
//             },
//             error: function() {
//                 $scope.apply(function() {
//                     $scope.isUploading = false;
//                     alert(Lang.Msgs.error_occured);
//                 });
//             }
//         });

            //Sound 파일을 로컬 디렉토리에 저장 
            console.log('files number : ' + JSON.stringify(files));
           
            Entry.plugin.uploadTempSoundFile(files, function(soundList) {
                
                console.log("sound : " + JSON.stringify(soundList));
                
                //Sound 파일을 로컬 디렉토리에 저장 후 메타 정보 업데이트    
                $scope.$apply(function() {
                    soundList.forEach(function(item) {
                        console.log("item check : " + JSON.stringify(item));
                        // var path = '/temp/' + item.filename.substring(0,2)+'/'+
                        //     item.filename.substring(2,4)+'/'+'sound'+'/'+item.filename+'.'+item.ext;
                        
                                                
                        Entry.soundQueue.loadFile({
                            id: item._id,
                            src: item.path,
                            type: createjs.LoadQueue.SOUND
                        });
        
                        $scope.uploadSounds.push(item);
        
                        //if ($scope.loadings && $scope.loadings.length > 0)
                        //    $scope.loadings.splice(0,1);
        
                    });
                    $scope.isUploading = false;
        
                });
               
            }); 
    };

    /*
    $scope.makeLoadings = function(count) {
        $scope.loadings = [];
        for (var i=0; i<count; i++)
            $scope.loadings.push(i);
    };
    */

    $scope.collapse = function(dest) {
        for (var i=1; i<10; i++)
            $scope['isCollapsed' + i] = true;

        if (dest > 0) {
            $scope['isCollapsed' + dest] = false;
            $('#searchWord').val('');
        }
    };

    // 현재 선택한 탭
    $scope.currentTab = 'system'; //for modal(sprite,upload,paint,character,text,etc)

    $scope.selectedSystem = [];
    $scope.selectedUpload = [];
    $scope.currentIndex = 0;
    // 선택
    $scope.selectSystem = function(sound) {
        // var path = '/uploads/' + sound.filename.substring(0,2)+'/'+sound.filename.substring(2,4)+'/'+sound.filename+sound.ext;

        var selected = true;
        for (var i in $scope.selectedSystem) {
            var item = $scope.selectedSystem[i];
            if (item._id === sound._id) {
                $scope.selectedSystem.splice(i,1);
                selected = false;
            }
        }

        if (selected) {
            createjs.Sound.play(sound._id);
            var cloneSound = $.extend({}, sound, true);
            $scope.changeLanguage(cloneSound);
            $scope.selectedSystem.push(cloneSound);
            // 스프라이트 다중 선택.
            var elements = jQuery('.boxOuter').each(function() {
                var element = jQuery(this);
                if (element.attr('id') === sound._id) {
                    element.attr('class', 'boxOuter selected');
                }
            });
        } else {
            createjs.Sound.stop();
            var elements = jQuery('.boxOuter').each(function() {
                var element = jQuery(this);
                if (element.attr('id') === sound._id) {
                    element.attr('class', 'boxOuter');
                }
            });
        }
    };

    $scope.moveContainer = function (direction) {
        if ($scope.selectedSystem.length <=5)
            return;

        var mover = jQuery('.modal_selected_container_moving').eq(0);
        var sounds = $scope.selectedSystem;
        if (direction == 'left') {
            if ($scope.currentIndex+2 > sounds.length)
                return;
            $scope.currentIndex++;
            mover.animate({
                marginLeft: '-=106px',
                duration: '0.2'
            },function(){});
        } else {
            if ($scope.currentIndex-1 < 0)
                return;
            $scope.currentIndex--;
            mover.animate({
                marginLeft: '+=106px',
                duration: '0.2'
            },function(){});
        }
    }


    $scope.changeLanguage = function (sound) {
        if($scope.language !== 'ko') {
            sound.name = SoundNames[sound.name] || sound.name;
        }
    }

    $scope.applySystem = function(sound) {
        var cloneSound = $.extend({}, sound, true);
        $scope.selectedSystem = [];
        $scope.changeLanguage(cloneSound);
        $scope.selectedSystem.push(cloneSound);

        $modalInstance.close({
            target: $scope.currentTab,
            data: $scope.currentSelected()
        });
    };

    $scope.selectUpload = function(sound) {
        // var path = '/temp/' + sound.filename.substring(0,2)+'/'+sound.filename.substring(2,4)+'/'+sound.filename+'.'+sound.ext;

        var selected = true;
        for (var i in $scope.selectedUpload) {
            var item = $scope.selectedUpload[i];
            if (item._id === sound._id) {
                $scope.selectedUpload.splice(i,1);
                selected = false;
            }
        }

        if (selected) {
            $scope.selectedUpload.push(sound);
            createjs.Sound.play(sound._id);
            // 스프라이트 다중 선택.
            var elements = jQuery('.boxOuter').each(function() {
                var element = jQuery(this);
                if (element.attr('id') === sound._id) {
                    element.attr('class', 'boxOuter selected');
                }
            });
        } else {
            createjs.Sound.stop();
            var elements = jQuery('.boxOuter').each(function() {
                var element = jQuery(this);
                if (element.attr('id') === sound._id) {
                    element.attr('class', 'boxOuter');
                }
            });
        }
    };

    $scope.applyUpload = function(sound) {
        $scope.selectedUpload = [];
        $scope.selectedUpload.push(sound);

        $modalInstance.close({
            target: $scope.currentTab,
            data: $scope.currentSelected()
        });
    };

    // 탭 이동
    $scope.changeTab = function(tab) {
        $scope.currentIndex = 0;
        var mover = jQuery('.modal_selected_container_moving').eq(0);
        mover.css('margin-left', 0);
        $scope.currentTab = tab;
    };

    $scope.currentSelected = function() {
        if ($scope.currentTab === 'system') {
            return $scope.selectedSystem;
        } else if ($scope.currentTab === 'upload') {
            return $scope.selectedUpload;
        } else if ($scope.currentTab === 'textBox') {
            return 'textBox';
        } else {
            return null;
        }
    };

    // 적용
    $scope.ok = function () {
        if (!$scope.currentSelected()) {
            alert(Lang.Workspace.select_sprite);
        } else {
            $modalInstance.close({
                target: $scope.currentTab,
                data: $scope.currentSelected()
            });
        }
        createjs.Sound.stop();
    };

    // 취소
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        createjs.Sound.stop();
    };
    
		
}]);