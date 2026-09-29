import React from 'react';

interface FoodIconProps {
  type: string;
  className?: string;
}

export const FoodSvgIcon: React.FC<FoodIconProps> = ({ type, className = 'w-14 h-14' }) => {
  switch (type) {
    case 'apple':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M40 20C40 13 46 8 53 10" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="49" cy="15" rx="8" ry="4.5" transform="rotate(-20 49 15)" fill="#22C55E" />
          <path
            d="M40 22C30 19 16 25 16 42C16 58 28 70 37 70C39 70 41 69 43 70C52 70 64 58 64 42C64 25 50 19 40 22Z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="3"
          />
          <path d="M25 34C23 40 24 47 27 52" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'banana':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M20 56C34 64 56 54 64 24C65 19 62 15 59 14C56 17 53 26 44 36C35 46 24 49 17 50C15 52 16 55 20 56Z"
            fill="#FACC15"
            stroke="#854D0E"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M30 52C42 52 53 42 58 26" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'strawberry':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M40 68C26 64 18 44 22 30C25 21 34 22 40 25C46 22 55 21 58 30C62 44 54 64 40 68Z"
            fill="#F43F5E"
            stroke="#9F1239"
            strokeWidth="3"
          />
          <path
            d="M28 22L40 27L52 22L45 16L40 12L35 16L28 22Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="33" cy="37" r="2" fill="#FEF08A" />
          <circle cx="46" cy="36" r="2" fill="#FEF08A" />
          <circle cx="40" cy="46" r="2" fill="#FEF08A" />
          <circle cx="34" cy="53" r="2" fill="#FEF08A" />
          <circle cx="46" cy="52" r="2" fill="#FEF08A" />
        </svg>
      );
    case 'orange':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="44" r="23" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <ellipse cx="47" cy="17" rx="8" ry="4" transform="rotate(-15 47 17)" fill="#22C55E" />
          <circle cx="32" cy="36" r="1.5" fill="#FFEDD5" />
          <circle cx="28" cy="44" r="1.5" fill="#FFEDD5" />
          <circle cx="48" cy="52" r="1.5" fill="#FFEDD5" />
        </svg>
      );
    case 'grapes':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M40 12V22" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="31" cy="29" r="9" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="49" cy="29" r="9" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="40" cy="31" r="9" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="27" cy="43" r="9" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="53" cy="43" r="9" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="40" cy="45" r="9" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="34" cy="57" r="8.5" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="46" cy="57" r="8.5" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <circle cx="40" cy="67" r="8" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.5" />
        </svg>
      );
    case 'watermelon':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 32C12 50 24 64 40 64C56 64 68 50 68 32H12Z"
            fill="#16A34A"
            stroke="#14532D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M18 32C18 46 28 57 40 57C52 57 62 46 62 32H18Z" fill="#FB7185" />
          <circle cx="32" cy="41" r="2" fill="#1E293B" />
          <circle cx="40" cy="46" r="2" fill="#1E293B" />
          <circle cx="48" cy="41" r="2" fill="#1E293B" />
        </svg>
      );
    case 'peach':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="45" r="22" fill="#FB923C" stroke="#9A3412" strokeWidth="3" />
          <path d="M40 23C46 31 46 52 40 66" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="48" cy="19" rx="8" ry="4" transform="rotate(-18 48 19)" fill="#22C55E" />
        </svg>
      );
    case 'pineapple':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M40 10L34 26H46L40 10Z" fill="#16A34A" />
          <path d="M28 15L34 27L24 25L28 15Z" fill="#22C55E" />
          <path d="M52 15L46 27L56 25L52 15Z" fill="#22C55E" />
          <rect x="24" y="26" width="32" height="42" rx="15" fill="#EAB308" stroke="#854D0E" strokeWidth="3" />
          <path d="M28 36L52 58M52 36L28 58" stroke="#CA8A04" strokeWidth="2.5" />
        </svg>
      );
    case 'pancakes':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <ellipse cx="40" cy="58" rx="28" ry="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          <ellipse cx="40" cy="52" rx="22" ry="7" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
          <ellipse cx="40" cy="44" rx="22" ry="7" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
          <ellipse cx="40" cy="36" rx="21" ry="7" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
          <rect x="35" y="31" width="10" height="6" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );
    case 'bread':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M18 38C14 32 18 22 28 22H52C62 22 66 32 62 38V58C62 61 59 64 56 64H24C21 64 18 61 18 58V38Z"
            fill="#FDE68A"
            stroke="#92400E"
            strokeWidth="3"
          />
          <path d="M28 32L34 26M42 32L48 26" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'eggs':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M18 44C18 32 28 24 41 25C54 26 64 35 62 48C60 60 48 65 35 63C22 61 18 53 18 44Z"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="3"
          />
          <circle cx="40" cy="44" r="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
        </svg>
      );
    case 'cheese':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M16 54L46 22L64 34V54H16Z"
            fill="#FACC15"
            stroke="#A16207"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="44" r="4" fill="#EAB308" />
          <circle cx="52" cy="46" r="3" fill="#EAB308" />
          <circle cx="46" cy="34" r="2.5" fill="#EAB308" />
        </svg>
      );
    case 'cereal':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M16 38H64C64 54 53 64 40 64C27 64 16 54 16 38Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" />
          <circle cx="28" cy="34" r="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <circle cx="38" cy="33" r="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <circle cx="48" cy="34" r="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <circle cx="43" cy="30" r="4" fill="#EF4444" />
        </svg>
      );
    case 'honey':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="26" y="18" width="28" height="8" rx="3" fill="#B45309" />
          <rect x="22" y="26" width="36" height="40" rx="10" fill="#FBBF24" stroke="#92400E" strokeWidth="3" />
          <path d="M22 42H58" stroke="#D97706" strokeWidth="3" />
        </svg>
      );
    case 'butter':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <ellipse cx="40" cy="54" rx="28" ry="8" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          <rect x="24" y="34" width="32" height="18" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
        </svg>
      );
    case 'yogurt':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M24 34H56L52 64H28L24 34Z" fill="#FCE7F3" stroke="#BE185D" strokeWidth="3" />
          <path d="M26 34C26 24 34 20 40 20C46 20 54 24 54 34" fill="#FBCFE8" stroke="#BE185D" strokeWidth="3" />
          <circle cx="40" cy="20" r="4" fill="#E11D48" />
        </svg>
      );
    case 'sandwich':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M16 48H64V56C64 59 61 61 58 61H22C19 61 16 59 16 56V48Z" fill="#FDE68A" stroke="#92400E" strokeWidth="3" />
          <path d="M14 44C20 41 26 47 32 44C38 41 44 47 50 44C56 41 62 47 66 44" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <rect x="18" y="37" width="44" height="5" rx="2" fill="#EF4444" />
          <path d="M16 26C16 22 20 20 24 20H56C60 20 64 22 64 26V36H16V26Z" fill="#FDE68A" stroke="#92400E" strokeWidth="3" />
        </svg>
      );
    case 'salad':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="28" cy="34" r="9" fill="#22C55E" />
          <circle cx="40" cy="30" r="10" fill="#16A34A" />
          <circle cx="52" cy="34" r="9" fill="#22C55E" />
          <circle cx="34" cy="35" r="4" fill="#EF4444" />
          <circle cx="47" cy="35" r="4" fill="#EF4444" />
          <path d="M16 38H64C64 54 53 64 40 64C27 64 16 54 16 38Z" fill="#FEF3C7" stroke="#B45309" strokeWidth="3" />
        </svg>
      );
    case 'soup':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M32 16C30 20 34 24 32 28M46 16C44 20 48 24 46 28" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 36H64C64 54 53 64 40 64C27 64 16 54 16 36Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
          <ellipse cx="40" cy="36" rx="24" ry="6" fill="#F97316" stroke="#991B1B" strokeWidth="2.5" />
        </svg>
      );
    case 'pizza':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M40 16L64 60C50 66 30 66 16 60L40 16Z" fill="#FACC15" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
          <path d="M16 58C30 64 50 64 64 58" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
          <circle cx="40" cy="36" r="4.5" fill="#EF4444" />
          <circle cx="33" cy="48" r="4.5" fill="#EF4444" />
          <circle cx="47" cy="48" r="4.5" fill="#22C55E" />
        </svg>
      );
    case 'pasta':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M22 36C28 28 36 28 40 34C44 28 52 28 58 36" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <path d="M26 32C34 24 46 24 54 32" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
          <path d="M16 40H64C62 54 52 62 40 62C28 62 18 54 16 40Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="3" />
        </svg>
      );
    case 'rice':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M20 40C20 26 30 22 40 22C50 22 60 26 60 40H20Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="35" cy="31" r="2.5" fill="#22C55E" />
          <circle cx="45" cy="33" r="2.5" fill="#22C55E" />
          <path d="M16 40H64C62 55 52 64 40 64C28 64 18 55 16 40Z" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
        </svg>
      );
    case 'carrot':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M52 16L60 12M56 20L66 18M48 20L52 10" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M54 22C59 27 57 34 50 41L22 64C19 66 16 63 18 60L41 32C48 25 50 18 54 22Z"
            fill="#F97316"
            stroke="#9A3412"
            strokeWidth="3"
          />
        </svg>
      );
    case 'corn':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="28" y="16" width="24" height="44" rx="12" fill="#FACC15" stroke="#A16207" strokeWidth="3" />
          <path d="M28 30H52M28 40H52M40 18V56" stroke="#CA8A04" strokeWidth="2" />
          <path d="M22 42C22 56 32 64 40 66C48 64 58 56 58 42" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M24 20H56L52 64H28L24 20Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 34H54L51 62H29L26 34Z" fill="#38BDF8" />
          <circle cx="36" cy="48" r="2.5" fill="#FFFFFF" />
          <circle cx="44" cy="42" r="2" fill="#FFFFFF" />
        </svg>
      );
    case 'milk':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M32 14H48V24L56 34V64H24V34L32 24V14Z"
            fill="#FFFFFF"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="29" y="11" width="22" height="5" rx="2" fill="#38BDF8" />
          <rect x="24" y="42" width="32" height="10" fill="#BAE6FD" />
        </svg>
      );
    case 'orange juice':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M46 22L54 10" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 22H56L52 64H28L24 22Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 32H54L51 62H29L26 32Z" fill="#FB923C" />
        </svg>
      );
    case 'lemonade':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="54" cy="22" r="9" fill="#FACC15" stroke="#A16207" strokeWidth="2.5" />
          <path d="M24 22H56L52 64H28L24 22Z" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 32H54L51 62H29L26 32Z" fill="#FDE047" />
          <rect x="33" y="38" width="6" height="6" rx="1" fill="#FFFFFF" />
          <rect x="42" y="44" width="6" height="6" rx="1" fill="#FFFFFF" />
        </svg>
      );
    case 'smoothie':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M44 20L50 8" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
          <path d="M24 26H56L51 64H29L24 26Z" fill="#F472B6" stroke="#9D174D" strokeWidth="3" strokeLinejoin="round" />
          <path d="M24 26C24 18 32 15 40 15C48 15 56 18 56 26" fill="#FBCFE8" stroke="#9D174D" strokeWidth="3" />
        </svg>
      );
    case 'hot chocolate':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M34 14C32 18 36 22 34 26M46 14C44 18 48 22 46 26" stroke="#A8A29E" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 36H62C65 36 67 39 67 43C67 47 65 50 62 50H54" stroke="#78350F" strokeWidth="3.5" />
          <rect x="22" y="30" width="32" height="34" rx="6" fill="#92400E" stroke="#451A03" strokeWidth="3" />
          <rect x="29" y="27" width="7" height="5" rx="2" fill="#FFFFFF" />
          <rect x="40" y="27" width="7" height="5" rx="2" fill="#FFFFFF" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="#FBBF24" stroke="#B45309" strokeWidth="3" />
          <path d="M28 40H52M40 28V52" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
};
