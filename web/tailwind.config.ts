import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Tokens, não fontes hardcoded. Antes these linhas fixavam
				// Cinzel/Playfair direto aqui, e como `utilities` vence
				// `components` na cascata, a classe `font-display` ignorava
				// a variável --font-display do index.css — a troca para a
				// Cormorant (F3) nunca chegou ao render.
				display: ['var(--font-display)'],
				'display-sm': ['var(--font-display-sm)'],
				heading: ['var(--font-display)'],
				reading: ['var(--font-reading)'],
				body: ['var(--font-serif)'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Classical Library Colors
				'library-wood': 'hsl(var(--library-wood))',
				'library-wood-foreground': 'hsl(var(--library-wood-foreground))',
				'library-gold': 'hsl(var(--library-gold))',
				'library-parchment': 'hsl(var(--library-parchment))',
				'library-parchment-surface': 'hsl(var(--library-parchment-surface))',
				'library-leather': 'hsl(var(--library-leather))',
				'library-bronze': 'hsl(var(--library-bronze))',
				'library-bronze-foreground': 'hsl(var(--library-bronze-foreground))',
				'library-crimson': 'hsl(var(--library-crimson))',
				'library-crimson-foreground': 'hsl(var(--library-crimson-foreground))',
				'library-emerald': 'hsl(var(--library-emerald))',
				'library-canela': 'hsl(var(--library-canela))',
				'library-bege-areia': 'hsl(var(--library-bege-areia))',
				'library-dourado': 'hsl(var(--library-dourado))',
				'library-dourado-texto': 'hsl(var(--library-dourado-texto))',
				'library-dourado-texto-claro': 'hsl(var(--library-dourado-texto-claro))',
				'library-vinho': 'hsl(var(--library-vinho))',
				'library-grafite': 'hsl(var(--library-grafite))'
			},
			backgroundImage: {
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-leather': 'var(--gradient-leather)',
				'gradient-parchment': 'var(--gradient-parchment)',
			},
			boxShadow: {
				'book': 'var(--shadow-book)',
				'golden': 'var(--shadow-golden)',
				'deep': 'var(--shadow-deep)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [animate, typography],
} satisfies Config;
