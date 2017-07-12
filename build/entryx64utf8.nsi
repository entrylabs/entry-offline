; example1.nsi
;
; This script is perhaps one of the simplest NSIs you can make. All of the
; optional settings are left to their default settings. The installer simply 
; prompts the user asking them where to install, and drops a copy of example1.nsi
; there. 

!include MUI2.nsh
!include nsProcess.nsh

; MUI Settings / Icons
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define PRODUCT_NAME "Entry"
!define APP_NAME "Entry.exe"
!define PRODUCT_VERSION "1.5.2"
!define PRODUCT_PUBLISHER "EntryLabs"
!define PRODUCT_WEB_SITE "http://www.playentry.org/"
 
; MUI Settings / Header
;!define MUI_HEADERIMAGE
;!define MUI_HEADERIMAGE_RIGHT
;!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\orange-r-nsis.bmp"
;!define MUI_HEADERIMAGE_UNBITMAP "${NSISDIR}\Contrib\Graphics\Header\orange-uninstall-r-nsis.bmp"
 
; MUI Settings / Wizard
;!define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\orange-nsis.bmp"
;!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\orange-uninstall-nsis.bmp"

;--------------------------------

; The name of the installer
Name "$(TEXT_ENTRY)"

; The file to write
OutFile "${PRODUCT_NAME}_${PRODUCT_VERSION}_Setup.exe"

; The default installation directory
InstallDir "C:\${PRODUCT_NAME}"

