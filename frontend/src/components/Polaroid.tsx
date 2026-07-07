import React from 'react';

interface Props {
  src: string;
  alt?: string;
  angle?: number;
  top: string;
  left: string;
  featured?: boolean;
}

type CSSPropertiesWithVars = React.CSSProperties & {
  '--tilt'?: string;
  '--top'?: string;
  '--left'?: string;
};

export default function Polaroid({
  src,
  alt = '',
  angle = 0,
  top,
  left,
  featured = false,
}: Props) {
  const style: CSSPropertiesWithVars = {
    '--tilt': `${angle}deg`,
    '--top': top,
    '--left': left,
  };

  return (
    <div className={`polaroid ${featured ? 'featured' : ''}`} style={style}>
      <img src={src} alt={alt} />
    </div>
  );
}