import { MapPin } from 'lucide-react';

function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">World Pin Map</h1>
            <p className="text-sm text-muted-foreground">
              Drop pins anywhere on the globe and save your memories
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
