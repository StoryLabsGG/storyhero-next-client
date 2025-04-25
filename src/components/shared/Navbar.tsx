import { Button } from '@/components/ui/button';

import Logo from './Logo';

export default function Navbar() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo />
      </div>

      <div>
        <Button variant="outline">Dashboard</Button>
      </div>
    </div>
  );
}
