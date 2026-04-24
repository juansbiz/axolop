/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // HIFICOPY Unified Branding — INBOXEQ reference
        // Primary BG / Headers / Footers
        black: {
          DEFAULT: "#101010",
          50: "#1a1a1a",
          100: "#242424",
          200: "#2e2e2e",
          300: "#383838",
          400: "#424242",
          500: "#4c4c4c",
          600: "#565656",
          700: "#606060",
          800: "#6a6a6a",
          900: "#747474",
        },
        // Accent / CTA / Highlights
        yellow: {
          DEFAULT: "#f2ff00",
          50: "#fdffb3",
          100: "#fdff80",
          200: "#fcff4d",
          300: "#fcff1a",
          400: "#f9ff00",
          500: "#f2ff00",
          600: "#c2cc00",
          700: "#919900",
          800: "#616600",
          900: "#303300",
        },
        // Primary brand mapping
        primary: {
          DEFAULT: "#f2ff00",
          foreground: "#101010",
          hover: "#e6e600",
          light: "#f2ff00",
          dark: "#101010",
          accent: "#f2ff00",
        },
        // Brand colors — unified HIFICOPY palette
        brand: {
          yellow: "#f2ff00",
          accent: "#f2ff00",
          dark: "#101010",
          black: "#101010",
        },
        // Surface colors
        surface: {
          light: "#ffffff",
          dark: "#101010",
        },
        // Neutral palette
        neutral: {
          50: "#fafafa",
          100: "#f5f5f7",
          200: "#e5e5e7",
          300: "#d2d2d7",
          400: "#a1a1a6",
          500: "#86868b",
          600: "#636366",
          700: "#48484a",
          800: "#3a3a3c",
          900: "#1d1d1f",
        },
        // Semantic colors
        success: "#30d158",
        warning: "#f2ff00",
        error: "#ff453a",
        info: "#007aff",
        // CRM specific
        "crm-sidebar": "#101010",
        "crm-sidebar-hover": "#1a1a1a",
        "crm-sidebar-active": "#f2ff00",
        "crm-bg-light": "#ffffff",
        "crm-bg-dark": "#101010",
        "crm-text-primary": "#ffffff",
        "crm-text-secondary": "#a3a3a3",
        "crm-border": "#2a2a2a",
        "crm-accent": "#f2ff00",
        // CSS Variable-based
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // Headers / Nav / Logo — Bebas Neue
        bebas: ["Bebas Neue", "sans-serif"],
        // Body text — Inter
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Monaco", "monospace"],
      },
      fontSize: {
        hero: ["48px", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        display: ["36px", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
        headline: ["24px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        title: ["18px", { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500", textTransform: "uppercase" }],
        xs: ["11px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
        base: ["14px", { lineHeight: "20px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["18px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "1.2" }],
        "4xl": ["36px", { lineHeight: "1.1" }],
        "5xl": ["48px", { lineHeight: "1" }],
        "6xl": ["60px", { lineHeight: "1" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "var-radius": "var(--radius)",
        "var-radius-md": "calc(var(--radius) - 2px)",
        "var-radius-sm": "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        // Yellow glow for CTA buttons
        "yellow-glow": "0 0 25px -5px rgba(242, 255, 0, 0.6)",
        "yellow-glow-hover": "0 0 35px -5px rgba(242, 255, 0, 0.8)",
        // Card shadows
        "crm-card": "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        "crm-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        "crm-modal": "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        // Glass morphism
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        // Unified brand gradient
        "brand-gradient": "linear-gradient(to right, #101010, #1a1a1a)",
        "brand-radial": "radial-gradient(circle at 50% 0%, #1a1a1a 0%, #101010 60%)",
        // Yellow CTA gradient
        "primary-gradient": "linear-gradient(to right, #f2ff00, #e6e600)",
        // Dark sidebar
        "sidebar-gradient": "linear-gradient(180deg, #101010 0%, #1a1a1a 100%)",
        // Silver text
        "silver-text": "linear-gradient(to bottom, #ffffff 30%, #a3a3a3 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(242, 255, 0, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(242, 255, 0, 0.6)" },
        },
        "spring-bounce": {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "50%": { transform: "scale(1.02)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "spring-slide": {
          "0%": { transform: "translateX(-10px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in-from-right 0.2s ease-out",
        "slide-out": "slide-out-to-right 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "spring-bounce": "spring-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spring-slide": "spring-slide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      scale: {
        98: "0.98",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};
