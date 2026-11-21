# beomeo.7 — confirmed serial-label correction only

Installer: `dist/beomeo-windows/Entry-Beomeo-2.1.36-beomeo.7-x64-Setup.exe`

- Size: 872,508,443 bytes.
- SHA-256: `f62ea42db33dab966649fe6891c9fe64449be499cbdad038bbb49972618ec6d8`.
- Final build log: `../.tools/offline-build-beomeo7-serial-only.log` (exit code 0).
- The earlier `offline-build-beomeo7.log` was interrupted while narrowing the
  scope; the final installer was rebuilt with only the confirmed label correction.

## Reproduced cause

The actual student-session-15 diagnostic exposes COM74 with its own interface
ContainerID `a01468d9-dc07-11f1-884b-c87f54683ed6`. Its real micro:bit composite
parent (`USB/VID_0D28&PID_0204&REV_1000/...`) has ContainerID
`c24bf16d-82d0-5ae2-83d4-d90aac06cbd9`, exactly matching the original TS_USB
board whose full serial shortens to E5DC3934. Version 6 checked only the COM's
own container and therefore missed this relationship.

The resolver now includes the ContainerID of a real micro:bit composite ancestor.
The actual parent chain and matching device container determine identity; COM
numbers, SESSION numbers and list order do not. Generic hubs and shared session
enumerators are excluded. Ambiguous/conflicting identities remain COM labels.

There is no runtime COM74/E5DC3934 mapping. The captured values exist only in a
CLI regression fixture, and the package check verifies those constants are not
present in the shipped main router. The connection path remains the original COM.

## Scope

The user explicitly limited this correction to the confirmed serial-label issue.
Cloud/server routing, communication/handshake logic and the unresolved B5E79A42
execution failure were left unchanged. Additional diagnostic code initially
prepared for those investigations was removed before the final rebuild.

## Validation

- The actual captured fixture failed under the version-6 resolver (COM74 label)
  and passes under this resolver (microbit E5DC3934 label).
- COM renumbering to COM900/COM901 and reversed enumeration preserve correct labels.
- Multiple redirected boards, missing composite parents, conflicting containers,
  invalid/shared hub containers, unplugged COM rejection and legacy paths passed.
- Native helper invocation, unpacked executable paths, timeout and malformed
  snapshot tests passed.
- Hardware production build, offline sync/check and offline production/type
  checking passed.
- Final package check passed: version 7, exact hardware/native-helper assets,
  absence of hardcoded fixture identifiers and pink executable/installer/window
  icons. The shipped native helper ran successfully (10 ms enumeration).

The supplied student diagnostic proves the identity relationship; installation
and live communication on that student station have not yet been retested.
