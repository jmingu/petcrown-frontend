import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date; // 과거 날짜 선택 방지
  maxDate?: Date; // 미래 날짜 선택 방지
  showTimeSelect?: boolean; // 시간 선택 활성화
  disabled?: boolean; // 비활성화
  inputClassName?: string;
  wrapperClassName?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  showTimeSelect = false,
  disabled = false,
  inputClassName = '',
  wrapperClassName = '',
}) => {
  return (
    <div className={`relative ${wrapperClassName} w-full`}>
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
        dateFormat={showTimeSelect ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        disabled={disabled}
        className={`w-full p-3 border rounded bg-white border-gray-300 focus:ring focus:ring-theme-sky ${inputClassName}`}
				wrapperClassName={`w-full ${wrapperClassName}`}
        placeholderText={placeholder}
      />
    </div>
  );
};

export default DateInput;
