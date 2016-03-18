[![Build Status](https://travis-ci.org/entrylabs/entry-offline.svg?branch=build)](https://travis-ci.org/entrylabs/entry-offline)
[![Build status](https://ci.appveyor.com/api/projects/status/y3yyjagb93vf5lp5/branch/build?svg=true)](https://ci.appveyor.com/project/kimorkim/entry-offline/branch/build)
## Entry-Offline
 Entry-Offline is an application for running in offline environment.
 This has two version of application, Windows and MAC system.
 You can do the program and use the same feature in the environment where network access is impossible like the Entry web based  service.

## 1. Build 
    * cd entry
    * bower install 
      # if you need root authorization, use --root-allow (on mac) or run after acquiring root authorization (on windows)
    * cd build
    * npm install 
    * node build.js
      (prerequisites : wine must be installed on MAC)
    * cd build
    * cd 엔트리
    * You can see two version of app directory
      (osx64 for MAC, win64 for Windows)

## 2. Run
    * Widnows 
      - copy 'win64' directory within 'build/엔트리' to path on the target window based computer
      - Run 엔트리.exe 
    * MAC
      - copy 'osx64' directory within 'build/엔트리' to path on the target mac based computer
      - Run 엔트리.app

Copyright and License

Entry-Offline Copyright (c) 2015 Entry Labs.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
