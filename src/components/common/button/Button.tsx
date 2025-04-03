interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'disabled' | 'accent' | 'gray';
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // 추가
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  onClick,
  disabled = false,
  className = '', // 기본값 빈 문자열
}) => {
  const baseStyle =
    'py-2 px-4 rounded transition-colors duration-200 cursor-pointer';

  const buttonStyle = {
    primary: 'bg-theme-green text-white',
    disabled: 'bg-green-300 text-white cursor-not-allowed',
    accent: 'bg-theme-sky text-white',
    gray: 'bg-theme-gray text-white',
  };

  return (
    <button
      className={`${baseStyle} ${buttonStyle[type]} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
