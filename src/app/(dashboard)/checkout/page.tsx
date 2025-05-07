import CheckoutPage from '@/components/checkout/CheckoutPage';

export default async function Checkout() {
  return (
    <CheckoutPage stripePublishableKey={process.env.STRIPE_PUBLISHABLE_KEY!} />
  );
}
