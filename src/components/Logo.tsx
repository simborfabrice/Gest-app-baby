import React from 'react';

export type LogoVariant = 'gestapp_officiel' | 'gestapp_rose_bleu' | 'coeur_bebe' | 'petits_pieds' | 'mains_protectrices' | 'berceau_etoile';

export interface LogoOption {
  id: LogoVariant;
  name: string;
  description: string;
  badge: string;
}

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'gestapp_officiel',
    name: 'Gest’App Original (Votre Logo)',
    description: 'Votre création originale avec le cercle violet profond et la calligraphie G’A (Gest’App).',
    badge: 'Logo Officiel'
  },
  {
    id: 'gestapp_rose_bleu',
    name: 'Gest’App Baby (Édition Rose & Bleu)',
    description: 'Votre typographie G’A réinterprétée sur le médaillon dégradé bleu ciel et rose fuchsia.',
    badge: 'Thématique'
  },
  {
    id: 'coeur_bebe',
    name: 'Bébé & Cœur Tendresse',
    description: 'Visage de bébé souriant lové dans un cœur protecteur bleu et rose.',
    badge: 'Illustré'
  },
  {
    id: 'petits_pieds',
    name: 'Petits Petons Douceur',
    description: 'Deux empreintes de pas de nouveau-né, l’un bleu ciel et l’autre rose poudré.',
    badge: 'Poétique'
  },
  {
    id: 'mains_protectrices',
    name: 'Mains Protectrices Nounou',
    description: 'Deux mains bienveillantes berçant l’enfant, symbole de sécurité et confiance.',
    badge: 'Professionnel'
  },
  {
    id: 'berceau_etoile',
    name: 'Berceau & Étoile Veilleuse',
    description: 'Berceau suspendu stylisé surplombé d’une étoile protectrice.',
    badge: 'Moderne'
  }
];

