# Inicia un PostgreSQL local y aislado para el proyecto en el puerto 5544.
# Requiere PostgreSQL instalado (se detecta la carpeta estándar de Windows).
# No modifica el servicio de PostgreSQL que ya exista en la máquina.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $root "backend\.pgdata"
$port = 5544

$pgBin = $null
$candidates = @(
    "C:\Program Files\PostgreSQL\18\bin",
    "C:\Program Files\PostgreSQL\17\bin",
    "C:\Program Files\PostgreSQL\16\bin"
)
foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate "pg_ctl.exe")) {
        $pgBin = $candidate
        break
    }
}

if (-not $pgBin) {
    $pgCtl = Get-Command pg_ctl.exe -ErrorAction SilentlyContinue
    if ($pgCtl) { $pgBin = Split-Path -Parent $pgCtl.Source }
}

if (-not $pgBin) {
    throw "No se encontró PostgreSQL. Instala PostgreSQL 16+ o usa docker-compose.yml."
}

if (-not (Test-Path (Join-Path $dataDir "PG_VERSION"))) {
    Write-Host "Inicializando clúster local en $dataDir ..."
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
    & (Join-Path $pgBin "initdb.exe") -D $dataDir -U codigo_aragon --auth=trust --encoding=UTF8 --locale=C | Out-Null
}

$status = & (Join-Path $pgBin "pg_ctl.exe") -D $dataDir status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Iniciando PostgreSQL en el puerto $port ..."
    & (Join-Path $pgBin "pg_ctl.exe") -D $dataDir -l (Join-Path $dataDir "server.log") -o "-p $port" start | Out-Null
    Start-Sleep -Seconds 2
}

$env:PGPASSWORD = "codigo_aragon"
$exists = & (Join-Path $pgBin "psql.exe") -h localhost -p $port -U codigo_aragon -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='codigo_aragon'"
if ($exists -ne "1") {
    Write-Host "Creando base de datos codigo_aragon ..."
    & (Join-Path $pgBin "createdb.exe") -h localhost -p $port -U codigo_aragon codigo_aragon
}

Write-Host "PostgreSQL listo en postgresql://codigo_aragon@localhost:$port/codigo_aragon"
