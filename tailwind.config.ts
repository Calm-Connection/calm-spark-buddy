import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Bobby Jones Soft', 'Balsamiq Sans', 'sans-serif'],
        heading: ['Bobby Jones Soft', 'Balsamiq Sans', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        warm: "hsl(var(--warm))",
        dustyRose: "hsl(var(--dusty-rose))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "twinkle": {
          "0%, 100%": { 
            opacity: "1", 
            transform: "scale(1)",
            filter: "brightness(1)"
          },
          "25%": { 
            opacity: "0.4", 
            transform: "scale(0.85)",
            filter: "brightness(0.6)"
          },
          "50%": { 
            opacity: "1", 
            transform: "scale(1.15)",
            filter: "brightness(1.4)"
          },
          "75%": { 
            opacity: "0.6", 
            transform: "scale(0.9)",
            filter: "brightness(0.8)"
          }
        },
        "bloom": {
          "0%": { 
            transform: "scale(0.3) rotate(-90deg)", 
            opacity: "0.3"
          },
          "50%": { 
            transform: "scale(1.05) rotate(0deg)", 
            opacity: "1"
          },
          "100%": { 
            transform: "scale(1) rotate(0deg)", 
            opacity: "1"
          }
        },
        "bloom-close": {
          "0%": { 
            transform: "scale(1) rotate(0deg)", 
            opacity: "1"
          },
          "100%": { 
            transform: "scale(0.5) rotate(-45deg)", 
            opacity: "0.6"
          }
        },
        "shimmer": {
          "0%": { 
            filter: "brightness(1) hue-rotate(0deg)",
            transform: "scale(1)"
          },
          "25%": { 
            filter: "brightness(1.3) hue-rotate(10deg)",
            transform: "scale(1.05)"
          },
          "50%": { 
            filter: "brightness(1.5) hue-rotate(20deg)",
            transform: "scale(1.1)"
          },
          "75%": { 
            filter: "brightness(1.3) hue-rotate(10deg)",
            transform: "scale(1.05)"
          },
          "100%": { 
            filter: "brightness(1) hue-rotate(0deg)",
            transform: "scale(1)"
          }
        },
        "breathe-in": {
          "0%": { 
            transform: "translateY(0px) scale(1)",
            opacity: "1"
          },
          "100%": { 
            transform: "translateY(-15px) scale(1.1)",
            opacity: "0.95"
          }
        },
        "breathe-out": {
          "0%": { 
            transform: "translateY(-15px) scale(1.1)",
            opacity: "0.95"
          },
          "100%": { 
            transform: "translateY(0px) scale(1)",
            opacity: "1"
          }
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.8"
          },
          "50%": { 
            transform: "translateY(-20px) translateX(10px)",
            opacity: "1"
          }
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 60px rgba(255, 255, 255, 0.8), 0 0 100px rgba(255, 255, 255, 0.4)"
          }
        },
        "grow": {
          "0%": { height: "0%" },
          "100%": { height: "60%" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "twinkle-slow": "twinkle 3s ease-in-out infinite",
        "twinkle-fast": "twinkle 1.5s ease-in-out infinite",
        "bloom": "bloom 4s ease-out forwards",
        "bloom-close": "bloom-close 4s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "shimmer-slow": "shimmer 4s ease-in-out infinite",
        "breathe-in": "breathe-in 4s ease-in-out forwards",
        "breathe-out": "breathe-out 4s ease-in-out forwards",
        "float": "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "grow": "grow 4s ease-out forwards"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
