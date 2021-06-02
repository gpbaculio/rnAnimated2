declare module NodeJS {
  interface Global {
    atob(data: string): string;
    btoa(data: string): string;
  }
}
