# Robótica Lab V9 — Render Ready

Este proyecto está preparado para publicarse como Web Service Docker en Render.

## Objetivo
Los docentes y estudiantes NO instalan nada. Solo abren la URL pública `*.onrender.com`.

## Incluye
- Frontend web responsive.
- Flujo Docente / Estudiante.
- Creación de clase y código de ingreso (prototipo en memoria).
- Arduino Uno y Nano.
- Editor Arduino.
- Endpoint `/api/compile`.
- Arduino CLI dentro del contenedor.
- Core `arduino:avr` instalado durante la construcción.
- Compilación del sketch a firmware HEX.
- `/health` para Render.
- `render.yaml`.
- `Dockerfile`.

## Publicar gratis en Render
1. Sube el contenido de esta carpeta a un repositorio Git.
2. En Render crea un **Web Service**.
3. Conecta el repositorio.
4. Render detectará el `render.yaml`/Dockerfile, o selecciona `Docker` como runtime.
5. Selecciona el plan **Free**.
6. Despliega.
7. Render asignará una URL pública `https://...onrender.com`.

## Importante
El servidor guarda clases y estudiantes EN MEMORIA en esta versión. Al reiniciarse o dormirse el servicio gratuito, esos datos se pierden. Antes de usarlo como plataforma escolar real hay que mover clases, usuarios, actividades y proyectos a almacenamiento persistente.

La simulación visual del LED todavía no ejecuta directamente el firmware HEX. La compilación sí es real; la integración HEX -> AVR8js -> GPIO -> circuito es la siguiente capa técnica.
