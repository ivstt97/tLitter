import React from "react";

const Button = ({ variant = "default", children }) => {
  const baseStyles =
    "bg-pink-600 hover:bg-pink-400 text-white font-bold py-2 px-3 rounded";

  const variantStyles = {
    default: "bg-pink-600 hover:bg-pink-400",
    delete: "bg-red-600 hover:bg-red-400",
  };

  const compositeStyle = `${baseStyles} ${variantStyles[variant]}`;

  return <button className={compositeStyle}>{children}</button>;
};

export default Button;
