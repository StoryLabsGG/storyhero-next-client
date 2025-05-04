import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'Text hooks',
    description: 'Generate scroll-stopping text hooks that are relevant.',
    iconName: 'analysis-icon',
  },
  {
    title: 'Moment and storyline detection',
    description: 'Take the most viral-worthy parts of your video.',
    iconName: 'storyline-icon',
  },
  {
    title: 'Custom Presets',
    description: 'Choose your background, captions, and formatting.',
    iconName: 'platform-icon',
  },
  {
    title: 'Captions and video editing',
    description: 'Weaving it all together for you.',
    iconName: 'editing-icon',
  },
];

export default function FeaturesSection() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Everything you need to make high-quality shorts
        </h1>
        <p className="text-muted-foreground w-[75%] text-sm md:w-full md:text-xl">
          Built for creators, by creators.
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
