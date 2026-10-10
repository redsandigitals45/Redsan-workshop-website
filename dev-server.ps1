param(
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "RedSan Local Server running at http://localhost:$Port/" -ForegroundColor Green
Write-Host "Workshops Page: http://localhost:$Port/workshops/" -ForegroundColor Cyan

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".xml"   = "application/xml; charset=utf-8"
    ".txt"   = "text/plain; charset=utf-8"
    ".webp"  = "image/webp"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".mp4"   = "video/mp4"
    ".webm"  = "video/webm"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".pdf"   = "application/pdf"
}

function Handle-Request($context) {
    $req = $context.Request
    $res = $context.Response
    $isHead = ($req.HttpMethod -eq "HEAD")

    try {
        $rawPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
        if ($rawPath.StartsWith("/")) {
            $rawPath = $rawPath.Substring(1)
        }

        $filePath = Join-Path $Root $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)

        # Check if it's a directory
        if ([System.IO.Directory]::Exists($filePath)) {
            if (-not $req.Url.AbsolutePath.EndsWith("/")) {
                $res.StatusCode = 301
                $res.RedirectLocation = $req.Url.AbsolutePath + "/"
                $res.Close()
                return
            }
            $filePath = Join-Path $filePath "index.html"
        } elseif (-not [System.IO.File]::Exists($filePath)) {
            if ([System.IO.File]::Exists($filePath + ".html")) {
                $filePath = $filePath + ".html"
            } elseif ([System.IO.File]::Exists((Join-Path $filePath "index.html"))) {
                $filePath = Join-Path $filePath "index.html"
            }
        }

        if (-not [System.IO.File]::Exists($filePath)) {
            $res.StatusCode = 404
            $notFoundPage = Join-Path $Root "404.html"
            if ([System.IO.File]::Exists($notFoundPage)) {
                $bytes = [System.IO.File]::ReadAllBytes($notFoundPage)
                $res.ContentType = "text/html; charset=utf-8"
                $res.ContentLength64 = $bytes.Length
                if (-not $isHead) {
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $res.ContentType = "text/plain; charset=utf-8"
                $res.ContentLength64 = $msg.Length
                if (-not $isHead) {
                    $res.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $res.Close()
            return
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $res.ContentType = $contentType
        $res.AddHeader("Accept-Ranges", "bytes")
        $res.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

        $fileInfo = [System.IO.FileInfo]::new($filePath)
        $fileLen = $fileInfo.Length

        $rangeHeader = $req.Headers["Range"]
        if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
            $rangeSpec = $rangeHeader.Substring(6).Split("-")
            [long]$start = 0
            [long]$end = $fileLen - 1

            if ($rangeSpec[0] -ne "") {
                $start = [long]::Parse($rangeSpec[0])
            }
            if ($rangeSpec.Length -gt 1 -and $rangeSpec[1] -ne "") {
                $end = [long]::Parse($rangeSpec[1])
            }

            if ($start -gt $end -or $start -ge $fileLen) {
                $res.StatusCode = 416
                $res.AddHeader("Content-Range", "bytes */$fileLen")
                $res.Close()
                return
            }

            if ($end -ge $fileLen) {
                $end = $fileLen - 1
            }

            $length = $end - $start + 1
            $res.StatusCode = 206
            $res.AddHeader("Content-Range", "bytes $start-$end/$fileLen")
            $res.ContentLength64 = $length

            if (-not $isHead) {
                $fs = [System.IO.File]::OpenRead($filePath)
                try {
                    [void]$fs.Seek($start, [System.IO.SeekOrigin]::Begin)
                    $buffer = [byte[]]::new(65536)
                    [long]$remaining = $length
                    while ($remaining -gt 0) {
                        $readCount = [int][Math]::Min($buffer.Length, $remaining)
                        $bytesRead = $fs.Read($buffer, 0, $readCount)
                        if ($bytesRead -le 0) { break }
                        $res.OutputStream.Write($buffer, 0, $bytesRead)
                        $remaining -= $bytesRead
                    }
                } finally {
                    $fs.Close()
                }
            }
        } else {
            $res.StatusCode = 200
            $res.ContentLength64 = $fileLen
            if (-not $isHead) {
                $fs = [System.IO.File]::OpenRead($filePath)
                try {
                    $buffer = [byte[]]::new(65536)
                    while ($true) {
                        $bytesRead = $fs.Read($buffer, 0, $buffer.Length)
                        if ($bytesRead -le 0) { break }
                        $res.OutputStream.Write($buffer, 0, $bytesRead)
                    }
                } finally {
                    $fs.Close()
                }
            }
        }

        $res.Close()
    } catch {
        try {
            $res.StatusCode = 500
            $res.Close()
        } catch {}
    }
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        Handle-Request $context
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
