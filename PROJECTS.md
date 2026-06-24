# Projects module

Модуль `projects` отвечает за проекты и участие пользователей в проектах.

На текущем этапе модуль описывает доменную модель проекта и участника проекта.

---

## Что должен делать модуль

- создавать и изменять проект;
- архивировать проект;
- хранить участников проекта;
- описывать роли участников;
- быть источником проверки доступа для модуля `tasks`.

---

## Текущее состояние

Сейчас в модуле реализован `domain`.

`application` и `infrastructure` пока являются каркасом и ещё не заполнены бизнес-логикой.

---

## Структура файлов

```text
packages/backend/src/modules/projects/
├── index.ts
├── application/
│   ├── ports/.gitkeep
│   └── use-cases/.gitkeep
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   ├── Project.ts
│   │   ├── ProjectMember.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── ArchivedProjectError.ts
│   │   ├── ProjectMemberAlreadyExistsError.ts
│   │   ├── ProjectMemberNotFoundError.ts
│   │   ├── ProjectOwnerRemovalError.ts
│   │   └── index.ts
│   └── value-objects/
│       ├── ProjectDescription.ts
│       ├── ProjectName.ts
│       ├── ProjectRole.ts
│       └── index.ts
└── infrastructure/
    ├── http/
    │   └── projectsRoutes.ts
    ├── mappers/.gitkeep
    └── persistence/.gitkeep
```

---

## Роль файлов

`index.ts`

Точка входа в projects-модуль. Сейчас подключает `projectsRoutes`.

`domain/index.ts`

Общий export доменного слоя модуля.

`domain/entities/Project.ts`

Главная сущность проекта.

Содержит:

- создание проекта;
- восстановление из БД;
- смену названия;
- смену описания;
- архивацию проекта;
- snapshot для persistence-слоя.

`domain/entities/ProjectMember.ts`

Сущность участия пользователя в проекте.

Содержит:

- создание участника проекта;
- восстановление из БД;
- смену роли;
- проверку, является ли участник owner;
- snapshot для persistence-слоя.

`domain/entities/index.ts`

Export сущностей `Project`, `ProjectMember` и связанных типов.

`domain/value-objects/ProjectName.ts`

Value Object для названия проекта.

Проверяет:

- что название не пустое;
- что название не превышает ограничение по длине.

`domain/value-objects/ProjectDescription.ts`

Value Object для описания проекта.

Проверяет:

- что описание не превышает ограничение по длине;
- позволяет пустое значение.

`domain/value-objects/ProjectRole.ts`

Value Object для роли участника проекта.

Сейчас поддерживает роли:

- `owner`;
- `member`.

`domain/value-objects/index.ts`

Общий export value objects модуля.

`domain/errors/ArchivedProjectError.ts`

Ошибка, если архивный проект пытаются изменить.

`domain/errors/ProjectMemberAlreadyExistsError.ts`

Ошибка, если участник уже состоит в проекте.

`domain/errors/ProjectMemberNotFoundError.ts`

Ошибка, если участник проекта не найден.

`domain/errors/ProjectOwnerRemovalError.ts`

Ошибка, если пытаются удалить владельца проекта.

`domain/errors/index.ts`

Общий export ошибок доменного слоя.

`application/ports/.gitkeep`

Заглушка для будущих application ports.

`application/use-cases/.gitkeep`

Заглушка для будущих use-case'ов модуля.

`infrastructure/http/projectsRoutes.ts`

HTTP routes projects-модуля.

Сейчас содержит только базовый health endpoint.

`infrastructure/mappers/.gitkeep`

Заглушка для будущих мапперов Prisma ↔ domain.

`infrastructure/persistence/.gitkeep`

Заглушка для будущих репозиториев.
