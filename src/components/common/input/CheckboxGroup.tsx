interface CheckboxGroupProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  selectedValues,
  onChange,
}) => {
  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      // 이미 선택된 값이면 제거
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      // 선택되지 않은 값이면 추가
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className="w-5 h-5 border border-gray-400 rounded appearance-none 
              checked:border-[var(--color-theme-sky)] relative 
              checked:after:content-['✔'] checked:after:text-white 
              checked:after:text-sm checked:after:absolute checked:after:top-1/2 
              checked:after:left-1/2 checked:after:-translate-x-1/2 
              checked:after:-translate-y-1/2 checked:bg-[var(--color-theme-sky)]"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
