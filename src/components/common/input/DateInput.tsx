import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DateInput.css';

interface DateInputProps {
  value: string | null; // YYYY-MM-DD 형식의 문자열 또는 null
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
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    }
    setIsCalendarOpen(false); // 날짜 선택 후 달력 닫기
  };

  return (
    <div className={`relative ${wrapperClassName} w-full`}>
      <input
        type="text"
        value={value ?? ''}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        className={`w-full p-3 border rounded bg-white border-gray-300 focus:ring focus:ring-theme-sky ${inputClassName}`}
      />
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsCalendarOpen(false)}>
          {/* 오버레이 배경 */}
          <div className="absolute inset-0 bg-black/10" />

          {/* 달력 팝업 */}
          <div
            className="relative bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg w-full max-w-xs p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              onChange={(date) => handleDateChange(date as Date | null)}
              value={value ? new Date(value) : null}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
