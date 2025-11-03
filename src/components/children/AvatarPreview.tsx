interface AvatarPreviewProps {
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  favoriteColor: string;
  accessory: string;
  comfortItem: string;
}

const skinToneColors: { [key: string]: string } = {
  light: '#FFE5D9',
  fair: '#FDDBC9',
  medium: '#F1C6A7',
  olive: '#D4A574',
  tan: '#C68642',
  brown: '#8D5524',
  dark: '#5C4033',
  deep: '#3D2817',
};

const eyeColorMap: { [key: string]: string } = {
  brown: '#5C4033',
  blue: '#4A90E2',
  green: '#50C878',
  hazel: '#8E7618',
  gray: '#708090',
  amber: '#FF7E00',
  violet: '#8F00FF',
};

const hairColorMap: { [key: string]: string } = {
  black: '#1C1C1C',
  brown: '#5C4033',
  blonde: '#F5DEB3',
  red: '#C93E3E',
  auburn: '#A52A2A',
  gray: '#B0B0B0',
  pink: '#FFB6C1',
  blue: '#6495ED',
  purple: '#9370DB',
  green: '#90EE90',
};

const colorMap: { [key: string]: string } = {
  red: '#FF6B6B',
  pink: '#FFB6C1',
  purple: '#9370DB',
  blue: '#6495ED',
  green: '#90EE90',
  yellow: '#FFE66D',
  orange: '#FFA94D',
  teal: '#4ECDC4',
  lavender: '#E6E6FA',
  mint: '#98FF98',
  peach: '#FFDAB9',
  white: '#FFFFFF',
};

