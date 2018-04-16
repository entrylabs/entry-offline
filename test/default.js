var Application = require('spectron').Application;
var assert = require('assert');
var path = require('path');
var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
if (process.platform === 'win32') electronPath += '.cmd'
var appPath = path.join('app');

describe('application launch', function () {
    this.timeout(10000);
    before(function () {
        this.app = new Application({
            path: electronPath,
            args: [appPath]
        })
        return this.app.start();
    })

    after(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    })

    describe('기본 실행 확인', function () {
        it('창이 1개 뜨는지 확인', function () {
            return this.app.client.getWindowCount().then(function (count) {
                assert.equal(count, 1)
            });
        });

        it('창이 보이는지 확인합니다.', function () {
            return this.app.browserWindow.isVisible().then(function (isVisible) {
                assert.equal(isVisible, true);
            });
        });

        it('윈도우 제목 확인', function () {
            return this.app.browserWindow.getTitle().then(function (title) {
                if(title.indexOf('엔트리') >= 0) {
                    assert.ok(title);
                } else {
                    assert.fail(title, '엔트리', '잘못된 제목 삽입');
                }
            });
        });
    });

    
    
    /*
    describe('파일 로드 확인', function () {
        it('1번 파일', function (done) {
            var self = this;
            console.log('a');
            return this.app.client.execute(function () {
                // console.log(angular);
                var file_path = path.join(__dirname, '..', 'test', 'test_file', 'test_case1.ent');
                console.log(file_path);
                try{
                    var a = angular.element('.entryRunButtonWorkspace_w').scope();
                    console.log(a);
                    console.log(angular);
                    return angular.element('.entryRunButtonWorkspace_w').scope().loadWorkspaceTest(file_path);
                } catch(e) {
                    throw new Error(e);
                    return false;
                }
            }).then(function (equal) {
                '자동문 의 사본'
                var a = self.app.client.waitForText('#project_name').then(function (a, b, c) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                    console.log(equal);
                    done();
                });                    
            });
        });
    });
    */
})


// var self = this;
//         this.app.start().then(function () {
//             // 윈도우가 보이는지 확인합니다.
//             return self.app.browserWindow.isVisible()
//         }).then(function (isVisible) {
//             // 윈도우가 보이는지 검증합니다.
//             assert.equal(isVisible, true)
//         }).then(function () {
//             // 윈도우의 제목을 가져옵니다.
//             return self.app.client.getTitle()
//         }).then(function (title) {
//             // 윈도우의 제목을 검증합니다.
//             assert.equal(title, 'My App')
//         }).then(function () {
//             // 어플리케이션을 중지합니다.
//           return self.app.stop()
//         }).catch(function (error) {
//             // 테스트의 실패가 있다면 로깅합니다.
//             console.error('Test failed', error.message)
//         })
