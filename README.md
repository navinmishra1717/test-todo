# test-todo

## Prerequisite

- nodejs(LTS)
- typescript
- postgres

## Getting started

### Install

```
cd test-todo
npm install
```

### Run

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

### Migration

Create a database 
```
npx sequelize-cli db:create
```

Create a migration file
```
npx sequelize-cli migration:generate --name table-name
```