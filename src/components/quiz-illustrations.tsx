import type { ComponentType } from "react";

/** Cartoon-style SVG illustrations for quiz questions */

export function CarIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Car body */}
      <rect x="15" y="30" width="90" height="30" rx="8" fill="#e63946" />
      {/* Roof */}
      <path d="M30 30 L40 10 L80 10 L90 30 Z" fill="#c1121f" />
      {/* Windows */}
      <rect x="42" y="14" width="15" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      <rect x="62" y="14" width="15" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      {/* Wheels */}
      <circle cx="38" cy="62" r="10" fill="#333" />
      <circle cx="38" cy="62" r="4" fill="#888" />
      <circle cx="82" cy="62" r="10" fill="#333" />
      <circle cx="82" cy="62" r="4" fill="#888" />
      {/* Headlight */}
      <rect x="102" y="36" width="6" height="8" rx="2" fill="#FFD700" />
      {/* Taillight */}
      <rect x="12" y="36" width="6" height="8" rx="2" fill="#FF4444" />
      {/* Grin */}
      <rect x="20" y="42" width="6" height="2" rx="1" fill="#888" />
      <rect x="94" y="42" width="6" height="2" rx="1" fill="#888" />
    </svg>
  );
}

export function SalespersonIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="20" r="14" fill="#FFDAB9" />
      {/* Hair */}
      <path d="M26 18 Q30 6 40 4 Q50 6 54 18" fill="#4A3728" />
      {/* Eyes */}
      <circle cx="34" cy="18" r="2" fill="#333" />
      <circle cx="46" cy="18" r="2" fill="#333" />
      {/* Smile */}
      <path d="M34 26 Q40 30 46 26" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body - suit jacket */}
      <rect x="22" y="34" width="36" height="40" rx="4" fill="#1a3a5c" />
      {/* Collar */}
      <path d="M30 34 L40 42 L50 34" fill="#fff" opacity="0.9" />
      {/* Tie */}
      <rect x="37" y="40" width="6" height="20" rx="2" fill="#e63946" />
      {/* Arms */}
      <rect x="10" y="36" width="14" height="8" rx="4" fill="#1a3a5c" />
      <rect x="56" y="36" width="14" height="8" rx="4" fill="#1a3a5c" />
      {/* Hands */}
      <circle cx="12" cy="44" r="5" fill="#FFDAB9" />
      <circle cx="68" cy="44" r="5" fill="#FFDAB9" />
      {/* Name tag */}
      <rect x="34" y="48" width="12" height="6" rx="1" fill="#fff" />
      <rect x="33" y="47" width="14" height="8" rx="1" fill="none" stroke="#ccc" strokeWidth="0.5" />
    </svg>
  );
}

export function CustomerIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="35" cy="18" r="13" fill="#D2A679" />
      {/* Hair */}
      <path d="M22 16 Q26 4 35 2 Q44 4 48 16" fill="#2C1810" />
      {/* Eyes */}
      <circle cx="30" cy="16" r="2" fill="#333" />
      <circle cx="40" cy="16" r="2" fill="#333" />
      {/* Smile */}
      <path d="M30 24 Q35 28 40 24" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body */}
      <rect x="20" y="32" width="30" height="35" rx="4" fill="#4A90D9" />
      {/* Collar */}
      <path d="M26 32 L35 38 L44 32" fill="#fff" opacity="0.9" />
      {/* Arms */}
      <rect x="8" y="34" width="12" height="7" rx="3" fill="#4A90D9" />
      <rect x="50" y="34" width="12" height="7" rx="3" fill="#4A90D9" />
      {/* Hands */}
      <circle cx="10" cy="40" r="4" fill="#D2A679" />
      <circle cx="60" cy="40" r="4" fill="#D2A679" />
      {/* Shopping bag */}
      <rect x="52" y="38" width="10" height="12" rx="2" fill="#FFD700" />
      <path d="M55 38 Q57 34 59 38" stroke="#FFD700" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function HandshakeIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left arm */}
      <rect x="5" y="30" width="30" height="12" rx="5" fill="#1a3a5c" />
      {/* Right arm */}
      <rect x="65" y="30" width="30" height="12" rx="5" fill="#4A90D9" />
      {/* Left hand */}
      <path d="M30 30 Q40 20 50 30 Q55 35 50 40 Q45 45 40 42 Q35 40 30 38 Z" fill="#FFDAB9" />
      {/* Right hand */}
      <path d="M70 30 Q60 20 50 30 Q45 35 50 40 Q55 45 60 42 Q65 40 70 38 Z" fill="#D2A679" />
      {/* Sparkles */}
      <text x="45" y="18" fontSize="12" fill="#FFD700">✦</text>
      <text x="30" y="12" fontSize="8" fill="#FFD700">✦</text>
      <text x="60" y="12" fontSize="8" fill="#FFD700">✦</text>
    </svg>
  );
}

