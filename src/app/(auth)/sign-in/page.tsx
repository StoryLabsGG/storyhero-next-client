'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// Create a separate component that uses useSearchParams
function SignInContent() {
  const { data: session } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('google', {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError('Authentication failed. Please try again.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <Card className="w-full max-w-md border-gray-800 bg-[#1A1A1A] text-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-3xl font-bold text-white">
            Finish signing up to get your free clips
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Free plan available. No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-3 border-gray-700 bg-[#2A2A2A] text-white hover:bg-[#333333]"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <Button
            variant="outline"
            className="flex h-12 w-full items-center justify-center gap-3 border-gray-700 bg-[#2A2A2A] text-white hover:bg-[#333333]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
            </svg>
            <span>Continue with Discord</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1A1A] px-2 text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter email address"
              className="focus:ring-storyhero w-full rounded-md border border-gray-700 bg-[#2A2A2A] px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:outline-none"
            />
            <Button className="h-12 w-full bg-white text-black hover:bg-gray-100">
              Continue with email
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-xs text-gray-400">
          <p className="text-center">
            By continuing, you agree to StoryHero's{' '}
            <a href="#" className="underline hover:text-white">
              Terms of Service
            </a>
            . Read our{' '}
            <a href="#" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading sign-in...</p>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
