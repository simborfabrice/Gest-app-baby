import { AppTheme, BoxRadius, BoxStyle } from '../types';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  boxColor: string;
  boxStyle: BoxStyle;
  previewBg: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'rose_bleu',
    name: 'Rose & Bleu Gest’app Baby',
    description: 'Thème emblématique : rose pimpant, bleu azur et cases blanc lumineux.',
    primary: '#f43f5e',
    secondary: '#2563eb',
    boxColor: '#ffffff',
    boxStyle: 'clean',
    previewBg: 'linear-gradient(135deg, #f43f5e, #2563eb)'
  },
  {
    id: 'douceur_rose_poudre',
    name: 'Cases Poudrées Rose & Ciel',
    description: 'Harmonie tendresse : toutes les cases teintées d’un rose très délicat.',
    primary: '#e11d48',
    secondary: '#0284c7',
    boxColor: '#fff1f2',
    boxStyle: 'custom',
    previewBg: 'linear-gradient(135deg, #fb7185, #38bdf8)'
  },
  {
    id: 'douceur_bleu_nuage',
    name: 'Cases Nuage Bleu & Rose',
    description: 'Atmosphère calme : toutes les cases en bleu pastel doux.',
    primary: '#2563eb',
    secondary: '#f43f5e',
    boxColor: '#f0f7ff',
    boxStyle: 'custom',
    previewBg: 'linear-gradient(135deg, #3b82f6, #f43f5e)'
  },
  {
    id: 'violet_gestapp',
    name: 'Violet Gest’App Original & Rose',
    description: 'Inspiré de votre logo original prune profond et calligraphie G’A.',
    primary: '#4a0e4e',
    secondary: '#f43f5e',
    boxColor: '#ffffff',
    boxStyle: 'clean',
    previewBg: 'linear-gradient(135deg, #4a0e4e, #f43f5e)'
  },
  {
    id: 'bleu_ocean',
    name: 'Bleu Océan & Lagon',
    description: 'Camaïeu professionnel bleu roi et ciel avec cases blanches nettes.',
    primary: '#1d4ed8',
    secondary: '#0284c7',
    boxColor: '#ffffff',
    boxStyle: 'clean',
    previewBg: 'linear-gradient(135deg, #1d4ed8, #0284c7)'
  },
  {
    id: 'emeraude_menthe',
    name: 'Émeraude & Menthe Douce',
    description: 'Cases vert d’eau rafraîchissantes et apaisantes.',
    primary: '#059669',
    secondary: '#10b981',
    boxColor: '#f0fdf4',
    boxStyle: 'custom',
    previewBg: 'linear-gradient(135deg, #059669, #10b981)'
  },
  {
    id: 'corail_peche',
    name: 'Corail Pêche & Ambre',
    description: 'Chaleureux et dynamique avec cases beige crème veloutées.',
    primary: '#ea580c',
    secondary: '#8b5cf6',
    boxColor: '#fffbeb',
    boxStyle: 'custom',
    previewBg: 'linear-gradient(135deg, #ea580c, #8b5cf6)'
  },
  {
    id: 'lavande_fuchsia',
    name: 'Lavande Douce & Fuchsia',
    description: 'Teinte poétique violette avec cases lilas pastel.',
    primary: '#7c3aed',
    secondary: '#ec4899',
    boxColor: '#faf5ff',
    boxStyle: 'custom',
    previewBg: 'linear-gradient(135deg, #7c3aed, #ec4899)'
  }
];

