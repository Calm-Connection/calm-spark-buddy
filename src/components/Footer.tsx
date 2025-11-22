import { Link } from 'react-router-dom';
import { Shield, FileText, UserX, Lock, Mail } from 'lucide-react';

export function Footer() {
  const links = [
    { to: '/learn-more', label: 'Learn More', icon: FileText },
    { to: '/learn-more#privacy', label: 'Privacy', icon: Lock },
    { to: '/learn-more#safeguarding', label: 'Safeguarding', icon: Shield },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a
              href="mailto:holly@calmconnectiongroup.com"
              className="hover:text-foreground transition-colors"
            >
              holly@calmconnectiongroup.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Calm Connection. All rights reserved.</p>
          <p className="mt-1">Designed with 💜 for children's wellbeing</p>
        </div>
      </div>
    </footer>
  );
}
