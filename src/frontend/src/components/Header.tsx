import { MapPin } from 'lucide-react';

function Header() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">World Map Pins</h1>
            <p className="text-sm text-muted-foreground">Click anywhere to add your memories</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
