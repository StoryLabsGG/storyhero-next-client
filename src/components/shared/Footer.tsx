import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/shared/Logo';

function FooterLink({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href}>
      <p className="text-muted-foreground text-sm">{title}</p>
    </Link>
  );
}

export default function Footer() {
  const links = [
    { title: 'Home', href: '/' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Blog', href: '/blog' },
    { title: 'Affiliate', href: '/affiliate' },
  ];

  const terms = [
    { title: 'Terms of service', href: '/terms' },
    { title: 'Privacy policy', href: '/privacy' },
  ];

  const mapLinks = (links: { title: string; href: string }[]) =>
    links.map((link) => <FooterLink key={link.title} {...link} />);

  return (
    <div className="flex w-full items-center justify-between pb-5">
      <footer className="bg-background/80 text-foreground relative z-10 flex w-full flex-col items-center justify-between gap-4 px-4 py-2">
        <div className="container flex w-full flex-col items-center justify-between gap-4">
          <div className="flex w-full items-center justify-between">
            <Logo />
            <div className="flex items-center gap-6">{mapLinks(links)}</div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-muted-foreground text-xs">
                © StoryLabs LLC. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <InstagramIcon className="h-4 w-4" />
                <FacebookIcon className="h-4 w-4" />
                <TwitterIcon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex items-center gap-4">{mapLinks(terms)}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
