import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

export default function Step8() {
  const { setValue, control } = useFormContext();
  const [intensity, setIntensity] = useState(5);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
    setValue('intensity', value);
  };

  const getThumbPosition = (value: number) => {
    const thumbWidth = 30;
    const availableWidth = sliderWidth - thumbWidth;
    const normalizedValue = (value - 1) / 9;
    return availableWidth * normalizedValue;
  };

  return (
    <div className="px-8 pt-8">
      <FormField
        control={control}
        name="intensity"
        render={({ field: _field }) => (
          <FormItem className="mx-auto max-w-prose rounded-sm bg-card px-4 py-6">
            <FormLabel className="text-base font-normal">
              Quanto era intensa l'emozione che hai provato?
            </FormLabel>
            <FormControl>
              <>
                <div className="mt-6 flex justify-between">
                  <span className="font-bold text-grey-500 dark:text-white-900">
                    Bassa
                  </span>
                  <span className="font-bold text-grey-500 dark:text-white-900">
                    Alta
                  </span>
                </div>

                <div className="relative mt-2" ref={sliderRef}>
                  <div
                    className="text-white absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary"
                    style={{ left: getThumbPosition(intensity) }}
                    onMouseDown={(_e) => {
                      const handleMouseMove = (event: MouseEvent) => {
                        if (sliderRef.current) {
                          const rect =
                            sliderRef.current.getBoundingClientRect();
                          const newValue =
                            Math.round(
                              ((event.clientX - rect.left) / rect.width) * 9,
                            ) + 1;
                          if (newValue >= 1 && newValue <= 10) {
                            handleIntensityChange(newValue);
                          }
                        }
                      };

                      const handleMouseUp = () => {
                        window.removeEventListener(
                          'mousemove',
                          handleMouseMove,
                        );
                        window.removeEventListener('mouseup', handleMouseUp);
                      };

                      window.addEventListener('mousemove', handleMouseMove);
                      window.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <span className="font-bold text-white-900">
                      {intensity}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={intensity}
                    onChange={(e) =>
                      handleIntensityChange(Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E0E0E0]"
                    style={{
                      background: `linear-gradient(to right, #FE662A 0%, #FE662A ${((intensity - 1) / 9) * 100}%, #E0E0E0 ${((intensity - 1) / 9) * 100}%, #E0E0E0 100%)`,
                    }}
                  />
                </div>
              </>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
