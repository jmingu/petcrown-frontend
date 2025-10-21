'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface CuteDatePickerProps {
  value: string; // YYYY-MM-DD 형식
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const CuteDatePicker: React.FC<CuteDatePickerProps> = ({
  value,
  onChange,
  placeholder = "날짜를 선택해주세요",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        popperClassName="cute-datepicker-popper"
        calendarClassName="cute-datepicker-calendar"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        scrollableYearDropdown
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      
      <style jsx global>{`
        .cute-datepicker-popper {
          z-index: 9999;
        }
        
        .cute-datepicker-calendar {
          border: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .react-datepicker__header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-bottom: none;
          border-radius: 0;
          padding: 1rem;
        }
        
        .react-datepicker__current-month {
          color: white;
          font-weight: 600;
        }
        
        .react-datepicker__day-name {
          color: white;
          font-size: 0.75rem;
        }
        
        .react-datepicker__day {
          margin: 0.2rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .react-datepicker__day:hover {
          background: #f3f4f6;
          border-radius: 0.5rem;
        }
        
        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 0.5rem;
        }
        
        .react-datepicker__day--selected:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
        
        .react-datepicker__navigation {
          top: 1.2rem;
        }
        
        .react-datepicker__navigation--previous {
          left: 1rem;
        }
        
        .react-datepicker__navigation--next {
          right: 1rem;
        }
        
        .react-datepicker__dropdown {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .react-datepicker__dropdown-option {
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        
        .react-datepicker__dropdown-option:hover {
          background: #f3f4f6;
        }
        
        .react-datepicker__dropdown-option--selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CuteDatePicker;