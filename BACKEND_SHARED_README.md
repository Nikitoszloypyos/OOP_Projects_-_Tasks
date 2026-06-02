# Директория shared

`shared` — это общее ядро backend-приложения.

Эта директория нужна для кода, который используется несколькими backend-модулями и не принадлежит конкретно `users`, `projects`, `tasks` или `comments`.

В терминах DDD это можно воспринимать как **shared kernel**.

## Что можно быть в shared

В `shared` можно быть только то, что реально нужно нескольким модулям.

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

