**Membuat ikon/shortcut untuk `start.cmd`**

- File skrip: `create_shortcut.ps1` (di folder project root)
- Tujuan: membuat shortcut `LAN Messenger.lnk` di Desktop yang menunjuk ke `start.cmd` dan memakai ikon dari `imageres.dll` (sistem Windows).

Cara menjalankan (PowerShell, jalankan dari folder project root):

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File .\create_shortcut.ps1
```

Jika Anda ingin mengganti ikon:
- Edit baris `IconLocation` di `create_shortcut.ps1` menjadi path ke `.ico` Anda, misal:
  `"C:\\path\\to\\icon.ico,0"`
- Atau gunakan resource dari `shell32.dll` atau `imageres.dll` dengan indeks lain.

Catatan: Script akan gagal jika `start.cmd` tidak ada di folder yang sama dengan project root.
