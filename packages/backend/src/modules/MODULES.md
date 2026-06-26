# Backend modules

Backend построен как модульный монолит.

Каждый модуль отвечает за одну бизнес-область:

```text
modules/
  users/
  projects/
  tasks/
  comments/
```

Модуль похож на отдельный сервис по структуре, но запускается внутри одного backend-приложения.

---

## Общая структура модуля

Каждый модуль имеет одинаковую базовую структуру:

```text
module/
  domain/
    entities/
    value-objects/
    errors/

  application/
    use-cases/
    ports/

  infrastructure/
    http/
    persistence/
    mappers/

  index.ts
```

---

## domain

`domain` содержит чистую бизнес-логику модуля.

Этот слой не должен знать про:

- HTTP;
- Fastify;
- Prisma;
- базу данных;
- frontend.

### domain/entities

Сущности модуля.

Примеры:

```text
users/domain/entities/User.ts
projects/domain/entities/Project.ts
tasks/domain/entities/Task.ts
comments/domain/entities/Comment.ts
```

### domain/value-objects

Value Objects с валидацией и небольшими правилами.

Примеры:

```text
Email
ProjectName
TaskTitle
TaskStatus
CommentText
```

### domain/errors

Ошибки, которые относятся только к конкретному модулю.

Если ошибка общая для нескольких модулей, она должна лежать в `shared/domain/errors`.

---

## application

`application` содержит сценарии приложения.

Этот слой отвечает за то, что именно делает пользователь или система.

### application/use-cases

Use-case'ы модуля.

Примеры:

```text
CreateProjectUseCase
CreateTaskUseCase
ChangeTaskStatusUseCase
AddCommentUseCase
```

Use-case может:

- получать данные из repository port;
- вызывать доменные методы;
- сохранять изменения;
- проверять прикладные условия.

### application/ports

Интерфейсы для внешних зависимостей модуля.

Примеры:

```text
UserRepository
ProjectRepository
TaskRepository
CommentRepository
```

Use-case зависит от порта, а не от Prisma-реализации.

---

## infrastructure

`infrastructure` содержит техническую реализацию модуля.

Этот слой может знать про:

- Fastify;
- Prisma;
- HTTP;
- внешние библиотеки.

### infrastructure/http

HTTP routes модуля.

Примеры:

```text
usersRoutes.ts
projectsRoutes.ts
tasksRoutes.ts
commentsRoutes.ts
```

Route должен быть тонким:

```text
request -> use-case -> response
```

Бизнес-логику в route писать не нужно.

### infrastructure/persistence

Реализация repository port через Prisma или другую БД.

Примеры:

```text
PrismaUserRepository
PrismaProjectRepository
PrismaTaskRepository
PrismaCommentRepository
```

### infrastructure/mappers

Мапперы между Prisma-моделями и доменными сущностями.

Нужны, если структура БД отличается от структуры доменной модели.

---

## index.ts

`index.ts` — точка входа в модуль.

Через него модуль подключается к приложению.

Например:

```text
registerTasksModule(app, deps)
```

Внутри `index.ts` модуль может:

- создать свои repository implementations;
- создать свои use-case'ы;
- зарегистрировать свои HTTP routes.

---

## Как модули подключаются

Модули подключаются в:

```text
app/registerModules.ts
```

Пример потока:

```text
index.ts
  -> createApp()
  -> registerModules()
  -> registerUsersModule()
  -> usersRoutes
```

---

## Главное правило зависимостей

Правильное направление:

```text
infrastructure -> application -> domain
```

Неправильно:

```text
domain -> infrastructure
domain -> Prisma
domain -> Fastify
```

Домен должен оставаться самым независимым слоем.

---

## Как распределять работу

Каждый человек может работать в своём модуле:

```text
modules/users/
modules/projects/
modules/tasks/
modules/comments/
```

Если модулю нужен общий код, сначала стоит проверить `shared`.

Если общего кода ещё нет, лучше не добавлять его в `shared` заранее.

Сначала код пишется внутри конкретного модуля, а в `shared` переносится только после реальной необходимости.
