Set WinScriptHost = CreateObject("WScript.shell")
Set argv = WScript.Arguments
If argv.Count > 0 Then
	WinScriptHost.Exec "nw.exe entry " & WScript.Arguments(0)
Else
	WinScriptHost.Exec "nw.exe entry"
End If
Set WinScriptHost = Nothing