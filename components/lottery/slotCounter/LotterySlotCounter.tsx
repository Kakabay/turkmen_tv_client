'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SlotCounter from 'react-slot-counter';

const LotterySlotCounter = ({ numberString }: { numberString: string }) => {
  const [formattedNumber, setFormattedNumber] = useState(numberString);

  useEffect(() => {
    const formatted = numberString.replace(/-/g, ',');
    setFormattedNumber(formatted);
  }, [numberString]);

  return (
    <div className="relative w-fit">
      <Image
        src="/roller-triangle.svg"
        alt="roller-triangle"
        width={48}
        height={48}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
      />
      <Image
        src="/roller-triangle.svg"
        alt="roller-triangle"
        width={48}
        height={48}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 rotate-180"
      />
      <div
        className="flex w-full items-center h-[180px] max-w-[1132px] justify-center text-white py-4 px-6 rounded-full overflow-y-hidden overflow-x-visible relative border-4 border-lightPrimary"
        style={{
          background:
            'linear-gradient(180deg, #454673 0%, #575992 10.5%, #575992 90%, #454673 100%)',
          boxShadow: '0px 4px 4px 0px #00000040',
        }}>
        {/* Highlight */}
        <div
          className="absolute top-[50%] -translate-y-1/2 left-0 w-full h-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(87, 89, 146, 0) 0%, #7274AB 50%, rgba(87, 89, 146, 0) 100%)',
          }}></div>

        <div className="z-10">
          <SlotCounter
            value={formattedNumber}
            // startValue={'00,00,00,00,00'}
            charClassName="rolling-number"
            separatorClassName="slot-seperator"
            duration={2}
            speed={2}
            startFromLastDigit
            delay={2}
            animateUnchanged={true}
            // autoAnimationStart={false}
          />
        </div>
      </div>
    </div>
  );
};

export default LotterySlotCounter;