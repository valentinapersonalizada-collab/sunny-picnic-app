import React, { useState, useEffect } from 'react';
import { InteractiveProp } from '../data/storybookData';
import { FoodSvgIcon } from './FoodSvgIcons';

interface InteractiveSceneStageProps {
  illustrationUrl: string;
  title: string;
  interactivePrompt?: string;
  propsList?: InteractiveProp[];
  onPropInteract?: (propId: string) => void;
}

export const InteractiveSceneStage: React.FC<InteractiveSceneStageProps> = ({
  illustrationUrl,
  title,
  propsList = [],
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [illustrationUrl]);

  return (
    <div className="relative w-full h-full min-h-[180px] flex flex-col justify-between rounded-2xl overflow-hidden border-2 border-amber-200/90 bg-amber-50/50 select-none shadow-inner">
      {/* Main Storybook Illustration Stage — Clean, unobstructed full-scene artwork */}
      <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-50">
        {!imgError ? (
          <img
            src={illustrationUrl}
            alt={title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-100">
            <div className="flex items-center justify-center gap-4">
              {propsList.length > 0 ? (
                propsList.map((prop) => (
                  <FoodSvgIcon key={prop.id} type={prop.iconType} className="w-16 h-16" />
                ))
              ) : (
                <FoodSvgIcon type="apple" className="w-16 h-16" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-800 font-display">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
};
