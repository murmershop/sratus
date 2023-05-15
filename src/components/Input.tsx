import { FC } from "react";
import clsx from "clsx";

interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: FC<InputProps> = ({
  id,
  label = "Label",
  placeholder = "",
  value,
  disabled = false,
  onChange,
}) => (
  <div className="flex flex-col">
    <label
      htmlFor={id}
      className={clsx("text-gray-900 block text-sm font-medium", {
        ["opacity-20"]: disabled,
      })}
    >
      {label}
    </label>
    <input
      name={id}
      id={id}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  disabled:opacity-20"
    />
  </div>
);
