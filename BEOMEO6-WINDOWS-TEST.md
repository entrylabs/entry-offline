# beomeo.6 Windows build — 2026-11-09

Installer: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.6-x64-Setup.exe`

- Size: 872,508,412 bytes.
- SHA-256: `650c9fe1a912c6642cfd1c8e84758cda24c625a49f5b06da175e7df6f5711902`.
- Build completed with exit code 0; log: `../.tools/offline-build-beomeo6.log`.

## Serial identity change

The COM path remains the path from SerialPort.list(). A read-only Windows helper
enumerates present device nodes with SetupAPI and reads real parent links with
Configuration Manager and ContainerID with SetupDiGetDevicePropertyW. The resolver
starts at the COM's exact InstanceId and accepts a unique full USB/TS_USB serial
through those relationships. It does not pair devices by SESSION number, list order,
COM number, device count, or an inventory of known boards. Conflicting identities,
cycles, and shared/non-device container IDs cannot produce a serial label.

The family rule is 48 hexadecimal characters starting with `990636020005282`.
Characters 25–32 form the short label. SESSION/location IDs are not displayed as
serials, including in tooltips. A COM without a verified serial remains connectable
through the existing handshake. The COM list is refreshed after the native query
to reject ports unplugged during discovery.

This supersedes beomeo.5's policy of not following parent relationships, in response
to the user's request to trace the real board behind the student-PC COM SESSION IDs.
No PowerShell/PnpDevice command runs in the application.

## Completed validation

- `node ../entry-hw/cli/microbitDevicesTest.js`: serial family/short labels,
  SESSION ID rejection, exact parent/container identity, reordered snapshots,
  ambiguity/conflicts, native failure fallback, missing COM rejection and scanner
  integration passed. The two student COM IDs use simulated OS relationships.
- `node ../entry-hw/cli/windowsMicrobitIdentityTest.js`: native invocation,
  unpacked ASAR executable path, timeout and malformed snapshot handling passed.
- Windows x64 helper compilation and real read-only enumeration succeeded on the
  build PC. The packaged helper also ran successfully (9 ms enumeration).
- Hardware main/preload/React production build passed.
- Offline sync and `scripts/check-beomeo.js` passed, including exact helper copies.
- Offline production webpack/type checking passed.
- Windows x64 native-module PE checks passed.
- `node scripts/check-beomeo-package.js` passed: packaged beomeo.6 version,
  exact hardware/helper assets, matching pink window PNG and all seven EXE icon
  sizes, plus pink installer icon resources.

## Icon assets

`build/icon-beomeo.png` is the shared source. The main/hardware window PNG is an
identical copy. The ICO was regenerated at 16/24/32/48/64/128/256 px and is configured
for the executable, installer and uninstaller. Installer generation succeeded.

## Remaining physical validation

This build has not yet been run in the student's MultiPoint session. That session
must expose the actual parent or same-container relationship between each COM
devnode and its TS_USB board. Verify the two expected short serials, each board's
communication, and USB unplug/replug behavior after installing this version.
The build PC currently had no micro:bit attached during native-helper verification.

If a student COM still lacks a serial, collect `%APPDATA%/entry-hw/logs/entry-hw-YYYY-MM-DD.log`:
`microbit COM discovery` includes raw/current COM records, native parent/container
nodes and resolved labels. `microbit COM identity failed` includes native invocation
errors. The helper can also emit the same read-only JSON directly from
`resources/app.asar.unpacked/node_modules/entry-hw/app/native/MicrobitIdentity.exe`.
