module.exports = {
    important: false,
    content: [
        "src/views/**/*.twig",
        "src/assets/js/**/*.js",
        'node_modules/@salla.sa/twilight-tailwind-theme/safe-list-css.txt',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '16px',
            screens: { '2xl': '1280px' }
        },
        fontFamily: {
            sans: ['var(--font-main)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            primary: 'var(--font-main)',
        },
        extend: {
            colors: {
                // ── Brand ─────────────────────────────────────
                'primary':       'var(--color-primary)',
                'primary-dark':  'var(--color-primary-dark)',
                'primary-light': 'var(--color-primary-light)',
                'gold':          'var(--color-gold)',
                'gold-dark':     'var(--color-gold-dark)',
                'purple':        'var(--color-purple)',
                // ── Surfaces ──────────────────────────────────
                'base':       'var(--bg-base)',
                'surface':    'var(--bg-surface)',
                'surface-2':  'var(--bg-surface-2)',
                'surface-3':  'var(--bg-surface-3)',
                // ── Text ──────────────────────────────────────
                'text-primary':   'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted':     'var(--text-muted)',
                // ── Legacy ────────────────────────────────────
                'dark':        '#0F0F1A',
                'darker':      '#09090F',
                'danger':      '#FF4D4D',
                'primary-dark-legacy': 'var(--color-primary-dark)',
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-gold':    'var(--gradient-gold)',
                'gradient-dark':    'var(--gradient-dark)',
                'gradient-card':    'var(--gradient-card)',
                'glow-blue':  'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.15) 0%, transparent 70%)',
                'glow-gold':  'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,209,102,0.12) 0%, transparent 70%)',
                'grid-dark':  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            },
            boxShadow: {
                'blue':    'var(--shadow-blue)',
                'gold':    'var(--shadow-gold)',
                'card':    'var(--shadow-card)',
                'header':  'var(--shadow-header)',
                'glow-sm': '0 0 12px rgba(0, 212, 255, 0.25)',
                'glow-md': '0 0 24px rgba(0, 212, 255, 0.30)',
                'glow-lg': '0 0 48px rgba(0, 212, 255, 0.25)',
                'default': '0 4px 24px rgba(0,0,0,0.40)',
                'top':     '0 -4px 24px rgba(0,0,0,0.30)',
                'md':      '0 8px 32px rgba(0,0,0,0.40)',
                'dropdown':'0 8px 32px rgba(0,0,0,0.60)',
                'light':   '0 2px 12px rgba(0,0,0,0.30)',
                'huge':    '0 16px 64px rgba(0,0,0,0.60)',
                'progress':'0 4px 16px rgba(0,212,255,0.30)',
                'mobile':  '0 8px 32px rgba(0,0,0,0.60)',
            },
            borderRadius: {
                'tiny':  'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                'large': 'var(--radius-lg)',
                'big':   'var(--radius-xl)',
            },
            borderColor: {
                DEFAULT:  'var(--border-default)',
                'subtle': 'var(--border-subtle)',
                'strong': 'var(--border-strong)',
            },
            spacing: {
                '3.75': '15px',
                '7.5':  '30px',
                '58':   '232px',
                '62':   '248px',
                '100':  '28rem',
                '116':  '464px',
                '132':  '528px',
                '200':  '800px',
            },
            fontSize: {
                'icon-lg':    '33px',
                'xxs':        '10px',
                'xxxs':       '8px',
                'title-size': '42px',
                '22px':       '22px',
                'hero':       'clamp(2.5rem, 6vw, 5rem)',
                'hero-sm':    'clamp(1.75rem, 4vw, 3rem)',
                'section':    'clamp(1.5rem, 3vw, 2.25rem)',
            },
            lineHeight: {
                '12': '3rem',
                '14': '3.5rem',
                '16': '4rem',
                '18': '4.5rem',
                '20': '5rem',
            },
            height: {
                'hero':       '100vh',
                'hero-md':    '85vh',
                'banner':     '200px',
                'lg-banner':  '480px',
                'full-banner':'640px',
                '500':        '500px',
                '460':        '460px',
            },
            width: {
                '18': '4.5rem',
                '22': '5.5rem',
                '74': '18.5rem',
                '76': '19rem',
                '78': '19.5rem',
            },
            minWidth: {
                '1/4': '25%', '1/2': '50%', '3/4': '75%',
            },
            maxWidth: {
                '1/4': '25%', '1/2': '50%', '3/4': '75%',
            },
            zIndex: {
                '1': '1', '2': '2', '-1': '-1',
            },
            screens: {
                'xxs': { min: '380px', max: '479px' },
                'xs':  '480px',
            },
            transitionTimingFunction: {
                'elastic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'smooth':  'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionProperty: {
                'height': 'height',
            },
            keyframes: {
                fadeUp: {
                    '0%':   { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.2)' },
                    '50%':      { boxShadow: '0 0 40px rgba(0,212,255,0.4)' },
                },
                gradientShift: {
                    '0%':   { backgroundPosition: '0% 50%' },
                    '50%':  { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-12px)' },
                },
                slideUpFromBottom: {
                    '0%':   { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0%)',   opacity: '1' },
                },
                slideDownFromBottom: {
                    '0%':   { transform: 'translateY(0%)',   opacity: '1' },
                    '100%': { transform: 'translateY(100%)', opacity: '0' },
                },
                marquee: {
                    '0%':   { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                'fade-up':              'fadeUp 0.6s var(--ease-smooth) forwards',
                'fade-in':              'fadeIn 0.5s ease forwards',
                'glow-pulse':           'glowPulse 2.5s ease-in-out infinite',
                'gradient-shift':       'gradientShift 4s ease infinite',
                'float':                'float 4s ease-in-out infinite',
                'slideUpFromBottom':    'slideUpFromBottom .6s linear',
                'slideDownFromBottom':  'slideDownFromBottom .6s linear',
                'marquee':              'marquee 25s linear infinite',
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
        },
    },
    corePlugins: {
        outline: false,
    },
    plugins: [
        require('@salla.sa/twilight-tailwind-theme'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
    ],
};
