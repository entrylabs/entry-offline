; example1.nsi
;
; This script is perhaps one of the simplest NSIs you can make. All of the
; optional settings are left to their default settings. The installer simply 
; prompts the user asking them where to install, and drops a copy of example1.nsi
; there. 

;--------------------------------

; The name of the installer
Name "Entry"

; The file to write
OutFile "Setup.exe"

; The default installation directory
InstallDir c:\Entry

; Registry key to check for directory (so if you install again, it will 
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\Entry" "Install_Dir"

; Request application privileges for Windows Vista
RequestExecutionLevel admin


;--------------------------------

; Pages

Page components
Page directory
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

;--------------------------------



; The stuff to install
Section "Entry (required)"

  SectionIn RO
  
  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there
  File "..\*.*"
  
  SetOutPath "$INSTDIR\locales"
  File "..\locales\*.*"
  
  SetOutPath "$INSTDIR\entry"
  File /r "..\entry\*.*"
  
  WriteRegStr HKCR ".ent" "" "Entry"
  WriteRegStr HKCR ".ent" "Content Type" "application/x-entryapp"
  WriteRegStr HKCR "Entry\DefaultIcon" "" "$INSTDIR\icon.ico"
  WriteRegStr HKCR "Entry\Shell\Open" "" "&Open"
  WriteRegStr HKCR "Entry\Shell\Open\Command" "" '"$INSTDIR\nw.exe" "$INSTDIR\entry" "%1"'
  WriteRegStr HKCR "MIME\DataBase\Content Type\application/x-entryapp" "Extestion" ".ent"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM "SOFTWARE\Entry" "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry" "DisplayName" "Entry"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry" "DisplayIcon" '"$INSTDIR\icon.ico"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry" "NoRepair" 1
  WriteUninstaller "uninstall.exe"
  
SectionEnd

; Optional section (can be disabled by the user)
Section "Start Menu Shortcuts"

  CreateDirectory "$SMPROGRAMS\Entry"
  CreateShortCut "$SMPROGRAMS\Entry\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
  CreateShortCut "$SMPROGRAMS\Entry\Entry.lnk" "$INSTDIR\Entry.vbs" "" "$INSTDIR\icon.ico" 0
  
SectionEnd

;--------------------------------

; Optional section (can be disabled by the user)
Section "Desktop Shortcuts"

  CreateShortCut "$DESKTOP\Entry.lnk" "$INSTDIR\Entry.vbs" "" "$INSTDIR\icon.ico" 0
  
SectionEnd

;--------------------------------

; Uninstaller

Section "Uninstall"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Entry"
  DeleteRegKey HKLM SOFTWARE\Entry  
  DeleteRegKey HKCR ".ent"
  DeleteRegKey HKCR "Entry"
  DeleteRegKey HKCR "MIME\DataBase\Content Type\application/x-entryapp"

  ; Remove files and uninstaller
  Delete $INSTDIR\*

  ; Remove shortcuts, if any
  Delete "$SMPROGRAMS\Entry\*.*"

  ; Remove directories used
  RMDir "$SMPROGRAMS\Entry"
  RMDir /r "$INSTDIR"

SectionEnd
