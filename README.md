# todo-app

## Prerequisite

- nodejs(LTS)
- typescript
- postgres

## Getting started

### Install

Server

```
cd server
npm install
```

Client

```
cd ../client
npm install
```

### Database setup

Create a database

```
npm run db:create
```

OR

```
npx sequelize-cli db:create
```

### Database migration

```
npm run migrate
```

### Database Seeder

```
npm run seed
```

### Run Server

Build the project

```
 npm run build
```

Run the project for production

```
 npm run start
```

Run the project for development

```
 npm run dev
```

### Test the server

```
npm run test
```

watch

```
npm run test:watch
```

coverage

```
npm run coverage
```

### Run Client

```
npm run start
```
