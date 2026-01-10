import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center space-y-3">
          {/* Crisis short disclaimer */}
          <p className="text-xs text-safety-critical flex items-center justify-center gap-1.5">
            <Heart className="h-3 w-3 flex-shrink-0" />
            <span>If you or your child feel unsafe or overwhelmed, please seek professional help.</span>
          </p>
          
          {/* Ultra-short combined disclaimer */}
          <p className="text-xs text-muted-foreground font-medium">
            Calm Connection offers wellbeing tools, not professional care.
          </p>
          
          <div className="text-xs text-muted-foreground font-medium space-y-1 pt-2">
            <p>© {new Date().getFullYear()} Calm Connection. All rights reserved.</p>
            <p>Designed with 💜 for children's wellbeing</p>
          </div>
          
          {/* Link to Learn More */}
          <Link 
            to="/learn-more" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block font-medium"
          >
            About • Privacy • Policies
          </Link>
        </div>
      </div>
    </footer>
  );
}
