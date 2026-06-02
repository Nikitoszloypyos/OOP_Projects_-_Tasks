# Структура проекта и роль директорий

Проект представляет собой систему управления проектами и задачами.

Архитектурно проект разделён на две части:

- **backend** — модульный монолит с DDD-подобной структурой внутри каждого модуля.
- **frontend** — React-приложение с FSD-подобной структурой.

---

## Общая структура проекта

### package.json

Корневой `package.json` не хранит зависимости backend или frontend.

Его роль — запускать команды для отдельных частей проекта через `--prefix`.

### packages/backend/

Backend-приложение.

Здесь лежат:
- backend-зависимости;
- backend `node_modules`;
- backend `package-lock.json`;
- Prisma;
- сервер;
- модули системы.

### packages/frontend/

Frontend-приложение.

Здесь лежат:
- frontend-зависимости;
- frontend `node_modules`;
- frontend `package-lock.json`;
- React/Vite-приложение.

---

## Backend

Backend построен как **модульный монолит**.

Это значит, что приложение запускается как один backend-сервер, но внутри разделено на независимые модули:

- `users`
- `projects`
- `tasks`
- `comments`

Каждый модуль похож на отдельный сервис по структуре, но все модули используют один backend-конфиг, один сервер и общую Prisma-схему.

---

## Backend структура

### packages/backend/src/

Точка входа в исходный код backend.

### packages/backend/src/index.ts

Точка запуска backend-приложения.

Файл создаёт приложение и запускает сервер.

---

## packages/backend/src/app/

Единый центр сборки backend-приложения.

Этот слой не содержит бизнес-логику.

Его задача:
- создать Fastify-приложение;
- создать общие зависимости;
- подключить нужные модули;
- настроить общую обработку ошибок.

### packages/backend/src/app/createApp.ts

Создаёт Fastify-приложение.

Также:
- создаёт общие зависимости;
- регистрирует модули;
- добавляет `/health`;
- настраивает общий обработчик ошибок.

### packages/backend/src/app/createSharedDeps.ts

Создаёт общие зависимости backend-приложения.

Например:
- PrismaClient.

В будущем сюда могут добавляться общие зависимости, которые нужны нескольким модулям.

### packages/backend/src/app/registerModules.ts

Отвечает за подключение модулей.

Также умеет читать список включённых модулей через переменную окружения `ENABLED_MODULES`.

Например:

```bash
ENABLED_MODULES=users
ENABLED_MODULES=users,projects
ENABLED_MODULES=users,projects,tasks,comments


