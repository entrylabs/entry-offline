![Entry Logo](src/renderer/resources/images/about/logo.png)
---
## What is Entry-Offline ?

엔트리 오프라인은 [엔트리 웹 사이트](https://playentry.org/)에 접속할 수 없는 오프라인 환경에서도 엔트리를 사용할 수 있도록 제작된 프로그램입니다.  
엔트리 오프라인은 [Electron](https://electronjs.org/) 기반으로 만들어졌으며,
[entryjs](https://github.com/entrylabs/entryjs) 와 [entry-hw](https://github.com/entrylabs/entry-hw) 프로젝트를 [bower](https://bower.io/) 를 통해 내장하고 있습니다.

## Prerequisite

#### Node.js
Node.js 는 개발 전반을 위해 반드시 설치가 되어야하는 프레임워크입니다. 작업 전 가장 먼저 설치합니다.
> https://nodejs.org 
  
#### Yarn(optional)
엔트리 오프라인은 yarn 을 통해 의존성을 관리 중입니다. npm 을 사용해도 문제는 없습니다.

#### Bower
엔트리 오프라인의 정적 라이브러리들은 `bower` 를 통해 관리 합니다.

#### Node-gyp
엔트리 오프라인에 포함된 엔트리 하드웨어는 [node-serialport](https://github.com/node-serialport/node-serialport) 를 사용합니다.  
해당 라이브러리를 사용하기 위해서는 C++, python 빌드 환경과 [node-gyp](https://github.com/nodejs/node-gyp) 라이브러리가 필요합니다.  
빌드에 대한 자세한 사항은 [node-gyp#installation](https://github.com/nodejs/node-gyp#installation) 을 참고해 주세요.

먼저 빌드 환경을 구성해야 합니다.  
윈도우의 경우, 관리자 권한 명령 프롬프트에서
```bash
npm install --global --production windows-build-tools
```
로 한번에 설치할 수 있습니다. [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools) 를 참고해 주세요.

```bash
npm install --global node-gyp
```

## Structure

![entry offline structure](https://user-images.githubusercontent.com/40051225/52943796-44528f00-33b1-11e9-9ccf-a4336e60b81d.png)

대략적인 구조는 위와 같습니다. 자세한 디렉토리 구조는 [Entry Docs](https://entrylabs.github.io/docs/guide/entry-offline/2017-12-21-project_structure.html) 를 참고해주세요.

## Usage

엔트리 오프라인은 `main process` 와 `renderer process` 가 전부 webpack build 되어있습니다.  
그러므로 실제 실행시에는 빌드 후 실행해야 합니다.

> 첫번째 쉘
```bash
yarn watch
```

> 두번째 쉘 (웹팩 빌드 완료 후)
```bash
yarn start
```

## Entry Offline Full Documentation

[Entry Docs](https://entrylabs.github.io/docs/guide/entry-offline/2017-12-20-getting_started.html)


## Copyright and License

Entry-Offline Copyright(c) 2018 CONNECT.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
