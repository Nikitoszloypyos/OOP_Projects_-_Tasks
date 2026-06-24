# Comments module

Модуль `comments` отвечает за комментарии к задачам.

На текущем этапе в модуле есть `domain` и `application`.

---

## Что должен делать модуль

- добавлять комментарий к задаче;
- изменять комментарий;
- удалять комментарий через soft delete;
- хранить список комментариев задачи;
- проверять, что комментарий меняет только его автор.

---

## Текущее состояние

Сейчас в модуле реализованы:

- `domain`;
- `application` DTO и контракты;
- базовый HTTP route.

Persistence, mapper и use-case'ы пока не написаны.

---

## Структура файлов

```text
packages/backend/src/modules/comments/
├── index.ts
├── application/
│   ├── index.ts
│   ├── contracts/
│   │   ├── CommentsPublicApi.ts
│   │   └── index.ts
│   ├── dto/
│   │   ├── AddCommentDTO.ts
│   │   ├── CommentDTO.ts
│   │   ├── DeleteCommentDTO.ts
│   │   ├── EditCommentDTO.ts
│   │   ├── GetCommentDTO.ts
│   │   ├── ListTaskCommentsDTO.ts
│   │   └── index.ts
│   ├── ports/
│   │   ├── CommentRepository.ts
│   │   ├── TaskAccessPort.ts
│   │   └── index.ts
│   └── use-cases/.gitkeep
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   ├── Comment.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── CommentAuthorMismatchError.ts
│   │   ├── DeletedCommentError.ts
│   │   └── index.ts
│   └── value-objects/
│       ├── CommentText.ts
│       └── index.ts
└── infrastructure/
    ├── http/
    │   └── commentsRoutes.ts
    ├── mappers/.gitkeep
    └── persistence/.gitkeep
```

---

## Роль файлов

`index.ts`

Точка входа в comments-модуль. Сейчас подключает `commentsRoutes`.

`application/index.ts`

Общий export application-слоя.

`application/contracts/CommentsPublicApi.ts`

Публичный контракт comments-модуля для внешнего использования.

`application/contracts/index.ts`

Export публичных контрактов.

`application/dto/CommentDTO.ts`

Основной DTO комментария для отдачи наружу.

Также содержит функции преобразования domain `Comment` в `CommentDTO`.

`application/dto/AddCommentDTO.ts`

DTO для создания комментария.

`application/dto/GetCommentDTO.ts`

DTO для получения одного комментария.

`application/dto/ListTaskCommentsDTO.ts`

DTO для списка комментариев задачи.

`application/dto/EditCommentDTO.ts`

DTO для редактирования комментария.

`application/dto/DeleteCommentDTO.ts`

DTO для удаления комментария.

`application/dto/index.ts`

Общий export DTO application-слоя.

`application/ports/CommentRepository.ts`

Контракт репозитория комментариев.

Содержит методы:

- `save`;
- `findById`;
- `listByTaskId`.

`application/ports/TaskAccessPort.ts`

Контракт к модулю `tasks`.

Нужен, чтобы `comments` мог проверять:

- существует ли задача;
- имеет ли пользователь доступ к задаче.

`application/ports/index.ts`

Общий export application ports.

`application/use-cases/.gitkeep`

Заглушка для будущих use-case'ов.

`domain/index.ts`

Общий export доменного слоя.

`domain/entities/Comment.ts`

Главная сущность комментария.

Содержит:

- создание комментария;
- восстановление из БД;
- редактирование комментария;
- удаление через soft delete;
- snapshot для persistence-слоя.

`domain/entities/index.ts`

Export сущности `Comment` и связанных типов.

`domain/value-objects/CommentText.ts`

Value Object для текста комментария.

Проверяет:

- что текст не пустой;
- что текст не превышает ограничение по длине.

`domain/value-objects/index.ts`

Общий export value objects.

`domain/errors/CommentAuthorMismatchError.ts`

Ошибка, если комментарий пытается изменить не автор.

`domain/errors/DeletedCommentError.ts`

Ошибка, если уже удалённый комментарий пытаются изменить повторно.

`domain/errors/index.ts`

Общий export ошибок доменного слоя.

`infrastructure/http/commentsRoutes.ts`

HTTP routes comments-модуля.

Сейчас содержит только базовый health endpoint.

`infrastructure/mappers/.gitkeep`

Заглушка для будущих мапперов Prisma ↔ domain.

`infrastructure/persistence/.gitkeep`

Заглушка для будущих репозиториев.
