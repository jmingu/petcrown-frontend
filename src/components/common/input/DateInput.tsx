import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface DateInputProps {
  value: string; // YYYY-MM-DD 형식의 문자열
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date; // 과거 날짜 선택 방지
  maxDate?: Date; // 미래 날짜 선택 방지
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
  disabled = false,
  inputClassName = '',
  wrapperClassName = '',
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date.toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 변환
    }
    setIsCalendarOpen(false); // 날짜 선택 후 달력 닫기
  };

  return (
    <div className={`relative ${wrapperClassName} w-full`}>
      <input
        type="text"
        value={value}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        className={`w-full p-3 border rounded bg-white border-gray-300 focus:ring focus:ring-theme-sky ${inputClassName}`}
      />
      {isCalendarOpen && (
        <div className="absolute z-10 bg-white shadow-lg rounded mt-2" style={{ maxWidth: '100%', width: '300px' }}>
          <Calendar
            onChange={(date) => handleDateChange(date as Date | null)} // 타입 캐스팅 추가
            value={value ? new Date(value) : null} // value를 Date 또는 null로 설정
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
