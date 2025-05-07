'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';

interface CheckoutPageProps {
  stripePublishableKey: string;
}

const SUBSCRIPTION_OPTIONS = [
  {
    name: 'Basic Plan',
    price: '$9.99/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    productId: 'prod_SGTLYya1eXcE95',
  },
  {
    name: 'Pro Plan',
    price: '$19.99/month',
    features: ['All Basic Features', 'Feature 4', 'Feature 5'],
    productId: 'prod_S123',
  },
];

export default function CheckoutPage({
  stripePublishableKey,
}: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  // Initialize Stripe on the client side
  useEffect(() => {
    if (stripePublishableKey) {
      setStripePromise(loadStripe(stripePublishableKey));
    }
  }, [stripePublishableKey]);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      setError('');

      // Call our API to create a Stripe checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (!stripePromise) {
        throw new Error('Stripe is not initialized');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Choose a Subscription Plan</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SUBSCRIPTION_OPTIONS.map((option) => (
          <div
            key={option.productId}
            className="rounded-lg border p-6 shadow-sm"
          >
            <h2 className="mb-2 text-xl font-semibold">{option.name}</h2>
            <p className="mb-4 text-2xl font-bold">{option.price}</p>

            <ul className="mb-6 space-y-2">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant="storyhero"
              onClick={() => handleSubscribe(option.productId)}
              disabled={loading}
              className="w-full rounded px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Subscribe to ${option.name}`}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          This is a test implementation. In production, use real price IDs from
          your Stripe dashboard.
        </p>
        <p>You can test the implementation with Stripe test cards.</p>
      </div>
    </div>
  );
}
