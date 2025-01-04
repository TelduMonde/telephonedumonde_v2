"use client";
import { formUrlQuery } from "@/lib/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";

import { GrFormNext, GrFormPrevious } from "react-icons/gr";

type PaginationProps = {
  page: number;
  totalPages: number;
  // urlParamName: string;
};

export const Pagination = ({
  page,
  totalPages,
}: // urlParamName,
PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    // Si le type du bouton est "next" alors on incrémente la page sinon on décrémente
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      {Number(page) >= 2 && (
        <button
          onClick={() => onClick("prev")}
          disabled={Number(page) <= 1}
          className="rounded-xl  text-[0.8rem] text-white uppercase tracking-widest border-none hover:text-white/80"
        >
          {" "}
          <GrFormPrevious size={25} />
        </button>
      )}

      <span className="text-white font-font1 text-[0.8rem]">
        {page} | {totalPages}
      </span>

      <button
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
        className=" uppercase text-[0.8rem] text-white tracking-widest border-none hover:text-white/80"
      >
        <GrFormNext size={25} />
      </button>
    </div>
  );
};
