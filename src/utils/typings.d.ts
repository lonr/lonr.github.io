declare module '@primer/octicons';

type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | undefined | null;

// https://stackoverflow.com/a/54178819/5783347
type RequiredWith<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
