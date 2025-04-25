import Navbar from '@/components/shared/Navbar';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-center">
      <div className="container">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
