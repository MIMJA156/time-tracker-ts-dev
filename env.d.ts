declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_SECRET: string;
      CLIENT_ID: string;
    }
  }
}

export {};