; Registry key to check for directory (so if you install again, it will 
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\${PRODUCT_NAME}" "Install_Dir"

; Request application privileges for Windows Vista
RequestExecutionLevel admin


;--------------------------------

; Pages

!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchLink"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
;--------------------------------

; ´Ù±¹¾î ¼³Á¤
!insertmacro MUI_LANGUAGE "Korean" ;first language is the default language

LangString TEXT_ENTRY ${LANG_KOREAN} "¿£Æ®¸®"
LangString TEXT_ENTRY_DELETE ${LANG_KOREAN} "¿£Æ®¸® Á¦°Å"
LangString TEXT_ENTRY_TITLE ${LANG_KOREAN} "¿£Æ®¸® (ÇÊ¼ö)"
LangString TEXT_START_MENU_TITLE ${LANG_KOREAN} "½ÃÀÛ¸Þ´º¿¡ ¹Ù·Î°¡±â"
LangString TEXT_DESKTOP_TITLE ${LANG_KOREAN} "¹ÙÅÁÈ­¸é¿¡ ¹Ù·Î°¡±â"
LangString DESC_ENTRY ${LANG_KOREAN} "¿£Æ®¸® ±âº» ÇÁ·Î±×·¥"
LangString DESC_START_MENU ${LANG_KOREAN} "½ÃÀÛ¸Þ´º¿¡ ¹Ù·Î°¡±â ¾ÆÀÌÄÜÀÌ »ý¼ºµË´Ï´Ù."
LangString DESC_DESKTOP ${LANG_KOREAN} "¹ÙÅÁÈ­¸é¿¡ ¹Ù·Î°¡±â ¾ÆÀÌÄÜÀÌ »ý¼ºµË´Ï´Ù."
LangString SETUP_UNINSTALL_MSG ${LANG_ENGLISTH} "¿£Æ®¸®°¡ ÀÌ¹Ì ¼³Ä¡µÇ¾î ÀÖ½À´Ï´Ù. $\n$\r'È®ÀÎ' ¹öÆ°À» ´©¸£¸é ÀÌÀü ¹öÀüÀ» »èÁ¦ ÈÄ Àç¼³Ä¡ÇÏ°í 'Ãë¼Ò' ¹öÆ°À» ´©¸£¸é ¾÷±×·¹ÀÌµå¸¦ Ãë¼ÒÇÕ´Ï´Ù."


!insertmacro MUI_LANGUAGE "English"

LangString TEXT_ENTRY ${LANG_ENGLISTH} "Entry"
LangString TEXT_ENTRY_DELETE ${LANG_ENGLISTH} "Entry Uninstall"
LangString TEXT_ENTRY_TITLE ${LANG_ENGLISTH} "Entry (required)"
LangString TEXT_START_MENU_TITLE ${LANG_ENGLISTH} "Start menu shortcut"
LangString TEXT_DESKTOP_TITLE ${LANG_ENGLISTH} "Desktop shortcut"
LangString DESC_ENTRY ${LANG_ENGLISTH} "Entry Program"
LangString DESC_START_MENU ${LANG_ENGLISTH} "Create shortcut on start menu"
LangString DESC_DESKTOP ${LANG_ENGLISTH} "Create shortcut on desktop"
LangString SETUP_UNINSTALL_MSG ${LANG_ENGLISTH} "Entry is already installed. $\n$\nClick 'OK' to remove the previous version or 'Cancel' to cancel this upgrade."



; The stuff to install
Section $(TEXT_ENTRY_TITLE) SectionEntry

  SectionIn RO
  
  ; Set output path to the installation directory.
  ;SetOutPath $INSTDIR
  

  ; Put file there
  SetOutPath "$INSTDIR\locales"
  File "..\out\Entry-win32-x64\locales\*.*"
  
  SetOutPath "$INSTDIR\resources"
  File /r "..\out\Entry-win32-x64\resources\*.*"
  
  SetOutPath "$INSTDIR"
  File "..\out\Entry-win32-x64\*.*"
  File "icon.ico"
  
  WriteRegStr HKCR ".ent" "" "${PRODUCT_NAME}"
  WriteRegStr HKCR ".ent" "Content Type" "application/x-entryapp"
  WriteRegStr HKCR "${PRODUCT_NAME}\DefaultIcon" "" "$INSTDIR\icon.ico"
  WriteRegStr HKCR "${PRODUCT_NAME}\Shell\Open" "" "&Open"
  WriteRegStr HKCR "${PRODUCT_NAME}\Shell\Open\Command" "" '"$INSTDIR\${PRODUCT_NAME}.exe" "%1"'
  WriteRegStr HKCR "MIME\DataBase\Content Type\application/x-entryapp" "Extestion" ".ent"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM "SOFTWARE\${PRODUCT_NAME}" "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "$(TEXT_ENTRY)"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "http://www.playentry.org"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" '"$INSTDIR\$(TEXT_ENTRY_DELETE).exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" '"$INSTDIR\icon.ico"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoRepair" 1
  WriteUninstaller "$(TEXT_ENTRY_DELETE).exe"
  
SectionEnd

; Optional section (can be disabled by the user)
Section $(TEXT_START_MENU_TITLE) SectionStartMenu

  CreateDirectory "$SMPROGRAMS\EntryLabs\${PRODUCT_NAME}"
  CreateShortCut "$SMPROGRAMS\EntryLabs\${PRODUCT_NAME}\$(TEXT_ENTRY_DELETE).lnk" "$INSTDIR\$(TEXT_ENTRY_DELETE).exe" "" "$INSTDIR\$(TEXT_ENTRY_DELETE).exe" 0
  CreateShortCut "$SMPROGRAMS\EntryLabs\${PRODUCT_NAME}\$(TEXT_ENTRY).lnk" "$INSTDIR\${PRODUCT_NAME}.exe" "" "$INSTDIR\icon.ico" 0
  
SectionEnd

;--------------------------------

; Optional section (can be disabled by the user)
Section $(TEXT_DESKTOP_TITLE) SectionDesktop

  CreateShortCut "$DESKTOP\$(TEXT_ENTRY).lnk" "$INSTDIR\${PRODUCT_NAME}.exe" "" "$INSTDIR\icon.ico" 0
  
SectionEnd

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${SectionEntry} $(DESC_ENTRY)
    !insertmacro MUI_DESCRIPTION_TEXT ${SectionStartMenu} $(DESC_START_MENU)
    !insertmacro MUI_DESCRIPTION_TEXT ${SectionDesktop} $(DESC_DESKTOP)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------

; Uninstaller

Section "Uninstall"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
  DeleteRegKey HKLM "SOFTWARE\${PRODUCT_NAME}"
  DeleteRegKey HKCR ".ent"
  DeleteRegKey HKCR "${PRODUCT_NAME}"
  DeleteRegKey HKCR "MIME\DataBase\Content Type\application/x-entryapp"

  ; Remove files and uninstaller
  Delete $INSTDIR\*

  ; Remove shortcuts, if any
  Delete "$SMPROGRAMS\EntryLabs\${PRODUCT_NAME}\*.*"
  
  Delete "$DESKTOP\$(TEXT_ENTRY).lnk"

  ; Remove directories used
  RMDir "$SMPROGRAMS\EntryLabs\${PRODUCT_NAME}"
  RMDir /r "$INSTDIR"

SectionEnd

Function LaunchLink
  Exec "${APP_NAME}"
FunctionEnd


Function .onInit
	${nsProcess::FindProcess} "${APP_NAME}" $R0
	StrCmp $R0 0 mfound notRunning
	mfound:
		${nsProcess::KillProcess} "${APP_NAME}" $R0
	notRunning:
  
	ReadRegStr $R0 HKLM \
	"Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
	"UninstallString"
	StrCmp $R0 "" done
	
    ReadRegStr $R1 HKLM "SOFTWARE\${PRODUCT_NAME}" "Install_Dir" 
    StrCmp $R1 "" done

	MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
	$(SETUP_UNINSTALL_MSG) \
	IDOK uninst
	Abort
 
	;Run the uninstaller
	uninst:
		ClearErrors
		;ExecWait '$R0 _?=$INSTDIR'
		ExecWait '$R0 _?=$R1'

		;IfErrors no_remove_uninstaller done
		;no_remove_uninstaller:
		IfErrors 0 +2
			Goto no_remove_uninstaller
			RMDir /r /REBOOTOK $R1 
			Goto done
	  
	no_remove_uninstaller:
		DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
		DeleteRegKey HKLM "SOFTWARE\${PRODUCT_NAME}"
		DeleteRegKey HKCR ".ent"
		DeleteRegKey HKCR "${PRODUCT_NAME}"
		DeleteRegKey HKCR "MIME\DataBase\Content Type\application/x-entryapp"

	done:
 
FunctionEnd