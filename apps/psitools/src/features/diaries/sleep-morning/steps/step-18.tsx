import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

export default function Step18() {
  const { setValue, control } = useFormContext();
  const [rest, setRest] = useState(5);
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
    setRest(value);
    setValue('rest', value);
  };

  const getThumbPosition = (value: number) => {
    const thumbWidth = 30;
    const availableWidth = sliderWidth - thumbWidth;
    const normalizedValue = (value - 1) / 9;
    return availableWidth * normalizedValue;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="rest"
        render={({ field: _field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-x-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="col-span-1 text-base font-normal">
                Valuta quanto riposato ti senti stamattina
              </FormLabel>
              <div className="flex justify-between">
                <span className="text-grey-500 dark:text-white-900 font-bold">
                  Poco
                </span>
                <span className="text-grey-500 dark:text-white-900 font-bold">
                  Molto
                </span>
              </div>

              <div className="relative col-start-2 mt-2" ref={sliderRef}>
                <div
                  className="absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#2D7C35] text-white"
                  style={{ left: getThumbPosition(rest) }}
                  onMouseDown={(_e) => {
                    const handleMouseMove = (event: MouseEvent) => {
                      if (sliderRef.current) {
                        const rect = sliderRef.current.getBoundingClientRect();
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
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };

                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <span className="text-white-900 font-bold">{rest}</span>
                </div>

                <FormControl>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={rest}
                    onChange={(e) =>
                      handleIntensityChange(Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E0E0E0]"
                    style={{
                      background: `linear-gradient(to right, #2D7C35 0%, #2D7C35 ${((rest - 1) / 9) * 100}%, #E0E0E0 ${((rest - 1) / 9) * 100}%, #E0E0E0 100%)`,
                    }}
                  />
                </FormControl>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
