import VideoInputButton from '@/components/landing/VideoInputButton';
import { WordRotate } from '@/components/ui/word-rotate';

export default function HeroSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-8 text-center">
      <div className="relative flex flex-col items-center space-y-8">
        <h1 className="flex flex-col items-center space-y-4 text-4xl leading-tight font-extrabold md:gap-5 md:text-6xl">
          <span>Turn your long videos</span>
          <div className="flex items-center space-x-2">
            <span>into</span>
            <div className="bg-foreground text-background rounded-md px-2 md:px-6 md:py-2">
              <WordRotate
                words={['shorts', 'clips', 'stories', 'memes', 'parts']}
                duration={1200}
              />
            </div>
          </div>
        </h1>
        <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
          StoryHero lets you simulate 100s of fans
          <br className="hidden md:block" />
          clipping your content for you.
        </p>
      </div>

      <VideoInputButton />
    </section>
  );
}