export const LogoIcon: React.FC<{
  variant: LogoVariant;
  customImageDataUrl?: string | null;
  className?: string;
}> = ({ variant, customImageDataUrl, className = 'w-10 h-10' }) => {
  // If user uploaded a custom image and variant is gestapp_officiel with custom image
  if (customImageDataUrl && variant === 'gestapp_officiel') {
    return (
      <img
        src={customImageDataUrl}
        alt="Logo Gest'App Baby"
        className={`${className} object-contain rounded-full`}
      />
    );
  }

  switch (variant) {
    case 'gestapp_officiel':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Deep Violet/Plum circle as in user's image */}
          <circle cx="50" cy="50" r="48" fill="#4a0e4e" />
          
          {/* Calligraphic G */}
          <path
            d="M35 25 C 24 28, 22 45, 23 58 C 24 68, 30 72, 38 70 C 43 68, 44 55, 43 45 L 29 47"
            stroke="#000000"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Vertical stem inside G */}
          <path
            d="M42 39 L 43 72"
            stroke="#000000"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Text 'Est' in handwritten chalk font style inside the top of G */}
          <text
            x="36"
            y="26"
            fill="#ffffff"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="bold"
            fontSize="11"
            letterSpacing="-0.5"
          >
            Est
          </text>

          {/* Apostrophe between G and A */}
          <path
            d="M47 46 C 48 45, 49 46, 48 48 C 47 49, 46 48, 47 46 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.8"
          />

          {/* Calligraphic A */}
          {/* Left long leg going deep down */}
          <path
            d="M62 14 L 47 88"
            stroke="#000000"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Right leg */}
          <path
            d="M62 14 L 66 69"
            stroke="#000000"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Horizontal crossbar of A */}
          <path
            d="M46 51 L 67 51"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Text 'pp' at bottom right of A */}
          <text
            x="68"
            y="68"
            fill="#ffffff"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="bold"
            fontSize="11"
            letterSpacing="-0.5"
          >
            pp
          </text>
        </svg>
      );

    case 'gestapp_rose_bleu':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="g_ga_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="75%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <linearGradient id="g_ga_inner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fff1f2" />
            </linearGradient>
          </defs>
          
          {/* Gradient Rose & Blue Ring & Background */}
          <circle cx="50" cy="50" r="48" fill="url(#g_ga_grad)" />
          <circle cx="50" cy="50" r="43" fill="#ffffff" />
          
          {/* Calligraphic G in Blue */}
          <path
            d="M35 25 C 24 28, 22 45, 23 58 C 24 68, 30 72, 38 70 C 43 68, 44 55, 43 45 L 29 47"
            stroke="#1e3a8a"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42 39 L 43 72"
            stroke="#1e3a8a"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Text 'Est' in vibrant rose */}
          <text
            x="36"
            y="26"
            fill="#e11d48"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="bold"
            fontSize="11"
            letterSpacing="-0.5"
          >
            Est
          </text>

          {/* Apostrophe */}
          <path
            d="M47 46 C 48 45, 49 46, 48 48 C 47 49, 46 48, 47 46 Z"
            fill="#e11d48"
            stroke="#e11d48"
            strokeWidth="1.8"
          />

          {/* Calligraphic A in Deep Rose/Navy */}
          <path
            d="M62 14 L 47 88"
            stroke="#1e3a8a"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M62 14 L 66 69"
            stroke="#1e3a8a"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M46 51 L 67 51"
            stroke="#e11d48"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Text 'pp' in Blue */}
          <text
            x="68"
            y="68"
            fill="#2563eb"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="bold"
            fontSize="11"
            letterSpacing="-0.5"
          >
            pp
          </text>
        </svg>
      );

    case 'coeur_bebe':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="g_coeur_blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="g_coeur_pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <path
            d="M32 56C32 56 10 42 10 24C10 14 18 8 26 8C30 8 32 11 32 11C32 11 34 8 38 8C46 8 54 14 54 24C54 42 32 56 32 56Z"
            fill="url(#g_coeur_pink)"
            opacity="0.15"
          />
          <path
            d="M32 54C28 50 12 38 12 24C12 15.5 18 10 25.5 10C29 10 32 12.5 32 12.5"
            stroke="url(#g_coeur_blue)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M32 12.5C32 12.5 35 10 38.5 10C46 10 52 15.5 52 24C52 38 36 50 32 54"
            stroke="url(#g_coeur_pink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="27" r="11" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx="28.5" cy="26" r="1.5" fill="#1e293b" />
          <circle cx="35.5" cy="26" r="1.5" fill="#1e293b" />
          <path d="M29.5 29.5C30.5 31 33.5 31 34.5 29.5" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <circle cx="26" cy="28.5" r="1.8" fill="#fda4af" />
          <circle cx="38" cy="28.5" r="1.8" fill="#fda4af" />
          <path d="M32 16C33 13.5 35 14 34 16.5" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'petits_pieds':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="g_foot_blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="g_foot_rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          <g transform="translate(10, 10) rotate(-10 16 22)">
            <ellipse cx="14" cy="26" rx="7" ry="11" fill="url(#g_foot_blue)" />
            <circle cx="10" cy="11" r="3.2" fill="url(#g_foot_blue)" />
            <circle cx="15.5" cy="12" r="2.5" fill="url(#g_foot_blue)" />
            <circle cx="19.5" cy="14" r="2.1" fill="url(#g_foot_blue)" />
            <circle cx="22.5" cy="17" r="1.7" fill="url(#g_foot_blue)" />
            <circle cx="24.5" cy="20" r="1.4" fill="url(#g_foot_blue)" />
          </g>
          <g transform="translate(24, 6) rotate(12 16 22)">
            <ellipse cx="16" cy="26" rx="7" ry="11" fill="url(#g_foot_rose)" />
            <circle cx="20" cy="11" r="3.2" fill="url(#g_foot_rose)" />
            <circle cx="14.5" cy="12" r="2.5" fill="url(#g_foot_rose)" />
            <circle cx="10.5" cy="14" r="2.1" fill="url(#g_foot_rose)" />
            <circle cx="7.5" cy="17" r="1.7" fill="url(#g_foot_rose)" />
            <circle cx="5.5" cy="20" r="1.4" fill="url(#g_foot_rose)" />
          </g>
        </svg>
      );

    case 'mains_protectrices':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="g_hand_blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="g_hand_pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <path
            d="M12 40C12 40 18 48 30 48C34 48 38 46 40 44C36 44 26 40 22 32C18 24 22 18 22 18C22 18 14 26 12 40Z"
            fill="url(#g_hand_blue)"
          />
          <path
            d="M52 40C52 40 46 48 34 48C30 48 26 46 24 44C28 44 38 40 42 32C46 24 42 18 42 18C42 18 50 26 52 40Z"
            fill="url(#g_hand_pink)"
          />
          <circle cx="32" cy="22" r="9" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx="29" cy="21" r="1.3" fill="#1e293b" />
          <circle cx="35" cy="21" r="1.3" fill="#1e293b" />
          <path d="M30 24C31 25.5 33 25.5 34 24" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M32 10C32 10 28 6 25 8C22 10 23 14 32 18C41 14 42 10 39 8C36 6 32 10 32 10Z"
            fill="#f43f5e"
          />
        </svg>
      );

    case 'berceau_etoile':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="g_cradle_blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="g_cradle_pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
          </defs>
          <path
            d="M14 46C20 54 44 54 50 46"
            stroke="url(#g_cradle_blue)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M16 34C16 42 22 45 32 45C42 45 48 42 48 34L50 26C50 26 36 24 32 24C28 24 14 26 14 26L16 34Z"
            fill="url(#g_cradle_pink)"
            opacity="0.85"
          />
          <path
            d="M14 26C14 18 20 16 28 16L32 24C28 24 16 24 14 26Z"
            fill="url(#g_cradle_blue)"
          />
          <path
            d="M44 14L45.5 18L49.5 18.5L46.5 21L47.5 25L44 23L40.5 25L41.5 21L38.5 18.5L42.5 18L44 14Z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
          />
        </svg>
      );

    default:
      return null;
  }
};

export const Logo: React.FC<{
  variant?: LogoVariant;
  customImageDataUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onOpenPicker?: () => void;
}> = ({ variant = 'gestapp_officiel', customImageDataUrl, size = 'md', onOpenPicker }) => {
  return (
    <div
      onClick={onOpenPicker}
      className={`flex items-center gap-3 select-none group ${onOpenPicker ? 'cursor-pointer' : ''}`}
      title={onOpenPicker ? "Cliquez pour changer le logo ou téléverser votre propre fichier" : undefined}
    >
      {/* Icon with dual rose & blue container */}
      <div className="relative shrink-0 transition-transform group-hover:scale-105 duration-200">
        <div className="w-11 h-11 rounded-2xl bg-white border border-rose-200/80 shadow-md shadow-rose-200/40 p-0.5 flex items-center justify-center overflow-hidden">
          <LogoIcon variant={variant} customImageDataUrl={customImageDataUrl} className="w-10 h-10" />
        </div>
      </div>

      {/* Brand Name */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black tracking-tight text-blue-950 font-sans">
            Gest'app
          </span>
          <span className="text-xl font-black tracking-tight text-rose-500">
            Baby
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Assistante Maternelle
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          <span className="text-blue-600 font-bold">IDCC 3239</span>
        </span>
      </div>
    </div>
  );
};
