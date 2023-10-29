import React from "react";
import Image from "next/image";

import BuyNow from "../buttons/buyNow";

function SaleHunter() {
  return (
    <div className="container mt-[8.75rem] flex justify-center items-center">
      <div className="grid grid-cols-12 bg-text-2 max-w-[73.125rem] min-h-[31.25rem]">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-start">
          <span className="text-button-3 font-poppins text-[1rem] font-[600] leading-[1.25rem] mt-[4.31rem] ml-[3.5rem]">
            Categories
          </span>

          <span className="max-w-[27.6875rem] ml-[3.5rem] mt-[2rem] text-text-1 font-inter text-[1.5rem] sm:text-[2rem] md:text-[3rem] font-[600] leading-[2.25rem] sm:leading-[2.75rem] md:leading-[3.75rem] tracking-[0.12rem]">
            Enhance Your Music Experience
          </span>

          <div className="grid grid-cols-12 sm:inline-flex items-start gap-[0.5rem] sm:gap-[1.5rem] ml-[3.5rem] mt-[2rem]">
            <div className="col-span-6 w-[3.875rem] h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span className="text-text-2 font-poppins text-[1rem] font-[600] leading-[1.25rem]">
                  23
                </span>

                <span className="w-[2rem] text-text-2 font-poppins text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Hours
                </span>
              </div>
            </div>

            <div className="col-span-6 w-[3.875rem] h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span className="text-text-2 font-poppins text-[1rem] font-[600] leading-[1.25rem]">
                  05
                </span>

                <span className="w-[1.75rem] text-text-2 font-poppins text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Days
                </span>
              </div>
            </div>

            <div className="col-span-6 w-[3.875rem] h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span className="text-text-2 font-poppins text-[1rem] font-[600] leading-[1.25rem]">
                  59
                </span>

                <span className="w-[2.6875rem] text-text-2 font-poppins text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Minutes
                </span>
              </div>
            </div>

            <div className="col-span-6 w-[3.875rem] h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span className="text-text-2 font-poppins text-[1rem] font-[600] leading-[1.25rem]">
                  35
                </span>

                <span className="w-[3rem] text-text-2 font-poppins text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          <div className="ml-[3.5rem] mt-[2.5rem]">
            <BuyNow />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 flex items-center justify-center">
          <Image
            className="p-10 lg:p-0 lg:mr-[3.75rem] object-contain"
            src="/assets/images/products/sound.png"
            alt="..."
            width={568}
            height={330}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default SaleHunter;
