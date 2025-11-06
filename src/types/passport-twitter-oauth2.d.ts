// src/@types/passport-twitter-oauth2/index.d.ts
declare module "passport-twitter-oauth2" {
  import { Strategy as PassportStrategy } from "passport";

  export interface TwitterStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    clientType?: "public" | "confidential"; // 🔥 AGREGADO
    scope?: string[];
    state?: boolean;
    authorizationURL?: string;
    tokenURL?: string;
    userProfileURL?: string;
  }

  export interface TwitterProfile {
    id: string;
    username?: string;
    displayName?: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: TwitterProfile,
    done: (error: any, user?: any) => void
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: TwitterStrategyOptions, verify: VerifyFunction);
    name?: string; // 🔥 OPCIONAL: Para poder cambiar el nombre de la estrategia
  }
}