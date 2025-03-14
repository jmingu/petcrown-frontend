// ✅ 별도 RadioGroup 컴포넌트 생성
interface RadioGroupProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, selectedValue, onChange }) => {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center">
          <input
						type="radio"
						name={name}
						value={option.value}
						checked={selectedValue === option.value}
						onChange={(e) => onChange(e.target.value)}
						className="w-5 h-5 border border-gray-400 rounded-full appearance-none 
							checked:border-[var(--color-theme-sky)] relative 
							checked:after:content-[''] checked:after:w-2.5 checked:after:h-2.5 
							checked:after:bg-[var(--color-theme-sky)] checked:after:rounded-full 
							checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 
							checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
					/>
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
