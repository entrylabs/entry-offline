# beomeo.8 — Korean app title and explicit pink shortcut icon

Installer: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.8-x64-Setup.exe`

- Size: 872,556,083 bytes.
- SHA-256: `dd6c8a2c49db34c78fd951e45d2281e3c4cd2f8f8066d590e63251d714783772`.

Main window title: `범어중엔트리`. Hardware window title:
`범어중엔트리 - 하드웨어`, with HTML page-title replacement suppressed.
Windows EXE product/file description and installer product name are also Korean.
The internal executable filename, app identity and profile productName remain
compatible with existing installations. The runtime AppUserModelID now matches
the installer shortcut identity.

Desktop/start-menu shortcut name: `범어중엔트리`. Reinstallation recreates the
desktop shortcut and the NSIS custom hook sets both shortcuts' icon location to
`$INSTDIR/resources/beomeo-hot-pink.ico`, instead of a cached older executable icon.
The dedicated ICO is an exact copy of the shared hot-pink source ICO.

The current build PC's existing public desktop shortcut was also updated:
`C:/Users/Public/Desktop/범어중엔트리.lnk` now references the verified matching ICO
at `C:/ProgramData/Entry Beomeo/beomeo-hot-pink.ico`. Its original installed EXE
target was preserved. The old shortcut was backed up under `../.tools`.
The installed app itself was not replaced or closed during this update; window
title changes require launching the new installation.

## Validation

- Hardware build, offline sync/check and offline production/type checking passed.
- App metadata, Korean EXE descriptions, packaged window-title string and exact
  pink window/EXE/installer/dedicated-shortcut icon assets passed package checks.
- The final packaged native helper executed successfully (10 ms enumeration).
- The legacy NSIS compiler initially failed with `Bad text encoding` when reading
  a Korean product-name script from stdin. The repo-owned builder wrapper now adds
  a UTF-8 BOM. Repackaging succeeded without modifying installed dependencies.
- Full compile log: `../.tools/offline-build-beomeo8.log` (first NSIS attempt failed).
- Successful installer log: `../.tools/offline-build-beomeo8-package.log` (exit 0).
- `node scripts/check-beomeo-package.js` passed on the final installer.

Serial-resolution behavior remains the confirmed beomeo.7 composite-parent fix.
The later report of COM-only labels after installation requires a fresh installed
version/start-time and discovery log; this branding update does not claim that
unreproduced report is fixed. B5E79A42 execution/cloud routing remains outside scope.
