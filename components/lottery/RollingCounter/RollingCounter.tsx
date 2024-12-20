'use client';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState, useEffect } from 'react';

interface RollingCounterProps {
  numberString: string;
}

const ROLLS = 2;
const DIGIT_HEIGHT = 104;
const INITIAL_OFFSET = 38;
const EXTRA_NUMBERS_AFTER = 5;
const EXTRA_NUMBERS_BEFORE = 2;

const getNumbers = (targetValue: number, previousValue?: number) => {
  const numbers = [];

  if (previousValue === undefined) {
    // Initial load
    for (let i = 0; i < ROLLS; i++) {
      for (let n = 0; n < 10; n++) {
        numbers.push(n);
      }
    }

    // Add sequence before target
    for (let n = EXTRA_NUMBERS_BEFORE; n > 0; n--) {
      numbers.push((targetValue - n + 10) % 10);
    }

    numbers.push(targetValue);

    // Add extra numbers after target
    for (let n = 1; n <= EXTRA_NUMBERS_AFTER; n++) {
      numbers.push((targetValue + n) % 10);
    }
  } else {
    // Keep the previous sequence
    for (let i = 0; i < ROLLS; i++) {
      for (let n = 0; n < 10; n++) {
        numbers.push(n);
      }
    }

    // Add sequence before previous value
    for (let n = EXTRA_NUMBERS_BEFORE; n > 0; n--) {
      numbers.push((previousValue - n + 10) % 10);
    }

    numbers.push(previousValue);

    // Add complete rolls between previous and target
    for (let i = 0; i < ROLLS; i++) {
      for (let n = 0; n < 10; n++) {
        numbers.push(n);
      }
    }

    // Add sequence before target
    for (let n = EXTRA_NUMBERS_BEFORE; n > 0; n--) {
      numbers.push((targetValue - n + 10) % 10);
    }

    numbers.push(targetValue);

    // Add extra numbers after target
    for (let n = 1; n <= EXTRA_NUMBERS_AFTER; n++) {
      numbers.push((targetValue + n) % 10);
    }
  }

  return numbers;
};

const RollingDigit = ({
  targetValue,
  index,
  onAnimationComplete,
  isStopped,
  showHyphen,
  previousValue,
}: {
  targetValue: number;
  index: number;
  onAnimationComplete: () => void;
  isStopped: boolean;
  showHyphen: boolean;
  previousValue?: number;
}) => {
  const numbers = useMemo(
    () => getNumbers(targetValue, previousValue),
    [targetValue, previousValue],
  );

  return (
    <div className="flex items-center">
      <div className="overflow-hidden h-[180px] w-[77px] relative">
        <motion.div
          initial={false} // Don't reset to initial state
          animate={{
            y: -(numbers.length - EXTRA_NUMBERS_AFTER - 1) * DIGIT_HEIGHT + INITIAL_OFFSET,
          }}
          transition={{
            duration: 2,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
          onAnimationComplete={onAnimationComplete}
          className="absolute flex flex-col">
          {numbers.map((num, i) => (
            <div
              key={`${index}-${i}`}
              className={`h-[${DIGIT_HEIGHT}px] w-[77px] flex items-center justify-center numeric-display-1 transition-colors duration-500 ${
                isStopped && num === targetValue ? 'text-white' : 'text-[#B0B1CD]'
              }`}>
              {num}
            </div>
          ))}
        </motion.div>
      </div>
      {showHyphen && <div className="w-[32px] h-[4px] bg-lightOnPrimary mx-5 self-center" />}
    </div>
  );
};

const RollingCounter: React.FC<RollingCounterProps> = ({ numberString }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isStopped, setIsStopped] = useState<boolean[]>([]);
  const [previousNumbers, setPreviousNumbers] = useState<number[]>([]);
  const [isNewNumber, setIsNewNumber] = useState(false);

  useEffect(() => {
    if (!isInitialLoading) {
      setPreviousNumbers(numbers);
      setIsStopped(new Array(numberString.replace(/-/g, '').length).fill(false));
      setIsNewNumber(true);
    }
  }, [numberString, isInitialLoading]);

  const numbers = useMemo(() => {
    if (!numberString) return [];

    const parsed = numberString
      .replace(/-/g, '')
      .split('')
      .map((char) => parseInt(char, 10));

    if (isInitialLoading) {
      setIsStopped(new Array(parsed.length).fill(false));
      setIsInitialLoading(false);
    }

    return parsed;
  }, [numberString, isInitialLoading]);

  const handleAnimationComplete = useCallback((index: number) => {
    setIsStopped((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }, []);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center bg-lightPrimary text-white py-4 px-6 rounded-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-lightPrimary text-white py-4 px-6 rounded-full">
      {numbers.map((num, index) => (
        <RollingDigit
          key={`${index}-${num}`}
          targetValue={num}
          previousValue={previousNumbers[index]}
          index={index}
          onAnimationComplete={() => handleAnimationComplete(index)}
          isStopped={isStopped[index]}
          showHyphen={(index + 1) % 2 === 0 && index !== numbers.length - 1}
        />
      ))}
    </div>
  );
};

export default RollingCounter;
