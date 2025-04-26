import Particles from '@/components/ui/particles';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={100}
        staticity={30}
        ease={20}
        color="#EA580C"
      />
      {children}
    </main>
  );
}
