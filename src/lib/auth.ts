import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { dynamoDbClient } from '@/lib/aws';

const ddbDocClient = DynamoDBDocument.from(dynamoDbClient);

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        const existingUser = await ddbDocClient.query({
          TableName: process.env.USERS_TABLE_NAME!,
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': user.email,
          },
        });

        if (!existingUser.Items?.length) {
          await ddbDocClient.put({
            TableName: process.env.USERS_TABLE_NAME!,
            Item: {
              id: user.id || crypto.randomUUID(),
              email: user.email,
              name: user.name,
              image: user.image,
              createdAt: Date.now(),
              provider: 'google',
            },
          });
        }
        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export { authOptions };
