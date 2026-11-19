# Generates dark, gold-accented placeholder artwork for project cards
# and certificate cards (public/projects & public/certificates were empty,
# so every card rendered a broken/gray placeholder image).
# Run: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\generate-images.ps1
Add-Type -AssemblyName System.Drawing

$projectsDir = Join-Path $PSScriptRoot "..\public\projects"
$certsDir = Join-Path $PSScriptRoot "..\public\certificates"
New-Item -ItemType Directory -Force -Path $projectsDir | Out-Null
New-Item -ItemType Directory -Force -Path $certsDir | Out-Null

function Save-Jpeg($bmp, $path) {
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]88)
  $bmp.Save($path, $codec, $ep)
}

function Draw-Project($path, $label, $title, $accentRgb, $variant) {
  $W = 800; $H = 450
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  # Background gradient
  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 20, 20, 22),
    [System.Drawing.Color]::FromArgb(255, 8, 8, 9), 50)
  $g.FillRectangle($bg, $rect)

  $parts = ($accentRgb -split ',') | ForEach-Object { [int]$_ }
  $ar = $parts[0]; $ag = $parts[1]; $ab = $parts[2]

  # Accent glow (position varies per project)
  $positions = @(@(520, -110), @(-130, 210), @(540, 230), @(280, -150), @(-90, -90), @(470, 60))
  $p = $positions[$variant % $positions.Length]
  $glowBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(60, $ar, $ag, $ab))
  $g.FillEllipse($glowBrush, $p[0], $p[1], 400, 400)

  # Subtle grid texture
  $linePen = New-Object System.Drawing.Pen(
    [System.Drawing.Color]::FromArgb(12, 255, 255, 255), 1)
  for ($x = 0; $x -le $W; $x += 80) { $g.DrawLine($linePen, $x, 0, $x, $H) }
  for ($y = 0; $y -le $H; $y += 80) { $g.DrawLine($linePen, 0, $y, $W, $y) }

  # Gold decorative rings
  $ringPen = New-Object System.Drawing.Pen(
    [System.Drawing.Color]::FromArgb(45, 201, 169, 110), 1.5)
  $ringPos = @( @(600, 260, 140), @(70, 50, 120), @(610, 40, 110),
                @(90, 250, 150), @(620, 240, 120), @(60, 60, 130) )
  $r = $ringPos[$variant % $ringPos.Length]
  $g.DrawEllipse($ringPen, $r[0], $r[1], $r[2], $r[2])
  $g.DrawEllipse($ringPen, $r[0] + 18, $r[1] + 18, $r[2] - 36, $r[2] - 36)

  # Small label + underline (top-left)
  $goldBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(201, 169, 110))
  $labelFont = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($label.ToUpper(), $labelFont, $goldBrush, 48, 40)
  $g.DrawLine($ringPen, 48, 68, 128, 68)

  # Centered title (manual line breaks)
  $titleBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(255, 245, 245, 245))
  $titleFont = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $lw = $W - 80
  $lh = $H - 60
  $layout = New-Object System.Drawing.RectangleF(40, 30, $lw, $lh)
  $g.DrawString($title, $titleFont, $titleBrush, $layout, $sf)

  Save-Jpeg $bmp $path
  $g.Dispose(); $bmp.Dispose()
  Write-Host "  -> $path"
}

