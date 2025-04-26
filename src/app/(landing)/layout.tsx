import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <div className="flex flex-row justify-center">
        <div className="container">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
