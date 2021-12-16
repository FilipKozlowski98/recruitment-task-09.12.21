import { useState } from "react";
import styled from "styled-components";
import { getResponse } from "./api";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  border: 1px solid black;
  border-radius: 10px;
  position: relative;

  > label,
  legend {
    font-size: 16.5px;
    margin-bottom: 10px;
  }

  span,
  fieldset,
  select,
  > input {
    margin-bottom: 30px;
    font-size: 20px;
  }

  fieldset {
    border: none;
    text-align: center;
    label {
      margin-right: 10px;
    }
    input:first-of-type {
      margin-right: 15px;
    }
  }

  textarea {
    min-width: 400px;
    min-height: 150px;
    max-width: 800px;
    max-height: 300px;
    margin-bottom: 5px;
    padding: 7px;
  }

  span {
    font-size: 12.5px;
  }

  span:last-child {
    position: absolute;
    right: 10px;
    bottom: -20px;
  }

  button {
    padding: 10px;
    font-size: 20px;
  }

  div {
    color: red;
  }
`;

export const Form = () => {
  const [formData, changeFormData] = useState({
    description: "",
    sendConfirmation: "",
    vat: "",
    priceNetto: "",
    priceBrutto: "",
  });
  const [errorMessage, changeErrorMessage] = useState("");

  const updateFormData = (e) => {
    changeFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "sendConfirmation" ? e.target.id : e.target.value,
    });
  };

  const calculateBrutto = () => {
    if (formData.vat && formData.priceNetto.match(/^[0-9,.]+$/) !== null) {
      return (
        parseFloat(formData.priceNetto) +
        parseFloat(formData.priceNetto) * (parseFloat(formData.vat) / 100)
      ).toFixed(2);
    } else {
      return "";
    }
  };

  const validateForm = () => {
    if (formData.description.length === 0) {
      document.querySelector(".descriptionLabel").classList.add("invalid");
      changeErrorMessage("Text is required");
      return false;
    } else if (formData.description.length > 255) {
      document.querySelector(".descriptionLabel").classList.add("invalid");
      changeErrorMessage("You can't enter more than 255 characters");
      return false;
    } else {
      document.querySelector(".descriptionLabel").classList.remove("invalid");
    }

    if (formData.sendConfirmation === "") {
      document.querySelector(".confirmationLabel").classList.add("invalid");
      changeErrorMessage("Choose confirmation");
      return false;
    } else {
      document.querySelector(".confirmationLabel").classList.remove("invalid");
    }

    if (formData.vat === "") {
      document.querySelector(".vatLabel").classList.add("invalid");
      changeErrorMessage("Choose VAT");
      return false;
    } else {
      document.querySelector(".vatLabel").classList.remove("invalid");
    }

    if (formData.priceNetto.match(/^[0-9,.]+$/) === null) {
      document.querySelector(".nettoLabel").classList.add("invalid");
      changeErrorMessage("Please, input number");
      return false;
    } else {
      document.querySelector(".nettoLabel").classList.remove("invalid");
    }

    return true;
  };

  const apiResponseHandler = async (response, settings) => {
    const result = await response(settings);
    if (result.status.toString().startsWith(2)) {
      document.querySelector("#form").classList.add("hidden");
      document
        .querySelector(".congratulationWrapper")
        .classList.remove("hidden");
    } else {
      changeErrorMessage(`Something went wrong. code: ${result.status}`);
    }
  };

  return (
    <StyledForm id="form">
      <label htmlFor="description" className="descriptionLabel">
        Description*
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={updateFormData}
      ></textarea>
      <span>
        {formData.description.length < 256
          ? `${255 - formData.description.length} characters left`
          : "Limit exceeded"}
      </span>

      <fieldset>
        <legend className="confirmationLabel">Send confirmation*</legend>
        <label htmlFor="yes">Yes</label>
        <input
          type="radio"
          id="yes"
          name="sendConfirmation"
          onChange={updateFormData}
        ></input>
        <label htmlFor="no">No</label>
        <input
          type="radio"
          id="no"
          name="sendConfirmation"
          onChange={updateFormData}
        ></input>
      </fieldset>

      <label htmlFor="vat" className="vatLabel">
        VAT*
      </label>
      <select name="vat" id="vat" onChange={updateFormData}>
        <option value="">Choose VAT</option>
        <option value="19">19%</option>
        <option value="21">21%</option>
        <option value="23">23%</option>
        <option value="25">25%</option>
      </select>

      <label htmlFor="priceNetto" className="nettoLabel">
        Price netto EUR*
      </label>
      <input
        type="text"
        name="priceNetto"
        id="priceNetto"
        disabled={formData.vat === "" ? true : false}
        onChange={(e) => {
          if (e.target.value.includes(",")) {
            e.target.value = e.target.value.replace(",", ".");
          }
          updateFormData(e);
        }}
      ></input>

      <label htmlFor="priceBrutto">Price brutto EUR</label>
      <input
        type="text"
        name="priceBrutto"
        id="priceBrutto"
        disabled
        value={calculateBrutto()}
      ></input>

      <button
        onClick={(e) => {
          e.preventDefault();
          if (validateForm()) {
            apiResponseHandler(getResponse, {
              method: "post",
              body: JSON.stringify(formData),
              headers: { "Content-Type": "application/json" },
            });
          }
        }}
      >
        SUBMIT !
      </button>

      <div style={{ marginTop: errorMessage === "" ? "0px" : "30px" }}>
        {errorMessage}
      </div>

      <span>* Required</span>
    </StyledForm>
  );
};