export function ClipboardIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clipboard board */}
      <rect x="10" y="8" width="40" height="64" rx="4" fill="#F5F5DC" stroke="#ccc" strokeWidth="1.5" />
      {/* Clip */}
      <rect x="22" y="4" width="16" height="8" rx="2" fill="#888" />
      <circle cx="30" cy="8" r="2" fill="#666" />
      {/* Lines of text */}
      <rect x="16" y="20" width="28" height="3" rx="1.5" fill="#333" opacity="0.4" />
      <rect x="16" y="28" width="28" height="3" rx="1.5" fill="#333" opacity="0.4" />
      <rect x="16" y="36" width="28" height="3" rx="1.5" fill="#333" opacity="0.4" />
      <rect x="16" y="44" width="20" height="3" rx="1.5" fill="#333" opacity="0.4" />
      {/* Checkmark */}
      <path d="M18 52 L24 58 L38 44" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrophyIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trophy cup */}
      <path d="M20 20 Q20 10 30 8 L30 4 L50 4 L50 8 Q60 10 60 20 L60 30 Q55 42 40 44 Q25 42 20 30 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
      {/* Base */}
      <rect x="28" y="48" width="24" height="6" rx="1" fill="#DAA520" />
      <rect x="32" y="54" width="16" height="4" rx="1" fill="#B8860B" />
      {/* Stem */}
      <rect x="36" y="44" width="8" height="6" fill="#FFD700" />
      {/* Left handle */}
      <path d="M20 20 Q10 20 12 30 Q14 35 20 32" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      {/* Right handle */}
      <path d="M60 20 Q70 20 68 30 Q66 35 60 32" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      {/* Star */}
      <text x="36" y="32" fontSize="14" fill="#B8860B" textAnchor="middle">★</text>
    </svg>
  );
}

export function QuestionIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle background */}
      <circle cx="35" cy="38" r="30" fill="#1a2d4a" stroke="#e63946" strokeWidth="2" />
      {/* Question mark */}
      <text x="35" y="32" fontSize="28" fill="#e63946" textAnchor="middle" fontWeight="bold">?</text>
      {/* Dot */}
      <circle cx="35" cy="50" r="3" fill="#e63946" />
      {/* Sparkles */}
      <text x="12" y="14" fontSize="8" fill="#FFD700">✦</text>
      <text x="56" y="14" fontSize="8" fill="#FFD700">✦</text>
    </svg>
  );
}

export function KeyIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Key head */}
      <circle cx="22" cy="22" r="14" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
      <circle cx="22" cy="22" r="6" fill="#333" />
      {/* Key shaft */}
      <rect x="20" y="36" width="6" height="32" rx="2" fill="#FFD700" />
      {/* Key teeth */}
      <rect x="14" y="56" width="6" height="4" rx="1" fill="#FFD700" />
      <rect x="14" y="64" width="8" height="4" rx="1" fill="#FFD700" />
      {/* Sparkle */}
      <text x="44" y="18" fontSize="8" fill="#FFD700">✦</text>
    </svg>
  );
}

