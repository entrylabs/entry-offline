# Beomeo micro:bit V2 development

The hardware connection window lists only the micro:bit module (ID `220301`),
including after online list refreshes. Startup always uses basic mode without
the mode chooser, even if course mode was saved previously. Manual mode changes
and loading course projects remain available during a session.

The sibling `entryjs` source adds `microbit2_get_ultrasonic` to the existing
micro:bit module, with TRIG P8 and ECHO P12 defaults. Existing pin blocks remain.
Digital I/O and ultrasonic pin selectors also include P1, P2, P3, P4 and
P10, which the custom firmware already supports as digital GPIO. Use the
`LED 기능 끄기` block before using P3, P4 or P10, and keep the display off while
those pins are in use. Clearing the LEDs does not release their pins. P0 is
also the default audio output, so avoid sound playback while using it for GPIO.
Digital I/O and ultrasonic selectors additionally include P6 and P7; these also
require `LED 기능 끄기`. P5/P11 (buttons) and P19/P20 remain excluded from selectors.
P0 is excluded from digital, ultrasonic and analog selectors to reserve it for audio.
For a single eight-segment display (including the decimal point), P1 plus P8,
P9, P12, P13, P14, P15 and P16 avoids the LED/button pins, provided SPI is unused.
The sibling `entry-hw` module terminates outgoing commands with CRLF for the
newline-based MicroPython command loop.

Build EntryJS using its configured Node/pnpm versions:

```sh
cd ../entry-hw
NODE_OPTIONS=--openssl-legacy-provider node node_modules/webpack-cli/bin/cli.js --config webpack/webpack.beomeo.config.js
cd ../entryjs
pnpm run dist
cd ../entry-offline
yarn beomeo:sync
yarn beomeo:check
yarn start
```

Run sync again after reinstalling offline dependencies or rebuilding EntryJS,
and before packaging. It copies the EntryJS dist assets and microbit2 module
into the installed offline dependencies. It also includes `mircobit-beomeo.hex`
as a separate firmware file, and copies the microbit2 configuration that adds
`Microbit V2 범어중` as the first firmware button. Stock firmware
choices remain available.
The Python source supplied by the user is preserved beside the HEX in
`../entry-hw/app/firmwares/mircobit-beomeo.py`; it has not been modified or rebuilt.

The check script exercises the actual block and transport modules with a mock
serial response. It verifies block defaults, translations, handshake strings,
repeat measurements, and a -1 measurement result. It does not verify USB,
firmware timing, sensor accuracy, or Windows behavior.

For physical testing, use a V2 board preflashed with the custom firmware.
Connect the sensor to 3V/GND, TRIG P8, ECHO P12, and select the existing micro:bit
device in the hardware connection window. To install the custom firmware there,
click `Microbit V2 범어중` and choose the board's MICROBIT drive in
the directory picker. The HEX is bundled locally; no Internet download is needed.
Wait for flashing and reconnection before testing. Check LED output, repeated distances,
and USB disconnect/reconnect. A firmware update from the stock choices would
replace the custom firmware.

## Windows x64 installer from macOS

The custom configuration `electron-builder.beomeo.json` creates an NSIS installer
with a separate app ID and a `범어중 엔트리` shortcut. It retains the original
configuration for other builds. Windows runtime and USB behavior still require
testing on a Windows PC.

The old serialport release has no published Electron 18 Windows prebuild.
Seed the ignored local binary cache using the matching modules extracted from
the official Entry 2.1.36 Windows x64 installer:

```sh
node scripts/prepare-windows-native.js /path/to/extracted/resources/app.asar
yarn dist:beomeo:win64
```

Keep the official `resources/app.asar.unpacked` directory beside `app.asar` when
seeding, because the media executables are stored there. The source installer is
`https://playentry.org/uploads/data/installers/Entry_2.1.36_Setup.exe` (SHA-256:
`64c04628a147f46b904602e0bffc3fecf8eddef764d1df8418c75741a88d0ab9`).
USB package versions were checked against the official app: bindings 9.2.9 and
node-hid 2.1.1, for Electron 18.3.0 / ABI 103 / win32-x64. The preparation script
checks package versions. The builder hook rejects binaries that are not Windows
x64 PE files. The build wrapper restores the original development binaries after
packaging, including when the packager fails. No Windows native rebuild is run
on macOS.

Output: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.4-x64-Setup.exe`.

The Beomeo build uses `build/icon-beomeo.ico` for the Windows executable,
installer and uninstaller. Window icons use `src/main/static/icon-beomeo.png`.
Executable resource editing is enabled so desktop shortcuts use the pink icon.
The original green icon assets remain available for upstream builds.
This build is unsigned. The official integrity validator remains included, so
the custom archive can be reported as modified. Check that behavior and the
school's application policy during the Windows pilot.


## Serial selection build (beomeo.4)

Build and sync the hardware main router, preload, and React selection UI together.
`dist:beomeo:win64` now uses `webpack.beomeo.config.js` for all three assets;
`beomeo:check` verifies that the installed offline copies match the source build.
The hardware bundle retains the legacy transpile-only build configuration.
The offline production webpack build completed with type checking enabled.

Windows micro:bit selection displays `microbit (8-character serial)` for present
USB and TS_USB devices. Unknown or redirected COM mappings remain blocked.
Test from Entry Offline's hardware connection window, not Entry_HW standalone.
The 26-device inventory is reference data, not a static list of connected devices.
For Windows testing, install beomeo.4, open hardware connection, select micro:bit,
and verify two devices, unplug/replug updates, and blocked redirected mappings.
This installer is unsigned; Windows execution and MultiPoint testing remain pending.
