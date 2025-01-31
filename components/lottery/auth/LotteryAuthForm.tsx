"use client";

import { Queries } from "@/api/queries";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLotteryAuth } from "@/store/useLotteryAuth";

const LotteryAuthForm = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useLotteryAuth((state) => state.setAuth);

  const validatePhone = (value: string) => {
    const phoneRegex = /^993\d{8}$/;
    const isValid = phoneRegex.test(value);

    return isValid;
  };

  const validateCode = (value: string) => {
    const codeRegex = /^.+-\d{10}$/; // Any characters before "-", exactly 10 digits after
    const isValid = codeRegex.test(value);

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePhone(phone)) {
      setError("Telefon belgisi nädogry");
      return;
    }

    if (!validateCode(code)) {
      setError("Açar nädogry");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Queries.authenticateLottery(phone, code);

      if (response.errorMessage) {
        setError(response.errorMessage);
      } else {
        localStorage.setItem("lotteryPhone", phone);
        localStorage.setItem("lotteryCode", code);

        setAuth(response, phone, code);
        router.replace("/lottery");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Telefon belgisi ýa-da açar nädogry");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\\D/g, "");
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);
    // if (value.length <= 12) {
    // }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-lightSurfaceContainer rounded-[24px] md:p-[40px] sm:p-[24px] p-[16px] w-[530px] flex flex-col gap-[24px]"
    >
      <h1 className="md:text-display3 sm:text-[32px] text-[24px] font-[500] md:leading-display3">
        Giriş
      </h1>
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="phone"
            className="font-base-medium text-lightOnSurface cursor-pointer"
          >
            Telefon
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="px-[16px] py-[12px] bg-lightPrimaryContainer rounded-[12px] outline-none text-lightOnSurfaceVariant text-textSmall leading-textSmall"
            placeholder="99363XXXXXX"
            required
            id="phone"
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="code"
            className="font-base-medium text-lightOnSurface cursor-pointer"
          >
            Açar
          </label>

          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            className="px-[16px] py-[12px] bg-lightPrimaryContainer rounded-[12px] outline-none text-lightOnSurfaceVariant text-textSmall leading-textSmall"
            placeholder="C5-0105639808"
            required
            id="code"
          />
        </div>
        {error && (
          <p className="text-lightError text-textSmall leading-textSmall">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !phone || !code}
        className="sm:text-textLarge sm:leading-textLarge text-[16px] leading-[24px] sm:py-[12px] py-[8px] w-full flex justify-center items-center rounded-[12px] bg-lightPrimary font-medium text-lightOnPrimary disabled:opacity-50"
      >
        {isLoading ? "Ýüklenilýär..." : "Giriş"}
      </button>
    </form>
  );
};

export default LotteryAuthForm;