export function MoneyIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dollar sign */}
      <circle cx="40" cy="35" r="30" fill="#1a3a2a" stroke="#4CAF50" strokeWidth="2" />
      <text x="40" y="38" fontSize="32" fill="#4CAF50" textAnchor="middle" fontWeight="bold">$</text>
      {/* Coins */}
      <circle cx="18" cy="52" r="6" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <circle cx="28" cy="56" r="5" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <circle cx="55" cy="54" r="5" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <circle cx="65" cy="50" r="6" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
    </svg>
  );
}

export function DealershipIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building */}
      <rect x="15" y="20" width="70" height="55" rx="2" fill="#1a2d4a" stroke="#2a4a6a" strokeWidth="1.5" />
      {/* Roof */}
      <path d="M10 20 L50 5 L90 20 Z" fill="#e63946" />
      {/* Door */}
      <rect x="40" y="50" width="20" height="25" rx="2" fill="#0d1f35" />
      <rect x="42" y="52" width="16" height="23" rx="2" fill="#1a3a5c" />
      <circle cx="54" cy="64" r="1.5" fill="#FFD700" />
      {/* Windows */}
      <rect x="22" y="28" width="12" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
      <rect x="66" y="28" width="12" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
      <rect x="22" y="45" width="12" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
      <rect x="66" y="45" width="12" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
      {/* Flags */}
      <line x1="50" y1="5" x2="50" y2="-2" stroke="#888" strokeWidth="1" />
      <polygon points="50,-2 62,2 50,6" fill="#e63946" />
    </svg>
  );
}

export function ChartIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="40" cy="35" r="30" fill="#0d1f35" stroke="#1a2d4a" strokeWidth="1.5" />
      {/* Bar chart */}
      <rect x="16" y="48" width="10" height="12" rx="2" fill="#e63946" />
      <rect x="30" y="38" width="10" height="22" rx="2" fill="#4A90D9" />
      <rect x="44" y="28" width="10" height="32" rx="2" fill="#4CAF50" />
      <rect x="58" y="42" width="10" height="18" rx="2" fill="#FFD700" />
      {/* Trend line */}
      <path d="M18 46 L28 28 L38 32 L48 18 L58 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}


export function TruckIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Truck body */}
      <rect x="30" y="25" width="60" height="30" rx="4" fill="#2a5a8a" />
      {/* Cab */}
      <rect x="78" y="15" width="25" height="40" rx="4" fill="#1a3a5c" />
      {/* Window */}
      <rect x="84" y="19" width="14" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      {/* Cargo bed */}
      <rect x="30" y="20" width="50" height="8" rx="2" fill="#2a5a8a" />
      {/* Wheels */}
      <circle cx="48" cy="57" r="9" fill="#333" />
      <circle cx="48" cy="57" r="4" fill="#888" />
      <circle cx="88" cy="57" r="9" fill="#333" />
      <circle cx="88" cy="57" r="4" fill="#888" />
      {/* Headlights */}
      <rect x="100" y="32" width="5" height="6" rx="1" fill="#FFD700" />
      {/* Bumper */}
      <rect x="28" y="50" width="65" height="5" rx="2" fill="#444" />
    </svg>
  );
}

export function SuvIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SUV body */}
      <rect x="15" y="30" width="90" height="28" rx="6" fill="#3a6a3a" />
      {/* Tall roof */}
      <path d="M25 30 L30 10 L90 10 L95 30 Z" fill="#2a5a2a" />
      {/* Windows */}
      <rect x="32" y="14" width="18" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      <rect x="54" y="14" width="18" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      <rect x="76" y="14" width="16" height="14" rx="2" fill="#87CEEB" opacity="0.7" />
      {/* Roof rack */}
      <rect x="28" y="7" width="65" height="4" rx="1" fill="#888" />
      {/* Wheels */}
      <circle cx="38" cy="60" r="10" fill="#333" />
      <circle cx="38" cy="60" r="4" fill="#888" />
      <circle cx="82" cy="60" r="10" fill="#333" />
      <circle cx="82" cy="60" r="4" fill="#888" />
      {/* Headlights */}
      <rect x="102" y="36" width="5" height="7" rx="1" fill="#FFD700" />
    </svg>
  );
}

