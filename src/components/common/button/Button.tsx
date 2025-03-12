interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "disabled" | "accent" | "gray";
  onClick?: () => void;
  disabled?: boolean;
	className?: string; // 추가
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "primary",
  onClick,
  disabled = false,
	className = "", // 기본값 빈 문자열
}) => {
  const baseStyle =
    "font-bold py-2 px-4 rounded transition-colors duration-200";

  const buttonStyle = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    disabled: "bg-green-300 text-gray-500 cursor-not-allowed",
    accent: "bg-yellow-400 hover:bg-yellow-500 text-white", // 포인트 색상
		gray: "bg-gray-300 text-gray-600"
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