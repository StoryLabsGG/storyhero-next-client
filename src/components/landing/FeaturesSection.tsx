import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'Advanced video analysis',
    description:
      'AI-powered analysis to identify key moments and engagement opportunities in your content.',
    iconName: 'analysis-icon',
  },
  {
    title: 'Moment and storyline detection',
    description:
      'Automatically detect compelling moments and craft engaging narratives for your shorts.',
    iconName: 'storyline-icon',
  },
  {
    title: 'Integrated with shorts platforms',
    description:
      'Seamlessly publish to YouTube Shorts, TikTok, and Instagram Reels from one place.',
    iconName: 'platform-icon',
  },
  {
    title: 'Captions and video editing',
    description:
      'Auto-generate captions and edit your videos with AI-powered tools.',
    iconName: 'editing-icon',
  },
];

export default function FeaturesSection() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Let AI automate your shorts workflow
        </h1>
        <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
          So you can focus on what matters most.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            iconName={feature.iconName}
          />
        ))}
      </div>
    </div>
  );
}