export function JeepIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Jeep body */}
      <rect x="10" y="35" width="100" height="25" rx="4" fill="#c1440e" />
      {/* Roll cage */}
      <path d="M20 35 L25 5 L95 5 L100 35" stroke="#333" strokeWidth="3" fill="none" />
      <rect x="30" y="8" width="15" height="22" rx="1" fill="none" stroke="#333" strokeWidth="2" />
      <rect x="75" y="8" width="15" height="22" rx="1" fill="none" stroke="#333" strokeWidth="2" />
      {/* Spare tire */}
      <circle cx="100" cy="35" r="6" fill="#333" stroke="#555" strokeWidth="1" />
      {/* Big wheels */}
      <circle cx="33" cy="62" r="11" fill="#333" />
      <circle cx="33" cy="62" r="5" fill="#666" />
      <circle cx="87" cy="62" r="11" fill="#333" />
      <circle cx="87" cy="62" r="5" fill="#666" />
      {/* Headlights */}
      <circle cx="107" cy="42" r="3" fill="#FFD700" />
      {/* Fog lights */}
      <circle cx="107" cy="52" r="2" fill="#FFD700" />
    </svg>
  );
}

/** Map of lesson IDs to their illustration component */
/** Map of lesson IDs to their illustration component */
export function getIllustrationForLesson(lessonId: string): ComponentType<{ className?: string }> {
  const map: Record<string, ComponentType<{ className?: string }>> = {
    // Sales Drills
    "drill-greeting": SalespersonIcon,
    "drill-qualification": ClipboardIcon,
    "drill-walkaround": TruckIcon,
    "drill-testdrive": JeepIcon,
    "drill-tradein": HandshakeIcon,
    "drill-numbers": MoneyIcon,
    "drill-objections": QuestionIcon,
    "drill-closing": TrophyIcon,
    "drill-fni": HandshakeIcon,
    "drill-delivery": KeyIcon,
    // 10 Steps Part 1 (descriptions)
    "step-1-greeting": SalespersonIcon,
    "step-2-needs-assessment": ClipboardIcon,
    "step-3-vehicle-presentation": SuvIcon,
    "step-4-test-drive": JeepIcon,
    "step-5-trade-in": HandshakeIcon,
    "step-6-price-negotiation": MoneyIcon,
    "step-7-closing": TrophyIcon,
    "step-8-fni": HandshakeIcon,
    "step-9-delivery": KeyIcon,
    "step-10-follow-up": ChartIcon,
    // 10 Steps Part 2 (quiz)
    "quiz-step-1": SalespersonIcon,
    "quiz-step-2": ClipboardIcon,
    "quiz-step-3": CarIcon,
    "quiz-step-4": SuvIcon,
    "quiz-step-5": HandshakeIcon,
    "quiz-step-6": MoneyIcon,
    "quiz-step-7": TrophyIcon,
    "quiz-step-8": HandshakeIcon,
    "quiz-step-9": KeyIcon,
    "quiz-step-10": ChartIcon,
    // Default fallback
    "default": QuestionIcon,
    // Senior Sales Training
    "senior-negotiation": MoneyIcon,
    "senior-enterprise": DealershipIcon,
    "senior-leadership": TrophyIcon,
    "senior-coaching": SalespersonIcon,
    "senior-complex-deals": ClipboardIcon,
    // Closing & Overcoming Objections
    "closing-price-objections": MoneyIcon,
    "closing-think-about-it": QuestionIcon,
    "closing-spouse-objections": CustomerIcon,
    "closing-competitor": CarIcon,
    "closing-timing": ChartIcon,
    // Needs Assessment Part 2
    "needs2-buying-signals": HandshakeIcon,
    "needs2-lifestyle-matching": CarIcon,
    "needs2-family-needs": CustomerIcon,
    "needs2-budget-qualification": MoneyIcon,
    "needs2-tradein-psychology": KeyIcon,
  };
  return map[lessonId] || QuestionIcon;
}