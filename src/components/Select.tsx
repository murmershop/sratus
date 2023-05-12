import { FC } from "react";

type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  id: string;
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const PLACEHOLDER_VALUE = "-1";
export const SEPARATOR_VALUE = "-1";

export const Select: FC<SelectProps> = ({
  id,
  label = "Select an option",
  placeholder = "Choose an option",
  value,
  disabled = false,
  options = [],
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="block text-sm font-medium">
      {label}
    </label>
    <select
      id={id}
      name={id}
      className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      disabled={disabled}
      onChange={onChange}
      value={value}
    >
      <option value={PLACEHOLDER_VALUE}>{placeholder}</option>
      <option value={SEPARATOR_VALUE}>---</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
