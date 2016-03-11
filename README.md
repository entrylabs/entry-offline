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
