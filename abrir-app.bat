@echo off
title Meu Dinheiro - Controle Financeiro
cd /d "%~dp0"

if not exist "node_modules" (
  echo Instalando dependencias pela primeira vez, aguarde...
  call npm install
)

echo Iniciando o app... o navegador vai abrir sozinho em alguns segundos.
call npm run dev

pause
