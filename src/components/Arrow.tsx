import { FC } from "react";

export const Arrow: FC = () => {
  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div
      className="fixed bottom-3 right-3 cursor-pointer"
      onClick={handleClick}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        height="25px"
        width="25px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"></path>
      </svg>
    </div>
  );
};
