export type tokenPayload = {
  user: {
    id?: string | number;
    password: string;
    role: string;
  };
  iat: number;
};