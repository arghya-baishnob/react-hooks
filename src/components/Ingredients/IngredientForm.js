import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  // useState() description:
  // useState() always return an array with 2 elements
  // element1: your current state snapshot (initial state / updated state)
  // element2: function allow to update your current state

  // previous way
  // const inputState = useState({ title: "", amount: "" });

  // standard declaration
  // const [inputState, setInputState] = useState({ title: '', amount: '' });

  // by array destructuring
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onIngredientAdded({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={event => {
                setEnteredAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading ? <LoadingIndicator /> : null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
