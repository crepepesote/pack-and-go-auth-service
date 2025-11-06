import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter-oauth2";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { sendWelcomeEmail } from "../services/email.service";

dotenv.config();
const prisma = new PrismaClient();

// === GOOGLE STRATEGY ===
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ 
          where: { email: profile.emails?.[0].value } 
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0].value!,
              password: "",
              provider: "google",
            },
          });
          
          // Enviar email de bienvenida
          try {
            await sendWelcomeEmail(user.email, user.name || undefined);
          } catch (emailError) {
            console.error("Error enviando email de bienvenida:", emailError);
          }
        }
        
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

// === TWITTER STRATEGY ===
const twitterOAuth2 = new TwitterStrategy(
  {
    clientID: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    callbackURL: process.env.TWITTER_CALLBACK_URL!,
    clientType: "confidential",
    scope: ["tweet.read", "users.read", "offline.access"],
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email =
        (profile.emails && profile.emails[0]?.value) ||
        `${profile.username}@twitter.com`;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.displayName || profile.username,
            email,
            password: "",
            provider: "twitter",
          },
        });
        
        // Enviar email de bienvenida
        try {
          await sendWelcomeEmail(user.email, user.name || undefined);
        } catch (emailError) {
          console.error("Error enviando email de bienvenida:", emailError);
        }
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
);

twitterOAuth2.name = "twitter-oauth2";
passport.use(twitterOAuth2);

export default passport;