# Beomeo pink icon

`build/icon-beomeo.png` is the shared source asset. The window icon at
`src/main/static/icon-beomeo.png` is an identical copy. `build/icon-beomeo.ico`
is converted from that PNG at 16, 24, 32, 48, 64, 128 and 256 pixels.

The Beomeo electron-builder configuration uses this ICO for the executable,
installer and uninstaller. Main and hardware windows use the matching PNG.
Executable resource editing is enabled so shortcuts use the executable icon.