export function AvatarPreview({
  skinTone,
  eyeColor,
  hairColor,
  hairStyle,
  favoriteColor,
  accessory,
  comfortItem,
}: AvatarPreviewProps) {
  const skinColor = skinToneColors[skinTone] || skinToneColors.medium;
  const eyeColorHex = eyeColorMap[eyeColor] || eyeColorMap.brown;
  const hairColorHex = hairColorMap[hairColor] || hairColorMap.brown;
  const clothingColor = colorMap[favoriteColor] || colorMap.blue;

  // Hair style variations
  const getHairPath = () => {
    switch (hairStyle) {
      case 'short':
        return 'M80 50 Q70 35, 100 30 Q130 35, 120 50 Z';
      case 'long':
        return 'M70 50 Q60 35, 100 25 Q140 35, 130 50 L130 90 Q100 95, 70 90 Z';
      case 'curly':
        return 'M75 50 Q65 30, 80 25 Q95 20, 100 25 Q105 20, 120 25 Q135 30, 125 50 Q130 40, 125 55 Q120 50, 115 55 Q110 50, 105 55 Q100 50, 95 55 Q90 50, 85 55 Q80 50, 75 55 Z';
      case 'wavy':
        return 'M75 50 Q70 30, 100 25 Q130 30, 125 50 L120 80 Q110 85, 100 85 Q90 85, 80 80 Z';
      case 'braids':
        return 'M75 50 Q70 30, 85 25 L80 90 M115 25 Q130 30, 125 50 L120 90 M100 25 L100 85';
      case 'ponytail':
        return 'M75 50 Q70 35, 100 30 Q130 35, 125 50 L115 60 Q110 70, 110 85';
      case 'bun':
        return 'M80 50 Q70 35, 100 25 Q130 35, 120 50 M95 20 Q100 15, 105 20 Q108 25, 100 28 Q92 25, 95 20';
      case 'pixie':
        return 'M85 50 Q75 38, 100 32 Q125 38, 115 50 L110 55 Q100 58, 90 55 Z';
      case 'bob':
        return 'M75 50 Q68 35, 100 28 Q132 35, 125 50 L125 70 Q100 75, 75 70 Z';
      case 'afro':
        return 'M70 60 Q60 40, 70 25 Q80 15, 100 12 Q120 15, 130 25 Q140 40, 130 60 Q125 70, 115 75 Q105 78, 100 78 Q95 78, 85 75 Q75 70, 70 60';
      case 'locs':
        return 'M75 50 Q70 30, 80 25 L75 85 M90 23 L88 85 M100 22 L100 85 M110 23 L112 85 M120 25 Q130 30, 125 50 L125 85';
      case 'buzz':
        return 'M82 50 Q72 38, 100 33 Q128 38, 118 50 Z';
      default:
        return 'M80 50 Q70 35, 100 30 Q130 35, 120 50 Z';
    }
  };

  // Accessory components
  const getAccessory = () => {
    switch (accessory) {
      case 'glasses':
        return (
          <g>
            <ellipse cx="85" cy="75" rx="12" ry="10" fill="none" stroke="#333" strokeWidth="2" />
            <ellipse cx="115" cy="75" rx="12" ry="10" fill="none" stroke="#333" strokeWidth="2" />
            <line x1="97" y1="75" x2="103" y2="75" stroke="#333" strokeWidth="2" />
          </g>
        );
      case 'headband':
        return (
          <g>
            <path d="M75 52 Q100 48, 125 52" fill="none" stroke={clothingColor} strokeWidth="4" />
          </g>
        );
      case 'hat':
        return (
          <g>
            <ellipse cx="100" cy="35" rx="35" ry="8" fill={clothingColor} />
            <rect x="85" y="25" width="30" height="15" fill={clothingColor} rx="3" />
          </g>
        );
      case 'bow':
        return (
          <g>
            <path d="M90 30 L95 35 L90 40 M110 30 L105 35 L110 40 M95 35 L105 35" stroke={clothingColor} strokeWidth="3" fill="none" />
            <circle cx="100" cy="35" r="3" fill={clothingColor} />
          </g>
        );
      case 'crown':
        return (
          <g>
            <path d="M75 40 L80 25 L85 35 L95 20 L100 35 L105 20 L115 35 L120 25 L125 40 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
          </g>
        );
      case 'flowers':
        return (
          <g>
            <circle cx="85" cy="35" r="5" fill="#FF69B4" />
            <circle cx="82" cy="38" r="3" fill="#FFB6C1" />
            <circle cx="115" cy="35" r="5" fill="#9370DB" />
            <circle cx="118" cy="38" r="3" fill="#DDA0DD" />
          </g>
        );
      case 'bandana':
        return (
          <g>
            <path d="M70 55 Q100 45, 130 55" fill={clothingColor} stroke={clothingColor} strokeWidth="8" />
          </g>
        );
      default:
        return null;
    }
  };

  // Comfort item
  const getComfortItem = () => {
    switch (comfortItem) {
      case 'teddy':
        return (
          <g transform="translate(130, 110)">
            <ellipse cx="0" cy="0" rx="12" ry="15" fill="#8B4513" />
            <circle cx="-5" cy="-5" r="3" fill="#8B4513" />
            <circle cx="5" cy="-5" r="3" fill="#8B4513" />
            <circle cx="-3" cy="-3" r="1" fill="#000" />
            <circle cx="3" cy="-3" r="1" fill="#000" />
          </g>
        );
      case 'blanket':
        return (
          <g transform="translate(130, 100)">
            <rect x="-15" y="0" width="30" height="25" fill={clothingColor} opacity="0.7" rx="2" />
            <line x1="-15" y1="8" x2="15" y2="8" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="-15" y1="16" x2="15" y2="16" stroke="#fff" strokeWidth="1" opacity="0.5" />
          </g>
        );
      case 'book':
        return (
          <g transform="translate(130, 110)">
            <rect x="-10" y="-8" width="20" height="16" fill="#8B4513" rx="1" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#654321" strokeWidth="2" />
          </g>
        );
      case 'music':
        return (
          <g transform="translate(135, 105)">
            <ellipse cx="0" cy="8" rx="4" ry="3" fill="#333" />
            <rect x="-1" y="-5" width="2" height="13" fill="#333" />
            <path d="M1 -5 Q8 -8, 8 0" fill="none" stroke="#333" strokeWidth="2" />
          </g>
        );
      case 'star':
        return (
          <g transform="translate(135, 105)">
            <path d="M0,-8 L2,-2 L8,-2 L3,2 L5,8 L0,4 L-5,8 L-3,2 L-8,-2 L-2,-2 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
          </g>
        );
      case 'heart':
        return (
          <g transform="translate(135, 105)">
            <path d="M0,2 Q-8,-6 -4,-10 Q0,-12 0,-6 Q0,-12 4,-10 Q8,-6 0,2 Z" fill="#FF69B4" />
          </g>
        );
      case 'pet':
        return (
          <g transform="translate(130, 115)">
            <ellipse cx="0" cy="0" rx="10" ry="8" fill="#FFA500" />
            <circle cx="-3" cy="-2" r="1.5" fill="#000" />
            <circle cx="3" cy="-2" r="1.5" fill="#000" />
            <path d="M-8 -5 L-10 -8 M8 -5 L10 -8" stroke="#FFA500" strokeWidth="2" />
          </g>
        );
      case 'toy':
        return (
          <g transform="translate(135, 110)">
            <circle cx="0" cy="0" r="6" fill={clothingColor} />
            <circle cx="0" cy="0" r="3" fill="#fff" opacity="0.5" />
          </g>
        );
      case 'plant':
        return (
          <g transform="translate(135, 115)">
            <rect x="-4" y="3" width="8" height="5" fill="#8B4513" />
            <ellipse cx="0" cy="-2" rx="6" ry="8" fill="#50C878" />
            <ellipse cx="-3" cy="-4" rx="4" ry="6" fill="#50C878" />
            <ellipse cx="3" cy="-4" rx="4" ry="6" fill="#50C878" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <svg width="200" height="180" viewBox="0 0 200 180" className="drop-shadow-lg">
          {/* Body/Clothing */}
          <path
            d="M70 120 Q60 110, 70 100 L80 95 Q100 90, 120 95 L130 100 Q140 110, 130 120 L120 140 Q100 145, 80 140 Z"
            fill={clothingColor}
          />
          
          {/* Neck */}
          <rect x="90" y="95" width="20" height="15" fill={skinColor} />
          
          {/* Head */}
          <ellipse cx="100" cy="75" rx="30" ry="35" fill={skinColor} />
          
          {/* Hair */}
          <path d={getHairPath()} fill={hairColorHex} />
          
          {/* Eyes */}
          <ellipse cx="85" cy="75" rx="5" ry="6" fill={eyeColorHex} />
          <ellipse cx="115" cy="75" rx="5" ry="6" fill={eyeColorHex} />
          <circle cx="87" cy="74" r="2" fill="#000" />
          <circle cx="117" cy="74" r="2" fill="#000" />
          
          {/* Nose */}
          <ellipse cx="100" cy="82" rx="3" ry="4" fill={skinColor} opacity="0.5" />
          
          {/* Smile */}
          <path d="M90 90 Q100 95, 110 90" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Accessory */}
          {getAccessory()}
          
          {/* Comfort Item */}
          {comfortItem !== 'none' && getComfortItem()}
        </svg>
      </div>
    </div>
  );
}
