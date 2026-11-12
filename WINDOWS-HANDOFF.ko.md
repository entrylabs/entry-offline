# Windows에서 작업 이어가기

## beomeo.5 변경 및 재시험

- Windows에서는 기존 `SerialPort.list()` 결과의 각 COM 항목에 들어 있는 `serialNumber`(또는 해당 항목의 완전한 USB 인스턴스 ID)로 표시 이름만 `microbit (축약 시리얼번호)`로 바꾼다. 실제 연결 경로는 원래 COM 경로 그대로다.
- 앱의 Windows 연결 과정에서 PowerShell/PnpDevice 및 부모 관계 조회를 호출하지 않는다. 별도의 시리얼번호-COM 대응 추정을 하지 않는다.
- 시리얼번호가 제공되지 않은 항목도 `COMxx`로 표시하여 기존 연결/핸드셰이크 절차로 연결할 수 있다.
- 상세 로그: `%APPDATA%\entry-hw\logs\entry-hw-YYYY-MM-DD.log`. `microbit COM discovery`를 검색한다. COM 목록의 원본 속성과 조회 소요 시간, 실패 시 오류 코드와 스택을 기록한다.
- 설치 후 축약 시리얼 표시, 시리얼 미제공 항목의 COM 표시, COM 직접 연결, USB 분리 후 사라진 COM 연결 방지를 확인한다.

이하 내용은 이전 beomeo.4 인계 기록이다.

세 저장소의 `codex/microbit-serial-windows` 브랜치를 같은 상위 폴더에 클론한다.

```powershell
git clone -b codex/microbit-serial-windows https://github.com/LHOIKTN/entry-hw.git
git clone -b codex/microbit-serial-windows https://github.com/LHOIKTN/entry-offline.git
git clone -b codex/microbit-serial-windows https://github.com/LHOIKTN/entryjs.git
```

Windows Codex에서 세 저장소가 들어 있는 상위 폴더를 열고 이 문서와 BEOMEO.md를 읽도록 요청한다. node_modules, 빌드 산출물, 네이티브 바이너리 캐시는 Git에 포함하지 않았다. 의존성은 Windows에서 설치해야 한다. 설치 및 재빌드 시 Electron 18.3.0에 맞는 네이티브 모듈이 필요하며 자세한 Windows 바이너리 준비 절차는 BEOMEO.md를 참조한다. 원본 EntryJS dist와 하드웨어 번들을 빌드한 뒤 sync해야 한다.

## 현재 완료된 사항

- 기존 범어중 마이크로비트 블록, 커스텀 펌웨어, CRLF 통신, 기본 모드 시작, 핑크 아이콘을 유지했다.
- Windows USB 및 TS_USB 시리얼 검색, 중복 제거, `microbit (8자리)` 표시를 구현했다.
- 일반 USB는 실제 부모 관계에서 확인된 유일한 포트만 연결하며 TS_USB 매핑은 추측하지 않고 차단한다.
- macOS serialport의 동일 레코드에 있는 USB 시리얼과 포트도 지원하도록 구현했으나 UI/통신 현장 검증은 미완료다.
- 하드웨어 단독 앱이 아니라 Entry Offline에 router/preload/선택 UI를 모두 동기화해야 한다. scripts/sync-beomeo.js 및 check-beomeo.js에 반영했다.
- Windows x64 오프라인 설치 파일 버전: 2.1.36-beomeo.4. 설치 파일은 Git에 포함하지 않았다.

## 지금 해결할 문제

Windows에서 장치 선택창에 “장치 조회에 실패했습니다. Windows PnpDevice 명령 지원 및 실행 권한을 관리자에게 확인하세요.”가 표시된다.
이 문구는 모든 조회 예외에 대한 공통 메시지다. 권한 문제라고 확정되지 않았다.
학생 계정에서 이전 PowerShell 조회는 성공했다. 앱에서의 PowerShell 실행 오류, 모듈 지원, 12초 시간 제한, JSON 처리 중 어느 단계인지 실제 오류를 확보해야 한다.

1. 문제가 발생한 동일 사용자/세션에서 Get-PnpDevice -PresentOnly가 실행되는지 확인한다.
2. entry-hw/app/src/main/core/serial/microbitDevices.ts의 discoveryScript를 동일 환경에서 실행해 출력과 소요 시간을 확인한다.
3. 앱 로그의 `microbit PnP discovery failed` 상세 오류를 확인한다. timeout, 실행파일 경로, 모듈 없음, 권한 및 JSON 파싱 오류를 구분하도록 보완한다.
4. 일반 USB 두 대와 MultiPoint TS_USB 장치 목록을 검증한다. COM 매핑을 열거 순서나 장치 수로 추정하지 않는다.

## 자동 검증

- entry-hw: `node cli/microbitDevicesTest.js`
- entry-offline: 번들 생성 및 sync 후 `node scripts/check-beomeo.js`
- 하드웨어의 레거시 타입 의존성 문제 때문에 webpack.beomeo.config.js는 transpileOnly를 사용한다.
- 오프라인 production webpack 빌드는 타입 검사 포함 통과했다.
- Windows 앱 실행/USB 통신은 아직 현장 테스트가 필요하다.

전체 장치 목록: ../entry-hw/docs/microbit-device-inventory.ko.md (26대)
구현 설명: ../entry-hw/docs/microbit-serial-selection.ko.md
