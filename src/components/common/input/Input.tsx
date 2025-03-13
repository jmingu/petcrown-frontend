import { useState } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  minLength?: number;
  onlyNumbers?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string; // 추가된 부분
  divClass?: string; // 추가된 부분
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  maxLength,
  minLength,
  onlyNumbers = false,
  required = false,
  min,
  max,
  className = '', // 기본값 설정
  divClass = '',
}) => {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (onlyNumbers) {
      newValue = newValue.replace(/[^0-9]/g, '');
    }

    if (type === 'number') {
      const numericValue = Number(newValue);
      if (min !== undefined && numericValue < min) {
        setError(`최소 ${min} 이상 입력해야 합니다.`);
        return;
      }
      if (max !== undefined && numericValue > max) {
        setError(`최대 ${max}까지 입력 가능합니다.`);
        return;
      }
    }

    if (type !== 'number') {
      if (maxLength && newValue.length > maxLength) {
        setError(`최대 ${maxLength}자까지 입력 가능합니다.`);
        return;
      }
      if (minLength && newValue.length < minLength && newValue.length > 0) {
        setError(`최소 ${minLength}자 이상 입력해야 합니다.`);
      } else {
        setError('');
      }
    }

    onChange(newValue);
  };

  return (
    <div className={`w-full ${divClass}`}>
      <input
        type={onlyNumbers ? 'text' : type}
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 mb-3 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`} // 추가된 부분
        value={value}
        onChange={handleChange}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
