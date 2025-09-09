import { cn } from '@/utils/cn';

const WIDTH_DICT = {
  1: 'w-[0.64rem]',
  2: 'w-[1.28rem]',
  3: 'w-[1.92rem]',
  4: 'w-[2.56rem]',
  5: 'w-[3.2rem]',
  6: 'w-[3.84rem]',
  7: 'w-[4.48rem]',
  8: 'w-[5.12rem]',
  9: 'w-[5.76rem]',
  10: 'w-[6.4rem]',
  11: 'w-[7.04rem]',
  12: 'w-[7.68rem]',
  13: 'w-[8.32rem]',
  14: 'w-[8.96rem]',
  15: 'w-[9.6rem]',
  16: 'w-[10.24rem]',
  17: 'w-[10.88rem]',
  18: 'w-[11.52rem]',
  19: 'w-[12.16rem]',
  20: 'w-[12.8rem]',
  21: 'w-[13.44rem]',
  22: 'w-[14.08rem]',
  23: 'w-[14.72rem]',
  24: 'w-[15.36rem]',
  25: 'w-[16rem]',
  26: 'w-[16.64rem]',
  27: 'w-[17.28rem]',
  28: 'w-[17.92rem]',
  29: 'w-[18.56rem]',
  30: 'w-[19.2rem]',
  31: 'w-[19.84rem]',
  32: 'w-[20.48rem]',
  33: 'w-[21.12rem]',
  34: 'w-[21.76rem]',
  35: 'w-[22.4rem]',
  36: 'w-[23.04rem]',
  37: 'w-[23.68rem]',
  38: 'w-[24.32rem]',
  39: 'w-[24.96rem]',
  40: 'w-[25.6rem]',
  41: 'w-[26.24rem]',
  42: 'w-[26.88rem]',
  43: 'w-[27.52rem]',
  44: 'w-[28.16rem]',
  45: 'w-[28.8rem]',
  46: 'w-[29.44rem]',
  47: 'w-[30.08rem]',
  48: 'w-[30.72rem]',
  49: 'w-[31.36rem]',
  50: 'w-lg',
  51: 'w-[32.64rem]',
  52: 'w-[33.28rem]',
  53: 'w-[33.92rem]',
  54: 'w-[34.56rem]',
  55: 'w-[35.2rem]',
  56: 'w-[35.84rem]',
  57: 'w-[36.48rem]',
  58: 'w-[37.12rem]',
  59: 'w-[37.76rem]',
  60: 'w-[38.4rem]',
  61: 'w-[39.04rem]',
  62: 'w-[39.68rem]',
  63: 'w-[40.32rem]',
  64: 'w-[40.96rem]',
  65: 'w-[41.6rem]',
  66: 'w-[42.24rem]',
  67: 'w-[42.88rem]',
  68: 'w-[43.52rem]',
  69: 'w-[44.16rem]',
  70: 'w-[44.8rem]',
  71: 'w-[45.44rem]',
  72: 'w-[46.08rem]',
  73: 'w-[46.72rem]',
  74: 'w-[47.36rem]',
  75: 'w-3xl',
  76: 'w-[48.64rem]',
  77: 'w-[49.28rem]',
  78: 'w-[49.92rem]',
  79: 'w-[50.56rem]',
  80: 'w-[51.2rem]',
  81: 'w-[51.84rem]',
  82: 'w-[52.48rem]',
  83: 'w-[53.12rem]',
  84: 'w-[53.76rem]',
  85: 'w-[54.4rem]',
  86: 'w-[55.04rem]',
  87: 'w-[55.68rem]',
  88: 'w-[56.32rem]',
  89: 'w-[56.96rem]',
  90: 'w-[57.6rem]',
  91: 'w-[58.24rem]',
  92: 'w-[58.88rem]',
  93: 'w-[59.52rem]',
  94: 'w-[60.16rem]',
  95: 'w-[60.8rem]',
  96: 'w-[61.44rem]',
  97: 'w-[62.08rem]',
  98: 'w-[62.72rem]',
  99: 'w-[63.36rem]',
  100: 'w-5xl',
} as Record<string, string>;

interface Props {
  prevScore: number[];
  nextScore: number[];
  prevT: number;
  nextT: number;
}

export const Graph = (props: Props) => {
  const { prevScore, nextScore, prevT, nextT } = props;

  return (
    <div className="relative grid">
      <div className="grid grid-cols-[auto_1fr] place-items-center">
        <div className="w-12">
          <span className="text-primary">T{prevT}</span>
        </div>
        <div className="relative h-4 w-5xl rounded-md bg-gray-300">
          <div className="absolute bottom-0 left-0 flex items-end justify-end">
            <div
              className={cn(
                'h-4 rounded-s-md bg-green-400',
                WIDTH_DICT[prevScore.toString()],
              )}
            ></div>
            <div className="h-10 w-[2px] rounded-md bg-green-400 text-white"></div>
            <span className="relative -left-4 -top-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-400 leading-none text-white">
              {prevScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] place-items-center">
        <div className="w-12">
          <span className="text-primary">T{nextT}</span>
        </div>
        <div className="relative h-4 w-5xl rounded-md bg-gray-300">
          <div className="absolute bottom-0 left-0 flex items-end justify-end">
            <div
              className={cn(
                'h-4 rounded-s-md bg-green-400',
                WIDTH_DICT[nextScore.toString()],
              )}
            ></div>
            <div className="relative top-6 h-10 w-[2px] rounded-md bg-green-400 text-white"></div>
            <span className="relative -left-4 top-12 flex h-8 w-8 items-center justify-center rounded-full bg-green-400 leading-none text-white">
              {nextScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
