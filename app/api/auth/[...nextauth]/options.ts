import type { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import axios from "axios";
export const options: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          let user = { id: "", email: "", name: "" };
          console.log("credentials ", credentials?.email, credentials?.password);
          if (credentials?.email) {
            try {
              const fetchedData = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/userSignup`, {
                id: credentials.email,
                password: credentials.password
              });
              console.log("fetchedData ", fetchedData.data);
              if (fetchedData.data.success) {
                user = {
                  id: credentials.email,
                  email: credentials.email,
                  name: fetchedData.data.token
                };
              }
            } catch (error) {
              console.error("Error during user signup:", error);
              // Handle the error as needed
            }
          }

          if (user.id !== "") {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          // Handle the error as needed
          return null;
        }
      }
    })
  ],
}