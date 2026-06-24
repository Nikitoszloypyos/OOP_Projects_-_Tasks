# Users module

Модуль `users` отвечает за пользователя системы.

На текущем этапе модуль описывает доменную модель пользователя.

---

## Что должен делать модуль

- хранить пользователя;
- валидировать email и имя;
- поддерживать смену имени, email и password hash;
- быть источником проверки существования пользователя для других модулей.

---

## Текущее состояние

Сейчас в модуле реализован `domain`.

`application` и `infrastructure` пока являются каркасом и ещё не заполнены бизнес-логикой.

---

## Структура файлов

```text
packages/backend/src/modules/users/
├── index.ts
├── application/
│   ├── ports/.gitkeep
│   └── use-cases/.gitkeep
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   ├── User.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── InvalidCredentialsError.ts
│   │   ├── UserAlreadyExistsError.ts
│   │   ├── UserEmailAlreadyTakenError.ts
│   │   └── index.ts
│   └── value-objects/
│       ├── UserEmail.ts
│       ├── UserName.ts
│       └── index.ts
└── infrastructure/
    ├── http/
    │   └── usersRoutes.ts
    ├── mappers/.gitkeep
    └── persistence/.gitkeep
```

---

## Роль файлов

`index.ts`

Точка входа в users-модуль. Сейчас подключает `usersRoutes`.

`domain/index.ts`

Общий export доменного слоя модуля.

`domain/entities/User.ts`

Главная сущность пользователя.

Содержит:

- создание пользователя;
- восстановление из БД;
- смену имени;
- смену email;
- смену password hash;
- snapshot для persistence-слоя.

`domain/entities/index.ts`

Export сущности `User` и связанных типов.

`domain/value-objects/UserEmail.ts`

Value Object для email пользователя.

Проверяет:

- что email не пустой;
- что email имеет корректный формат;
- что email нормализован в lowercase.

`domain/value-objects/UserName.ts`

Value Object для имени пользователя.

Проверяет:

- что имя не пустое;
- что имя не превышает ограничение по длине.

`domain/value-objects/index.ts`

Общий export value objects модуля.

`domain/errors/UserAlreadyExistsError.ts`

Ошибка, когда пользователь уже существует.

`domain/errors/UserEmailAlreadyTakenError.ts`

Ошибка, когда email уже занят другим пользователем.

`domain/errors/InvalidCredentialsError.ts`

Ошибка авторизации при неверных данных входа.

`domain/errors/index.ts`

Общий export ошибок доменного слоя.

`application/ports/.gitkeep`

Заглушка для будущих application ports.

`application/use-cases/.gitkeep`

Заглушка для будущих use-case'ов модуля.

`infrastructure/http/usersRoutes.ts`

HTTP routes users-модуля.

Сейчас содержит только базовый health endpoint.

`infrastructure/mappers/.gitkeep`

Заглушка для будущих мапперов Prisma ↔ domain.

`infrastructure/persistence/.gitkeep`

Заглушка для будущих репозиториев.
