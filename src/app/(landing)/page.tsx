import CreatorSection from '@/components/landing/CreatorCarousel';
import FAQSection from '@/components/landing/FAQSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import { Button } from '@/components/ui/button';
import Particles from '@/components/ui/particles';

export default function LandingPage() {
  return (
    <div className="relative">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={100}
        staticity={30}
        ease={20}
        color="#EA580C"
      />

      <div className="py-10 md:py-16">
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

      <div className="py-12 md:py-24">
        <CreatorSection />
      </div>

      <div className="py-12 md:py-24">
        <FeaturesSection />
      </div>

      <div className="relative py-12 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 pb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            From long-form to viral clips in four easy steps
          </h1>
          <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
            Our streamlined process makes it simple to transform your content
            and share it across platforms.
          </p>
        </div>

        <HowItWorksSection />
      </div>

      <div className="relative px-2 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 pb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            The best way to go viral in 2025 is clips...
          </h1>
          <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
            It's easy to digest, make, and viewers naturally find your other
            content.
          </p>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto w-full max-w-md md:max-w-6xl"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/public-assets/Memes.mp4`}
              type="video/mp4"
            />
          </video>
          <p className="text-muted-foreground md:text-md mt-4 text-base text-sm">
            On average, creators who repurpose who repurpose their content
            increase their views by 100%+.
          </p>
        </div>
      </div>

      <div className="px-2 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-5xl font-bold md:text-6xl">
            It's never been easier to become a creator.
          </h1>
          <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
            Use StoryHero to become a content machine.
          </p>
          <div className="pt-6">
            <Button
              className="bg-storyhero hover:bg-storyhero/80 rounded-full text-white"
              size={'xl'}
              variant={'gooeyLeft'}
            >
              Get Clips Now
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 py-12 md:py-24">
        <FAQSection />
      </div>
    </div>
  );
}
