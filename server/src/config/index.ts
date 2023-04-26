export enum ENV {
    DEV = 'development',
    TEST = 'test',
  }
  export const APP_PORT: string = process.env.APP_PORT || '3000';
  export const APP_ENV = (process.env.NODE_ENV || process.env.APP_ENV) as ENV;
  export const DB_HOST = process.env.DB_HOST as string;
  export const DB_PORT = Number(process.env.DB_PORT);
  export const DB_NAME = process.env.DB_NAME as string;
  export const DB_USERNAME = process.env.DB_USERNAME as string;
  export const DB_PASSWORD = process.env.DB_PASSWORD as string;
  