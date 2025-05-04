interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
}

export default function FeatureCard({
  title,
  description,
  iconName,
}: FeatureCardProps) {
  return (
    <div className="bg-card flex flex-col items-center rounded-lg p-6 text-center shadow-lg">
      <div className="mb-4 h-16 w-16">
        <img
          src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/public-assets/${iconName}.svg`}
          alt={title}
          className="h-full w-full"
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}
