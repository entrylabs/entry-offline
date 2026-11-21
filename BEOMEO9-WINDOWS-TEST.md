# 범어중엔트리 v0.9 — 2026-11-09

Installer: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.9-x64-Setup.exe`

- Size: 872,556,374 bytes.
- SHA-256: `a36b7ba40ecb2b01b01bf492e37756d9f284a9e102be18bd4ef5e7c0a1161abb`.
- Final build log: `../.tools/offline-build-beomeo9-final.log`, exit 0.
- Final package/native-helper/icon verification passed (native enumeration 19 ms).

## Included changes

The native helper supplements missing original USB/TS_USB serial-bearing devnodes
with read-only registry identity metadata from the fixed micro:bit USB/TS_USB roots.
Only validated serial keys matching an active COM's own or actual micro:bit composite
parent ContainerID are included. Historical registry records never create ports or
establish presence. Duplicate USB/TS_USB serials collapse to one identity; conflicting
serials for a container are rejected. No fixed COM, session-number or board inventory
mapping is used.

The captured session-4 COM37 diagnostic plus user-confirmed registry records now
resolves to microbit (828EF1B5). Tests cover the missing-original-node case, duplicate
records, wrong containers, absent COMs, conflicts, and COM renumbering. The earlier
actual session-15 composite-parent fixture and native invocation/JSON tests also pass.
The build PC additionally returned a real matching USB registry identity for its
attached E5DC3934 board, with no registry errors.

The main window title is `범어중엔트리 v0.9`; the hardware window title is
`범어중엔트리 v0.9 - 하드웨어`. Korean product/shortcut names and dedicated hot-pink
desktop/start-menu ICO resources from version 8 are retained and verified.

The initial final-package check reproduced a cold native-process startup exceeding
the previous 5-second limit. Runtime and package-check deadlines are now bounded at
15 seconds, and native failure logs include killed/signal details. After rebuilding,
all package checks passed. The failed preliminary log `offline-build-beomeo9.log`
is not the final build result.

Hardware production build, offline sync/check and offline production/type checking
passed. Runtime hardware connection and cloud/server routing were not changed;
B5E79A42 execution failure remains a separate investigation. Live retesting of the
new installer in the student's MultiPoint session is still required.
