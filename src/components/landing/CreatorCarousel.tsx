import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { InfiniteSlider } from '@/components/ui/infinite-scroller';
import Particles from '@/components/ui/particles';

interface CreatorProps {
  name: string;
  followers: string | number;
  image: string;
}

const creators = [
  {
    name: 'MagicGum',
    followers: '500K',
    image:
      'https://yt3.googleusercontent.com/ytc/AIdro_kpaRCZAo7Kehp7TMrtlCYltcrwAS3uTTQAwpqjcNHXzGQ=s160-c-k-c0x00ffffff-no-rj',
  },
];

// Duplicate the creators array 10 times
const duplicatedCreators = Array(10).fill(creators).flat();

function Creator({ name, image, followers }: CreatorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
      <Avatar className="h-12 w-12">
        <AvatarImage src={image} />
      </Avatar>
      <span className="text-sm font-bold">{name}</span>
      <span className="text-muted-foreground text-xs">
        {followers} followers
      </span>
    </div>
  );
}

export default function CreatorSection() {
  return (
    <div className="relative flex h-fit w-full justify-center overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={40}
        staticity={30}
        ease={20}
        color="#EA580C"
      />
      <section className="relative z-10 container text-center">
        <h2 className="text-muted-foreground mb-8 text-xl font-medium">
          Loved by top creators ❤️
        </h2>

        <InfiniteSlider
          duration={180}
          durationOnHover={180}
          gap={32}
          className="mb-8"
          reverse={false}
        >
          {duplicatedCreators.map((creator, index) => (
            <Creator key={index} {...creator} />
          ))}
        </InfiniteSlider>
      </section>
    </div>
  );
}
