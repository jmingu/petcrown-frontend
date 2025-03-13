import { useState } from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number";
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number; // 최대 글자 수 제한
  minLength?: number; // 최소 글자 수 제한
  onlyNumbers?: boolean; // 숫자만 입력 가능 여부
  required?: boolean; // 필수 입력 여부
  min?: number; // 숫자 입력 최소값
  max?: number; // 숫자 입력 최대값
}

const Input: React.FC<InputProps> = ({
  type = "text",
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
}) => {
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // 숫자만 입력 가능하도록 제한
    if (onlyNumbers) {
      newValue = newValue.replace(/[^0-9]/g, ""); // 숫자가 아닌 문자 제거
    }

    // 숫자 타입일 경우, min/max 적용
    if (type === "number") {
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

    // 글자 수 검증 (숫자가 아닐 경우만 적용)
    if (type !== "number") {
      if (maxLength && newValue.length > maxLength) {
        setError(`최대 ${maxLength}자까지 입력 가능합니다.`);
        return;
      }
      if (minLength && newValue.length < minLength && newValue.length > 0) {
        setError(`최소 ${minLength}자 이상 입력해야 합니다.`);
      } else {
        setError("");
      }
    }

    onChange(newValue);
  };

  return (
    <div className="w-full">
      <input
        type={onlyNumbers ? "text" : type} // 숫자 입력 제한 시 type="text"로 처리
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 mb-3 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={value}
        onChange={handleChange}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
