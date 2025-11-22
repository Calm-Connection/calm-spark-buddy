import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>© {new Date().getFullYear()} Calm Connection. All rights reserved.</p>
            <p>Designed with 💜 for children's wellbeing</p>
          </div>
          
          {/* Subtle link to Learn More */}
          <Link 
            to="/learn-more" 
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors inline-block"
          >
            About • Privacy • Policies
          </Link>
        </div>
      </div>
    </footer>
  );
}
