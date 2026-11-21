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

Output: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.9-x64-Setup.exe`.

The Beomeo build uses `build/icon-beomeo.ico` for the Windows executable,
installer and uninstaller. Window icons use `src/main/static/icon-beomeo.png`.
Executable resource editing is enabled so desktop shortcuts use the pink icon.
The original green icon assets remain available for upstream builds.
This build is unsigned. The official integrity validator remains included, so
the custom archive can be reported as modified. Check that behavior and the
school's application policy during the Windows pilot.


## Serial selection build (beomeo.9)

Windows keeps the COM paths from SerialPort.list(). The bundled read-only
MicrobitIdentity.exe uses SetupAPI and Configuration Manager to trace the exact
COM devnode to USB/TS_USB serials through real parent links and the COM or actual micro:bit composite parent ContainerID.
No PowerShell or PnpDevice command runs. Conflicting identities and shared hub
containers are never used to guess a board. Missing identities keep COM labels.
Only 48-hex serials starting with 990636020005282 are accepted; characters 25-32
form the short label, without checking an inventory of registered boards.

The Windows build compiles the x64 helper using the .NET Framework 4 compiler.
Sync/check also copy and verify the helper and its .config. The entire entry-hw
package, including the helper, is unpacked from ASAR for execution.
Run node ../entry-hw/cli/microbitDevicesTest.js and
node ../entry-hw/cli/windowsMicrobitIdentityTest.js for regression checks.
Student SESSION IDs are tested with simulated device relationships; actual
MultiPoint parent/container visibility still requires a student-PC test.

Build and sync the hardware main router, preload, and React selection UI together.
`dist:beomeo:win64` uses `webpack.beomeo.config.js` for all three assets;
`beomeo:check` verifies the installed offline copies match the source build.
Logs: `%APPDATA%/entry-hw/logs/entry-hw-YYYY-MM-DD.log`; search for
`microbit COM discovery` for raw port metadata, elapsed time and error details.

After installation, verify serial labels, COM labels without serials, direct COM
connection, and removal of unplugged COM ports with physical boards.

The raw Windows identity nodes, per-property errors and final resolved COM labels
are included in COM discovery logs. Native failures include executable, code, stderr
and stack under `microbit COM identity failed`.

## beomeo.7 correction

The captured session-15 diagnostic showed that a redirected COM interface has a
new ContainerID, while its actual micro:bit composite parent retains the TS_USB
board ContainerID. The resolver now considers that specific composite ancestor,
including VID_0D28/PID_0204 with an optional REV field. It never uses a hub's or
session enumerator's container. The actual COM74 -> E5DC3934 relationship is a
regression fixture, not a mapping table in the app. Renumbering COMs and reversing
enumeration order preserve the identity results. Cloud/server routing and the
unresolved B5E79A42 execution failure are outside this correction.

## beomeo.9 additions

Student session 4 proved that the original serial-bearing TS_USB devnode can be
absent from current enumeration even while its active virtual composite ContainerID
is available. The helper now reads serial identity metadata from the fixed USB and
TS_USB registry roots, restricted to validated serial key names whose ContainerID
matches a currently enumerated COM or actual micro:bit composite node. Registry
metadata does not establish presence or create COM entries. Conflicting identities
are rejected and USB/TS_USB copies of the same serial are deduplicated. The exact
student capture and user-confirmed registry values are covered by regression tests.

The main title is `범어중엔트리 v0.9`; the hardware title adds ` - 하드웨어`.
The dedicated pink desktop/start-menu icon and Korean product name from beomeo.8
are retained. B5E79A42 execution and cloud/server routing are not changed here.
