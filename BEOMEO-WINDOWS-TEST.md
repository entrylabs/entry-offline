# beomeo.5 Windows 검증 (2026-11-09)

세 저장소는 `codex/microbit-serial-windows` 브랜치를 사용한다.
Node 22.16.0 및 Yarn 1.22.22/pnpm 11.26.0은 상위 `.tools` 폴더에 준비했다.
Electron은 18.3.0, Windows x64, 네이티브 ABI는 103이다.

## 완료된 검사

- `entry-hw`: `node cli/microbitDevicesTest.js` 통과.
- 하드웨어 main router/preload/React 선택 UI production 빌드 통과.
- `entryjs`: `pnpm run dist` 통과.
- `entry-offline`: sync 및 `node scripts/check-beomeo.js` 통과.
- 오프라인 production webpack 및 타입 검사 통과.
- 공식 Entry 2.1.36 설치 파일 SHA-256이 BEOMEO.md 값과 일치함을 확인.
- 공식 설치본에서 USB 및 미디어 바이너리 추출, Windows x64 PE 검사 통과.

## 실물 조회

Electron 18.3.0에서 실제 `SerialPort.list()`가 다음 항목을 반환했다.

| 경로 | 시리얼번호 | 예상 표시 |
|---|---|---|
| COM1 | 없음 | COM1 |
| COM2 | 없음 | COM2 |
| COM14 | 990636020005282045F0227BE5DC3934000000006E052820 | microbit (E5DC3934) |

COM14를 115200 baud로 열어 기존 `localdata;\r\n` 핸드셰이크를 시험하려 했으나
`Opening COM14: Access denied`로 포트 열기가 실패했다. 기존 설치본의 엔트리와
하드웨어 창이 실행 중이었다. 기존 앱은 임의 종료하지 않았다.
이후 13:30:30의 새 앱 로그에서는 COM14 열기 성공, `localdata;2.0 20230216`
응답, 핸드셰이크 성공 및 `connected` 상태를 확인했다. 사용자는 시리얼 표시가
정상임을 확인했다. 기존 앱과 테스트 앱이 함께 실행되어 새 앱의 하드웨어 서버가
클라이언트 모드로 전환된 로그가 있으므로, 단일 앱에서 작업 화면의 블록 통신을
추가 검증해야 한다. USB 물리적 분리/재연결 검증도 아직 완료하지 않았다.

## 로그

- 빌드 로그: 상위 `.tools/offline-build.log`
- 앱의 COM 조회 로그: `%APPDATA%/entry-hw/logs/entry-hw-YYYY-MM-DD.log`
- 검색어: `microbit COM discovery`

## 재빌드

상위 폴더에서 준비된 Node를 PATH에 추가한 뒤 `entry-offline`에서 실행한다.

```powershell
$env:PATH = "$PWD/../.tools/node-v22.16.0-win-x64;$env:PATH"
$env:NODE_EXTRA_CA_CERTS = "$PWD/../.tools/windows-roots.pem"
node scripts/build-beomeo-win64.js
```

설치 파일 경로: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.5-x64-Setup.exe`.
설치 파일 생성 완료: 872,936,492 bytes.

SHA-256: `16f6ae9ff0f9844d53841f2352270fb40fd657758a63bf5d0569e76b49cc4faa`.

패키징된 app.asar의 beomeo.5 버전, 세 하드웨어 번들의 원본 일치,
PnP 조회 코드 제거 및 Windows x64 네이티브 바인딩을 검사했다.

화면 자동 검증은 컴퓨터 사용 도구가 `electron` 앱 제어를 승인하지 않아
수행하지 못했다. 기존 설치본은 교체하지 않았고, 별도 설정 폴더로 새 패키지를
실행하여 검사했다. 기존 앱과 새 테스트 앱의 동시 실행을 해소한 뒤 설치 및
단일 앱 통신 재시험이 필요하다.
