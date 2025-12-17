import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>© 2024 World Pin Map</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
