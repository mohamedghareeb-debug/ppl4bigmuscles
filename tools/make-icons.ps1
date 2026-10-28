# Draws the app icons (barbell + up arrow) into ..\icons. Run: powershell -File tools\make-icons.ps1
Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot '..\icons'
New-Item -ItemType Directory -Force $out | Out-Null

function Draw-Icon([int]$size, [string]$name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(17, 18, 20))
  $s = $size / 100.0
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 239, 236))
  $blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(57, 135, 229))

  # barbell
  $g.FillRectangle($white, 22 * $s, 61 * $s, 56 * $s, 4 * $s)
  foreach ($x in 26, 70) { $g.FillRectangle($white, $x * $s, 50 * $s, 5 * $s, 26 * $s) }
  foreach ($x in 19, 77) { $g.FillRectangle($white, $x * $s, 55 * $s, 4 * $s, 16 * $s) }

  # up arrow
  $pts = @(
    (New-Object System.Drawing.PointF (50 * $s), (20 * $s)),
    (New-Object System.Drawing.PointF (63 * $s), (35 * $s)),
    (New-Object System.Drawing.PointF (55 * $s), (35 * $s)),
    (New-Object System.Drawing.PointF (55 * $s), (47 * $s)),
    (New-Object System.Drawing.PointF (45 * $s), (47 * $s)),
    (New-Object System.Drawing.PointF (45 * $s), (35 * $s)),
    (New-Object System.Drawing.PointF (37 * $s), (35 * $s))
  )
  $g.FillPolygon($blue, $pts)

  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

Draw-Icon 180 'apple-touch-icon.png'
Draw-Icon 192 'icon-192.png'
Draw-Icon 512 'icon-512.png'
Write-Output "Icons written to $out"
