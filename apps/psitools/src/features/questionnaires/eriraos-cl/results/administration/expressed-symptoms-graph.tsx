import { cn } from '@/utils/cn';

const WIDTH_DICT = {
  1: 'w-[1.39rem]',
  2: 'w-[2.78rem]',
  3: 'w-[4.17rem]',
  4: 'w-[5.56rem]',
  5: 'w-[6.96rem]',
  6: 'w-[8.35rem]',
  7: 'w-[9.74rem]',
  8: 'w-[11.13rem]',
  9: 'w-[12.52rem]',
  10: 'w-[13.91rem]',
  11: 'w-[15.30rem]',
  12: 'w-[16.70rem]',
  13: 'w-[18.09rem]',
  14: 'w-[19.48rem]',
  15: 'w-[20.87rem]',
  16: 'w-[22.26rem]',
  17: 'w-[23.65rem]',
  18: 'w-[25.04rem]',
  19: 'w-[26.43rem]',
  20: 'w-[27.83rem]',
  21: 'w-[29.22rem]',
  22: 'w-[30.61rem]',
  23: 'w-[32.00rem]',
  24: 'w-[33.39rem]',
  25: 'w-[34.78rem]',
  26: 'w-[36.17rem]',
  27: 'w-[37.57rem]',
  28: 'w-[38.96rem]',
  29: 'w-[40.35rem]',
  30: 'w-[41.74rem]',
  31: 'w-[43.13rem]',
  32: 'w-[44.52rem]',
  33: 'w-[45.91rem]',
  34: 'w-[47.30rem]',
  35: 'w-[48.70rem]',
  36: 'w-[50.09rem]',
  37: 'w-[51.48rem]',
  38: 'w-[52.87rem]',
  39: 'w-[54.26rem]',
  40: 'w-[55.65rem]',
  41: 'w-[57.04rem]',
  42: 'w-[58.43rem]',
  43: 'w-[59.83rem]',
  44: 'w-[61.22rem]',
  45: 'w-[62.61rem]',
  46: 'w-[64rem]',
} as Record<string, string>;

interface Props {
  expressedSymptomsCount: number;
  cutOff: number;
}

export const ExpressedSymptomsGraph = (props: Props) => {
  const { expressedSymptomsCount, cutOff } = props;

  return (
    <div className="relative h-4 w-[64rem] rounded-md bg-gray-300">
      <div className="absolute bottom-0 left-0 flex items-end justify-end">
        <div
          className={cn(
            'h-4 rounded-s-md',
            WIDTH_DICT[expressedSymptomsCount.toString()],
            expressedSymptomsCount > cutOff ? 'bg-red-400' : 'bg-green-400',
          )}
        ></div>
        <div
          className={cn(
            'h-10 w-[2px] rounded-md text-white',
            expressedSymptomsCount > cutOff ? 'bg-red-400' : 'bg-green-400',
          )}
        ></div>
        <span
          className={cn(
            'relative -left-4 -top-6 flex h-8 w-8 items-center justify-center rounded-full leading-none text-white',
            expressedSymptomsCount > cutOff ? 'bg-red-400' : 'bg-green-400',
          )}
        >
          {expressedSymptomsCount}
        </span>
      </div>

      <div className="absolute -top-3 left-[16.70rem]">
        <div className="h-10 w-[2px] rounded-md bg-black"></div>
        <p className="relative -left-7 mt-2">Cut-off</p>
      </div>
    </div>
  );
};
