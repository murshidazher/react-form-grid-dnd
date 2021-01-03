import React from "react";
import "./form-builder.styles.scss";
import Icon from "react-hero-icon";

const FormBuilder = (props) => (
  <div className="text-black px-4">
    <button
      className="text-pink-500 bg-transparent border border-solid active:bg-pink-600 font-semi-bold text-xs px-4 py-2  outline-none focus:outline-none flex flex-wrap items-center"
      type="button"
      onClick={() => console.log("hi")}
    >
      <i className="fas inline-block pr-2">
        <Icon className="h-4 w-4" icon="plus" />
      </i>
      Textbox
    </button>
  </div>
);

export default FormBuilder;
