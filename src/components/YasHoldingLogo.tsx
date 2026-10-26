import React from 'react';

interface YasHoldingLogoProps {
  className?: string;
}

export const YasHoldingLogo: React.FC<YasHoldingLogoProps> = ({
  className = '',
}) => {
  const goldColor = '#C8A977'; // Pantone 466c HEX #C8A977 RGB 200, 169, 119

  return (
    <div className={`flex flex-col items-center justify-center select-none shrink-0 leading-none ${className}`}>
      {/* Top Line: YAS HOLDING matching the smaller refined scale in reference image */}
      <span
        className="font-bold uppercase tracking-[0.14em] leading-tight text-[12px] sm:text-[13px]"
        style={{
          color: goldColor,
          fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
          fontWeight: 700,
        }}
      >
        YAS HOLDING
      </span>

      {/* Bottom Line: AVIATION centered with delicate wide tracking */}
      <span
        className="font-semibold uppercase tracking-[0.32em] leading-none text-[7.5px] sm:text-[8px] mt-0.5 pl-[0.32em]"
        style={{
          color: goldColor,
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          fontWeight: 600,
        }}
      >
        AVIATION
      </span>
    </div>
  );
};
