# Директория shared

`shared` — это общее ядро backend-приложения.

Эта директория нужна для кода, который используется несколькими backend-модулями и не принадлежит конкретно `users`, `projects`, `tasks` или `comments`.

В терминах DDD это можно воспринимать как **shared kernel**.

---

## Нужно ли называть эту директорию shared

Да, название `shared` здесь подходит.

Оно показывает, что внутри лежат общие части backend-приложения.

Альтернативные названия могли бы быть:

- `core`
- `common`
- `kernel`
- `shared-kernel`

Но для текущего проекта `shared` проще и понятнее.

Главное правило: `shared` не должен превращаться в папку для всего подряд.

---

## Нормально ли, что shared содержит кусок Clean Architecture

Да, это нормально.

Внутри `shared` есть разделение:

```text
shared/
  domain/
  application/
  infrastructure/
  lib/
```

Это не отдельный бизнес-модуль, а общий инфраструктурно-архитектурный слой.

Такое разделение нужно, чтобы даже общий код не смешивался в одну кучу.

Например:

- интерфейс `PasswordHasher` лежит в `application/ports`;
- реализация `ScryptPasswordHasher` лежит в `infrastructure/security`;
- общие ошибки лежат в `domain/errors`;
- мелкие утилиты лежат в `lib`.

То есть `shared` тоже соблюдает направление зависимостей:

```text
application -> domain
infrastructure -> application/domain
```

Но бизнес-логики конкретных модулей здесь быть не должно.

---

## Что можно класть в shared

В `shared` можно класть только то, что реально нужно нескольким модулям.

Примеры:

- общие ошибки;
- общие application-порты;
- общие инфраструктурные реализации;
- Prisma client;
- общие middleware;
- небольшие утилиты без бизнес-смысла.

---

## Что нельзя класть в shared

В `shared` нельзя класть бизнес-сущности конкретных модулей.

Нельзя:

```text
shared/domain/entities/User.ts
shared/domain/entities/Project.ts
shared/domain/entities/Task.ts
shared/domain/entities/Comment.ts
```

Эти сущности должны лежать в своих модулях:

```text
modules/users/
modules/projects/
modules/tasks/
modules/comments/
```

Также не стоит класть в `shared` use-case'ы конкретных модулей.

Например:

```text
CreateTaskUseCase
CreateProjectUseCase
AddCommentUseCase
RegisterUserUseCase
```

Они должны лежать внутри соответствующих модулей.

---

## shared/domain

Директория для общих доменных понятий.

Сейчас здесь лежат общие ошибки:

```text
shared/domain/errors/
```

Примеры:

- `ValidationError`
- `NotFoundError`
- `ForbiddenError`
- `AuthError`

Эти ошибки могут использоваться разными модулями.

Если ошибка относится только к одному модулю, её лучше положить внутрь этого модуля.

Например:

```text
modules/tasks/domain/errors/InvalidTaskStatusTransitionError.ts
```

---

## shared/application

Директория для общих application-абстракций.

Сейчас здесь лежат общие порты:

```text
shared/application/ports/
```

Порт — это интерфейс, который нужен use-case'ам, но реализация которого находится во внешнем мире.

Примеры:

- `Clock`
- `IdGenerator`
- `PasswordHasher`

Use-case должен зависеть от интерфейса, а не от конкретной реализации.

Например, use-case регистрации пользователя может зависеть от:

```text
PasswordHasher
IdGenerator
Clock
```

Но он не должен знать, как именно хешируется пароль или генерируется id.

---

## shared/infrastructure

Директория для технических реализаций общих зависимостей.

Примеры:

```text
shared/infrastructure/prisma/prismaClient.ts
shared/infrastructure/clock/SystemClock.ts
shared/infrastructure/identity/CryptoIdGenerator.ts
shared/infrastructure/security/ScryptPasswordHasher.ts
```

Эти классы и функции можно подключать в `app/createSharedDeps.ts`.

То есть `shared/infrastructure` создаёт реальные технические реализации, а `app` собирает их вместе и передаёт в модули.

---

## shared/lib

Директория для маленьких общих утилит.

Например:

- форматирование;
- работа со строками;
- вспомогательные функции;
- небольшие type helpers.

В `shared/lib` нельзя складывать бизнес-правила.

Если функция относится к задачам, проектам, пользователям или комментариям, она должна лежать в соответствующем модуле.

---

## Как понять, можно ли файл положить в shared

Перед добавлением файла в `shared` нужно задать три вопроса:

1. Этот код нужен больше чем одному модулю?
2. Этот код не содержит бизнес-логику конкретного модуля?
3. Этот код не заставляет модули зависеть друг от друга напрямую?

Если ответ на все три вопроса — да, файл можно положить в `shared`.

Если нет, файл должен лежать внутри конкретного модуля.

---

## Примеры правильного использования

Хорошо:

```text
shared/application/ports/PasswordHasher.ts
shared/infrastructure/security/ScryptPasswordHasher.ts
```

Потому что хеширование паролей может понадобиться users/auth, но сама реализация не является бизнес-сущностью пользователя.

Хорошо:

```text
shared/infrastructure/prisma/prismaClient.ts
```

Потому что Prisma client нужен разным persistence-адаптерам.

Хорошо:

```text
shared/domain/errors/NotFoundError.ts
```

Потому что ошибка "не найдено" может использоваться разными модулями.

---

## Примеры неправильного использования

Плохо:

```text
shared/domain/entities/Task.ts
```

Потому что `Task` — это сущность модуля `tasks`.

Плохо:

```text
shared/application/use-cases/CreateProjectUseCase.ts
```

Потому что use-case создания проекта относится к модулю `projects`.

Плохо:

```text
shared/lib/calculateTaskProgress.ts
```

Потому что прогресс задачи относится к доменной логике задач.

---

## Главное правило

`shared` — это не место для кода, который непонятно куда положить.

`shared` — это место только для кода, который действительно является общим для нескольких модулей.

Если есть сомнение, лучше сначала положить файл внутрь конкретного модуля.

Перенести код в `shared` можно позже, когда станет понятно, что он реально нужен нескольким модулям.