function Draw-Cert($path, $title, $issuer, $year) {
  $W = 800; $H = 600
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  # Background gradient
  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 18, 18, 20),
    [System.Drawing.Color]::FromArgb(255, 9, 9, 10), 60)
  $g.FillRectangle($bg, $rect)

  # Soft gold glow behind the seal
  $glowBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(40, 201, 169, 110))
  $g.FillEllipse($glowBrush, [int]($W / 2 - 110), 60, 220, 220)

  # Double gold frame
  $framePen = New-Object System.Drawing.Pen(
    [System.Drawing.Color]::FromArgb(170, 201, 169, 110), 2)
  $framePen2 = New-Object System.Drawing.Pen(
    [System.Drawing.Color]::FromArgb(80, 201, 169, 110), 1)
  $g.DrawRectangle($framePen, 24, 24, $W - 48, $H - 48)
  $g.DrawRectangle($framePen2, 34, 34, $W - 68, $H - 68)

  # Seal with star
  $g.DrawEllipse($framePen, [int]($W / 2 - 45), 90, 90, 90)
  $goldBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(201, 169, 110))
  $starFont = New-Object System.Drawing.Font('Segoe UI', 30)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $sealRect = New-Object System.Drawing.RectangleF([int]($W / 2 - 45), 90, 90, 90)
  $g.DrawString([char]0x2605, $starFont, $goldBrush, $sealRect, $sf)

  # Caption
  $capFont = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Bold)
  $capRect = New-Object System.Drawing.RectangleF(0, 205, $W, 24)
  $g.DrawString('CERTIFICATE OF ACHIEVEMENT', $capFont, $goldBrush, $capRect, $sf)
  $g.DrawLine($framePen, [int]($W / 2 - 60), 248, [int]($W / 2 + 60), 248)

  # Title
  $titleBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(255, 245, 245, 245))
  $titleFont = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Bold)
  $tw = $W - 120
  $titleRect = New-Object System.Drawing.RectangleF(60, 265, $tw, 120)
  $g.DrawString($title, $titleFont, $titleBrush, $titleRect, $sf)

  # Issuer + year
  $issuerFont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
  $issuerRect = New-Object System.Drawing.RectangleF(0, 415, $W, 30)
  $g.DrawString($issuer, $issuerFont, $goldBrush, $issuerRect, $sf)

  $grayBrush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(150, 156, 163, 167))
  $yearFont = New-Object System.Drawing.Font('Segoe UI', 12)
  $yearRect = New-Object System.Drawing.RectangleF(0, 450, $W, 26)
  $g.DrawString($year, $yearFont, $grayBrush, $yearRect, $sf)

  # Corner accents at the four inner frame corners
  $mx = $W - 48
  $my = $H - 48
  $corners = @(
    @(48, 48, 1, 1), @($mx, 48, -1, 1), @(48, $my, 1, -1), @($mx, $my, -1, -1)
  )
  foreach ($c in $corners) {
    $x = $c[0]; $y = $c[1]; $dx = $c[2]; $dy = $c[3]
    $g.DrawLine($framePen, $x, $y, $x + 16 * $dx, $y)
    $g.DrawLine($framePen, $x, $y, $x, $y + 16 * $dy)
  }

  Save-Jpeg $bmp $path
  $g.Dispose(); $bmp.Dispose()
  Write-Host "  -> cert: $path"
}

Write-Host "Generating project images..."
$projects = @(
  @{ F = 'irrigation.jpg';  L = 'Featured Project';   T = "AI-Powered Smart`nIrrigation System";   A = '201,169,110' },
  @{ F = 'portfolio.jpg';   L = 'Featured Project';   T = "Immersive 3D`nPortfolio";               A = '139,92,246'  },
  @{ F = 'analytics.jpg';   L = 'Project Case Study'; T = "Machine Learning`nAnalytics Dashboard"; A = '56,189,248'  },
  @{ F = 'smarthome.jpg';   L = 'Project Case Study'; T = "Smart Home`nAutomation System";         A = '45,212,191'  },
  @{ F = 'network.jpg';     L = 'Project Case Study'; T = "Network Monitoring`nPlatform";          A = '251,146,60'  },
  @{ F = 'chatbot.jpg';     L = 'Project Case Study'; T = "AI Chat`nAssistant";                    A = '136,206,2'   }
)
$i = 0
foreach ($p in $projects) {
  Draw-Project (Join-Path $projectsDir $p.F) $p.L $p.T $p.A $i
  $i++
}

Write-Host "Generating certificate images..."
$certs = @(
  @{ F = 'ml.jpg';         T = "Machine Learning`nSpecialization";   I = 'DeepLearning.AI';     Y = '2024' },
  @{ F = 'fullstack.jpg';  T = "Full Stack Web`nDevelopment";        I = 'Meta';                Y = '2023' },
  @{ F = 'ccna.jpg';       T = "Cisco Certified Network`nAssociate"; I = 'Cisco';               Y = '2023' },
  @{ F = 'aws.jpg';        T = "AWS Cloud`nPractitioner";            I = 'Amazon Web Services'; Y = '2024' },
  @{ F = 'iot.jpg';        T = "IoT and Embedded`nSystems";          I = 'Coursera';            Y = '2023' },
  @{ F = 'tensorflow.jpg'; T = "TensorFlow`nDeveloper";              I = 'Google';              Y = '2024' }
)
foreach ($c in $certs) {
  Draw-Cert (Join-Path $certsDir $c.F) $c.T $c.I $c.Y
}

Write-Host "Done."
