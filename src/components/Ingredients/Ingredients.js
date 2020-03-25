import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

// ingredient reducer
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredient;
    case 'ADD':
      return [ ...currentIngredients, action.ingredient ];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default : 
      throw new Error('Should not get reached to ingredientReducer !!');
  }
}

const Ingredients = React.memo(props => {
  // useReducer(): use this in place of useState() when you have linked/dependent state
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);

  // custom http hook
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();

  // const [ userIngredients, setUserIngredients ] = useState([]);
  // const [ isLoading, setIsLoading ] = useState(false);
  // const [ error, setError ] = useState();

  // useEffect() description:
  // function passed to useEffect will get executed after(first time rendered) & every render cycle(re-rendered) of this component.
  // without any second argument, useEffect(() => {}) works like componentShouldUpdate. It runs after every function update(re-render).
  // with second argument as blank/filled array, useEffect(() => {}, []) works like componentDidMount.
  // [] this second argument contains the dependencies of you function which is passed as first argument.

  // It's already sent from Search Component, check there
  // useEffect(() => {
  //   fetch(firebaseApi + 'ingredient.json')
  //   .then(response => response.json())
  //   .then(responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  // }, []);  

  
  // can add multiple useEffect in one component
  // this runs only when userIngredients changed
  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);


  // add ingredient
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  // fetch/filter ingredient
  const filteredIngredientHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredient: filteredIngredients });
  }, []);


  // remove ingredient
  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  // clearing error form modal
  const clearError = () => {
    clear();
  }
  
  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler]);

  //  {error && <ErrorModal/>}  is equivalent to {error ? <ErrorModal/> : null}
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>} 

      <IngredientForm 
        onIngredientAdded={addIngredientHandler} 
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
});

export default Ingredients;
