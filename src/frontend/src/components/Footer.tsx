import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
