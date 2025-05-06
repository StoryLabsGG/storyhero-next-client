import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { dynamoDbClient } from '@/lib/aws';

import { getSecret } from './clients/ssmClient';
import { USERS_TABLE } from './constants';

const ddbDocClient = DynamoDBDocument.from(dynamoDbClient);

const authOptions: NextAuthOptions = {
  secret: await getSecret('NEXTAUTH_SECRET'),
  providers: [
    GoogleProvider({
      clientId: await getSecret('GOOGLE_CLIENT_ID'),
      clientSecret: await getSecret('GOOGLE_CLIENT_SECRET'),
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
          TableName: USERS_TABLE,
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': user.email,
          },
        });

        if (!existingUser.Items?.length) {
          await ddbDocClient.put({
            TableName: USERS_TABLE,
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
