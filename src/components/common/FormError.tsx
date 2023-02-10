import React from "react";

interface FormErrorProps {
  errorMessage: string;
}

const FormError: React.FC<FormErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return (
    <div
      className="mt-1 mb-2 text-[12px] text-[#de0124]"
      data-testid="form-error"
    >
      {errorMessage}
    </div>
  );
};

export { FormError };