export const BOX_COLOR_PALETTES = [
  { id: 'pure_white', name: 'Blanc Pur', hex: '#ffffff', border: '#e2e8f0', desc: 'Classique & épuré' },
  { id: 'rose_pastel', name: 'Rose Douceur', hex: '#fff1f2', border: '#fecdd3', desc: 'Teinte câline' },
  { id: 'bleu_pastel', name: 'Bleu Ciel', hex: '#f0f7ff', border: '#bae6fd', desc: 'Sérénité' },
  { id: 'menthe_pastel', name: 'Menthe Fraîche', hex: '#f0fdf4', border: '#bbf7d0', desc: 'Nature & zen' },
  { id: 'creme_vanille', name: 'Crème Chaud', hex: '#fffbeb', border: '#fde68a', desc: 'Ambiance feutrée' },
  { id: 'lavande_pastel', name: 'Lilas Doux', hex: '#faf5ff', border: '#e9d5ff', desc: 'Poétique' },
  { id: 'peche_pastel', name: 'Pêche Tendre', hex: '#fff7ed', border: '#fed7aa', desc: 'Chaleureux' },
  { id: 'gris_perle', name: 'Gris Perle', hex: '#f8fafc', border: '#e2e8f0', desc: 'Moderne minéral' },
];

export const DEFAULT_THEME: AppTheme = {
  primaryColor: '#f43f5e',
  secondaryColor: '#2563eb',
  boxColor: '#ffffff',
  boxBorderColor: '#e2e8f0',
  boxStyle: 'clean',
  borderRadius: 'rounded',
};

/**
 * Convert Hex color to RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = (hex || '#000000').replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 244, g: 63, b: 94 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate perceived luminance to ensure readable text
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Generate CSS Custom Properties object based on the chosen theme
 */
export function getThemeStyles(theme: AppTheme): React.CSSProperties {
  const primary = theme.primaryColor || '#f43f5e';
  const secondary = theme.secondaryColor || '#2563eb';
  const pRgb = hexToRgb(primary);
  const sRgb = hexToRgb(secondary);

  let radiusVal = '1rem'; // 16px
  if (theme.borderRadius === 'sharp') radiusVal = '0.25rem'; // 4px
  if (theme.borderRadius === 'standard') radiusVal = '0.625rem'; // 10px
  if (theme.borderRadius === 'rounded') radiusVal = '1rem'; // 16px
  if (theme.borderRadius === 'extra') radiusVal = '1.5rem'; // 24px

  let boxBg = '#ffffff';
  let boxBorder = 'rgba(226, 232, 240, 0.9)'; // default border

  if (theme.boxStyle === 'clean') {
    boxBg = '#ffffff';
    boxBorder = theme.boxBorderColor || `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.18)`;
  } else if (theme.boxStyle === 'pastel') {
    boxBg = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.05)`;
    boxBorder = theme.boxBorderColor || `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.22)`;
  } else if (theme.boxStyle === 'intense') {
    boxBg = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.12)`;
    boxBorder = theme.boxBorderColor || `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.35)`;
  } else if (theme.boxStyle === 'custom') {
    boxBg = theme.boxColor || '#ffffff';
    const bRgb = hexToRgb(boxBg);
    // Darken box border slightly relative to box color or use primary tint
    boxBorder = theme.boxBorderColor || `rgba(${Math.max(0, bRgb.r - 40)}, ${Math.max(0, bRgb.g - 40)}, ${Math.max(0, bRgb.b - 40)}, 0.35)`;
  }

  return {
    // Primary and Secondary Colors
    '--theme-primary': primary,
    '--theme-secondary': secondary,
    
    // Light accents
    '--theme-primary-5': `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.05)`,
    '--theme-primary-10': `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.10)`,
    '--theme-primary-20': `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.20)`,
    '--theme-primary-border': `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.25)`,

    '--theme-secondary-5': `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.05)`,
    '--theme-secondary-10': `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.10)`,
    '--theme-secondary-20': `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.20)`,
    '--theme-secondary-border': `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.25)`,

    // Dynamic Box / Case Backgrounds & Borders
    '--theme-box-bg': boxBg,
    '--theme-box-bg-alt': boxBg === '#ffffff' ? `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.04)` : boxBg,
    '--theme-box-border': boxBorder,

    // Radius
    '--theme-radius': radiusVal,
  } as React.CSSProperties;
}
