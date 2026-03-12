import { createTheme, alpha } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

// ─── Tokens ───────────────────────────────────────────────────────────────────

const acid = {
  50:  '#f7fee7',
  100: '#ecfccb',
  200: '#d9f99d',
  300: '#bef264',
  400: '#a3e635',
  500: '#84cc16',
  600: '#65a30d',
  700: '#4d7c0f',
  800: '#3f6212',
  900: '#365314',
};

const lightTokens = {
  bg:        '#f9fafb',
  surface:   '#ffffff',
  surfaceAlt:'#f3f4f6',
  border:    '#e5e7eb',
  borderSub: '#d1d5db',
  textPri:   '#111827',
  textSec:   '#6b7280',
  textTer:   '#9ca3af',
};

const darkTokens = {
  bg:        '#090a08',
  surface:   '#111310',
  surfaceAlt:'#1a1d17',
  border:    '#1f2218',
  borderSub: '#2a2f22',
  textPri:   '#f7fee7',
  textSec:   '#6b7a5a',
  textTer:   '#2e3825',
};

// ─── Factory ──────────────────────────────────────────────────────────────────

export const createTripVaultTheme = (mode: 'light' | 'dark') => {
  const t = mode === 'light' ? lightTokens : darkTokens;
  const accentMain  = mode === 'light' ? acid[500] : acid[400];
  const accentDark  = mode === 'light' ? acid[600] : acid[500];
  const accentLight = mode === 'light' ? acid[400] : acid[300];

  return createTheme({
    palette: {
      mode,
      primary: {
        main:        accentMain,
        dark:        accentDark,
        light:       accentLight,
        contrastText: mode === 'light' ? '#111827' : '#090a08',
      },
      secondary: {
        main:        mode === 'light' ? '#111827' : '#f7fee7',
        contrastText: mode === 'light' ? '#f9fafb' : '#090a08',
      },
      background: {
        default: t.bg,
        paper:   t.surface,
      },
      text: {
        primary:   t.textPri,
        secondary: t.textSec,
        disabled:  t.textTer,
      },
      divider: t.border,
      success: {
        main: acid[500],
        light: acid[300],
        dark:  acid[700],
        contrastText: '#111827',
      },
      error: {
        main:  '#ef4444',
        light: '#fca5a5',
        dark:  '#b91c1c',
      },
      warning: {
        main:  '#f59e0b',
        light: '#fcd34d',
        dark:  '#b45309',
      },
      info: {
        main:  '#3b82f6',
        light: '#93c5fd',
        dark:  '#1d4ed8',
      },
      action: {
        hover:              alpha(accentMain, 0.08),
        selected:           alpha(accentMain, 0.14),
        disabledBackground: t.surfaceAlt,
        disabled:           t.textTer,
        focus:              alpha(accentMain, 0.18),
      },
    },

    shape: { borderRadius: 8 },

    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      fontWeightLight:   300,
      fontWeightRegular: 400,
      fontWeightMedium:  500,
      fontWeightBold:    600,

      h1: { fontSize: '2rem',     fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1.2 },
      h2: { fontSize: '1.5rem',   fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.3 },
      h3: { fontSize: '1.25rem',  fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.4 },
      h4: { fontSize: '1.1rem',   fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.4 },
      h5: { fontSize: '1rem',     fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.5 },
      h6: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.5 },

      subtitle1: { fontSize: '0.875rem', fontWeight: 400, letterSpacing: '-0.01em' },
      subtitle2: { fontSize: '0.75rem',  fontWeight: 500, letterSpacing: '0.02em'  },

      body1: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6 },
      body2: { fontSize: '0.875rem',  fontWeight: 400, lineHeight: 1.6 },

      caption: {
        fontSize:      '0.6875rem',
        fontWeight:    400,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        color:         t.textTer,
      },
      overline: {
        fontSize:      '0.625rem',
        fontWeight:    500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
      },
      button: {
        fontSize:      '0.875rem',
        fontWeight:    500,
        letterSpacing: '0.02em',
        textTransform: 'none' as const,
      },
    },

    shadows: [
      'none',
      `0 1px 2px ${alpha(t.textPri, 0.04)}`,
      `0 1px 4px ${alpha(t.textPri, 0.06)}`,
      `0 2px 8px ${alpha(t.textPri, 0.08)}`,
      `0 4px 12px ${alpha(t.textPri, 0.10)}`,
      `0 6px 16px ${alpha(t.textPri, 0.12)}`,
      ...Array(19).fill('none'),
    ] as Shadows,

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; }
          body { background-color: ${t.bg}; }
        `,
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            letterSpacing: '0.01em',
            textTransform: 'none',
            transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
          },
          containedPrimary: {
            backgroundColor: accentMain,
            color: mode === 'light' ? '#111827' : '#090a08',
            border: `0.5px solid ${accentDark}`,
            '&:hover': { backgroundColor: accentDark },
            '&:active': { transform: 'scale(0.98)' },
            '&.Mui-disabled': {
              backgroundColor: t.surfaceAlt,
              color: t.textTer,
              border: `0.5px solid ${t.border}`,
            },
          },
          outlinedPrimary: {
            border: `0.5px solid ${t.border}`,
            color: t.textPri,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: t.surfaceAlt,
              border: `0.5px solid ${t.borderSub}`,
            },
          },
          textPrimary: {
            color: accentMain,
            '&:hover': { backgroundColor: alpha(accentMain, 0.08) },
          },
          sizeSmall:  { padding: '4px 12px',  fontSize: '0.8125rem' },
          sizeMedium: { padding: '7px 18px',  fontSize: '0.875rem'  },
          sizeLarge:  { padding: '10px 24px', fontSize: '0.9375rem' },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': { backgroundColor: t.surfaceAlt },
          },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            border: `0.5px solid ${t.border}`,
            borderRadius: 12,
            boxShadow: 'none',
            transition: 'border-color 150ms ease',
            '&:hover': { borderColor: t.borderSub },
          },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '16px 20px',
            '&:last-child': { paddingBottom: 16 },
          },
        },
      },

      MuiCardHeader: {
        styleOverrides: {
          root: { padding: '16px 20px 0' },
          title: { fontSize: '0.9375rem', fontWeight: 500, letterSpacing: '-0.01em' },
          subheader: {
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: t.textTer,
            marginTop: 2,
          },
        },
      },

      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: t.surface,
            border: `0.5px solid ${t.border}`,
            borderRadius: 12,
          },
          rounded: { borderRadius: 12 },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: t.surface,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: t.border,
              borderWidth: '0.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: t.borderSub,
              borderWidth: '0.5px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: accentMain,
              borderWidth: '1.5px',
            },
          },
          input: { padding: '10px 14px', fontSize: '0.9375rem' },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            color: t.textSec,
            '&.Mui-focused': { color: accentMain },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.03em',
            height: 24,
          },
          colorPrimary: {
            backgroundColor: alpha(accentMain, 0.12),
            color: mode === 'light' ? acid[700] : acid[300],
            border: 'none',
          },
          outlined: { borderColor: t.border, borderWidth: '0.5px' },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 2, height: 3, backgroundColor: t.surfaceAlt },
          barColorPrimary: { backgroundColor: accentMain, borderRadius: 2 },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.border, borderBottomWidth: '0.5px' },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': { backgroundColor: t.surfaceAlt },
            '&.Mui-selected': {
              backgroundColor: alpha(accentMain, 0.1),
              '&:hover': { backgroundColor: alpha(accentMain, 0.14) },
            },
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '0.875rem',
            letterSpacing: '0.02em',
            color: t.textSec,
            '&.Mui-selected': { color: accentMain, fontWeight: 500 },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: accentMain,
            height: 2,
            borderRadius: '2px 2px 0 0',
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'light' ? '#111827' : '#f7fee7',
            color: mode === 'light' ? '#f9fafb' : '#090a08',
            fontSize: '0.75rem',
            borderRadius: 6,
            padding: '4px 10px',
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: accentMain,
              '& + .MuiSwitch-track': { backgroundColor: accentMain, opacity: 0.7 },
            },
          },
        },
      },

      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            borderTop: `0.5px solid ${t.border}`,
            height: 60,
          },
        },
      },

      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: t.textTer,
            minWidth: 'auto',
            '&.Mui-selected': { color: accentMain },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.6875rem',
              letterSpacing: '0.04em',
              '&.Mui-selected': { fontSize: '0.6875rem' },
            },
          },
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'transparent' },
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            borderBottom: `0.5px solid ${t.border}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: { backgroundColor: t.surfaceAlt, borderRadius: 6 },
        },
      },

      MuiBadge: {
        styleOverrides: {
          badge: {
            fontSize: '0.625rem',
            fontWeight: 500,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
          },
          colorPrimary: { backgroundColor: accentMain, color: '#111827' },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 8, border: '0.5px solid', fontSize: '0.875rem' },
          standardSuccess: {
            backgroundColor: alpha(accentMain, 0.08),
            borderColor: alpha(accentMain, 0.25),
            color: mode === 'light' ? acid[800] : acid[200],
          },
        },
      },
    },
  });
};
