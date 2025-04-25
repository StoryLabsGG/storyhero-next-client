import HeroSection from '@/components/landing/HeroSection';
import Particles from '@/components/ui/particles';

export default function LandingPage() {
  return (
    <div className="border">
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={30}
        ease={20}
        color="#EA580C"
      />

      <div>
        <HeroSection />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <video
          className="border-storyhero w-full rounded-lg border-2 shadow-lg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/public-assets/Link.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
}
