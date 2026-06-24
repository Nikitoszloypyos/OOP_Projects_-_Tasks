# Tasks module

Модуль `tasks` отвечает за задачи внутри проекта.

На текущем этапе модуль проработан глубже остальных: в нём есть `domain`, `application` и часть `infrastructure`.

---

## Что должен делать модуль

- создавать задачу;
- изменять название, описание и приоритет;
- менять статус задачи;
- назначать и снимать исполнителя;
- архивировать задачу;
- хранить задачи проекта;
- быть источником проверки доступа для модуля `comments`.

---

## Текущее состояние

Сейчас в модуле реализованы:

- `domain`;
- `application` DTO и контракты;
- Prisma-репозиторий и mapper;
- базовый HTTP route;
- Prisma-модель `Task` в общей schema.

Use-case'ы пока ещё не написаны.

---

## Структура файлов

```text
packages/backend/src/modules/tasks/
├── index.ts
├── application/
│   ├── index.ts
│   ├── contracts/
│   │   ├── TasksPublicApi.ts
│   │   └── index.ts
│   ├── dto/
│   │   ├── ArchiveTaskDTO.ts
│   │   ├── AssignTaskDTO.ts
│   │   ├── ChangeTaskStatusDTO.ts
│   │   ├── CreateTaskDTO.ts
│   │   ├── GetTaskDTO.ts
│   │   ├── ListProjectTasksDTO.ts
│   │   ├── TaskDTO.ts
│   │   ├── UpdateTaskDTO.ts
│   │   └── index.ts
│   ├── ports/
│   │   ├── ProjectAccessPort.ts
│   │   ├── TaskRepository.ts
│   │   ├── UserLookupPort.ts
│   │   └── index.ts
│   └── use-cases/.gitkeep
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   ├── Task.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── ArchivedTaskError.ts
│   │   ├── InvalidTaskStatusTransitionError.ts
│   │   └── index.ts
│   └── value-objects/
│       ├── TaskDescription.ts
│       ├── TaskPriority.ts
│       ├── TaskStatus.ts
│       ├── TaskTitle.ts
│       └── index.ts
└── infrastructure/
    ├── http/
    │   └── tasksRoutes.ts
    ├── mappers/
    │   ├── TaskMapper.ts
    │   └── index.ts
    └── persistence/
        ├── PrismaTaskRepository.ts
        └── index.ts
```

---

## Роль файлов

`index.ts`

Точка входа в tasks-модуль. Сейчас подключает `tasksRoutes`.

`application/index.ts`

Общий export application-слоя.

`application/contracts/TasksPublicApi.ts`

Публичный контракт модуля `tasks` для других модулей.

Предназначен для связки `comments -> tasks`.

`application/contracts/index.ts`

Export публичных контрактов.

`application/dto/TaskDTO.ts`

Основной DTO задачи для отдачи наружу.

Также содержит функции преобразования domain `Task` в `TaskDTO`.

`application/dto/CreateTaskDTO.ts`

DTO для создания задачи.

`application/dto/GetTaskDTO.ts`

DTO для получения одной задачи.

`application/dto/ListProjectTasksDTO.ts`

DTO для списка задач проекта.

`application/dto/UpdateTaskDTO.ts`

DTO для изменения названия, описания и приоритета задачи.

`application/dto/ChangeTaskStatusDTO.ts`

DTO для смены статуса задачи.

`application/dto/AssignTaskDTO.ts`

DTO для назначения и снятия исполнителя.

`application/dto/ArchiveTaskDTO.ts`

DTO для архивации задачи.

`application/dto/index.ts`

Общий export DTO application-слоя.

`application/ports/TaskRepository.ts`

Контракт репозитория задач.

Содержит методы:

- `save`;
- `findById`;
- `listByProjectId`.

`application/ports/ProjectAccessPort.ts`

Контракт к модулю `projects`.

Нужен, чтобы `tasks` мог проверять:

- существует ли проект;
- состоит ли пользователь в проекте.

`application/ports/UserLookupPort.ts`

Контракт к модулю `users`.

Нужен, чтобы `tasks` мог проверять существование пользователя.

`application/ports/index.ts`

Общий export application ports.

`application/use-cases/.gitkeep`

Заглушка для будущих use-case'ов.

`domain/index.ts`

Общий export доменного слоя.

`domain/entities/Task.ts`

Главная сущность задачи.

Содержит:

- создание задачи;
- восстановление из БД;
- смену названия;
- смену описания;
- смену приоритета;
- смену статуса;
- назначение и снятие исполнителя;
- архивацию;
- snapshot для persistence-слоя.

`domain/entities/index.ts`

Export сущности `Task` и связанных типов.

`domain/value-objects/TaskTitle.ts`

Value Object для названия задачи.

`domain/value-objects/TaskDescription.ts`

Value Object для описания задачи.

`domain/value-objects/TaskPriority.ts`

Value Object для приоритета задачи.

Сейчас поддерживает:

- `low`;
- `medium`;
- `high`.

`domain/value-objects/TaskStatus.ts`

Value Object для статуса задачи.

Содержит допустимые статусы и переходы:

- `created`;
- `in_progress`;
- `review`;
- `done`.

`domain/value-objects/index.ts`

Общий export value objects.

`domain/errors/ArchivedTaskError.ts`

Ошибка, если архивную задачу пытаются изменить.

`domain/errors/InvalidTaskStatusTransitionError.ts`

Ошибка при недопустимом переходе статуса.

`domain/errors/index.ts`

Общий export ошибок доменного слоя.

`infrastructure/http/tasksRoutes.ts`

HTTP routes tasks-модуля.

Сейчас содержит только базовый health endpoint.

`infrastructure/mappers/TaskMapper.ts`

Маппер Prisma record ↔ domain `Task`.

`infrastructure/mappers/index.ts`

Export мапперов.

`infrastructure/persistence/PrismaTaskRepository.ts`

Prisma-реализация `TaskRepository`.

Содержит:

- сохранение задачи;
- поиск по id;
- список задач проекта.

`infrastructure/persistence/index.ts`

Export persistence-слоя.
