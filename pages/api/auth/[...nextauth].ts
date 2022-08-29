import NextAuth, {NextAuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';


/*
const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@google.com'},
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials: any, req: any){
        //const { email, password } = credentials as { email: string; password: string; }
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  callbacks:{
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            // TODO: crear usuario o verificar si existe en la bd 
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  }
}

export default NextAuth(authOptions);
*/

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@google.com'},
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  jwt: {

  },
  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400,
   },
  callbacks:{
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            // TODO: crear usuario o verificar si existe en la bd 
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  }
});