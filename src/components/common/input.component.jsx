import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group mb-4 max-w-sm focus:shadow-outline">
      <label htmlFor={name} className="font-normal leading-normal inline-block mb-2 focus:shadow-outline text-xs capitalize text-gray-600">{label}</label>
      <input {...rest} name={name} id={name} className="form-control select-none appearance-none bg-white rounded-sm text-grey-darkest text-sm px-4 py-2 mb-2 border w-full leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300 " />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;