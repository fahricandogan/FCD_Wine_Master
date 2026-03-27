$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Listening on http://localhost:8080/ (Press Ctrl+C to stop)"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Determine local path
        $path = $request.RawUrl.Split('?')[0]
        if ($path -eq "/") { $path = "/index.html" }
        $fullPath = Join-Path $PWD.Path $path.Substring(1).Replace('/', '\')
        
        Write-Host "Request: $path -> $fullPath"

        if (Test-Path $fullPath -PathType Leaf) {
            # Basic mime types
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                default { }
            }
            
            # Read and respond
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            Write-Host "404 Not Found"
        }
    } catch {
        Write-Host "Error serving request: $_"
    } finally {
        if ($response -ne $null) {
            $response.Close()
        }
    }
}
