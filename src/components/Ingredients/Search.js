import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';
import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [ enteredFilter, setEnteredFilter ] = useState('');
  const inputRef = useRef();
  // custom http hook
  const { isLoading, data, error, sendRequest, clear } = useHttp(); 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // enteredFilter: filter value before setting the timed out
      // inputRef: holds the reference of the current value
      if (enteredFilter === inputRef.current.value) {
        const queryParams = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"` ;
        sendRequest('ingredients.json' + queryParams, 'GET');
      }
    }, 500);
    return () => {
      // this is a clean up function, it will only before of the next runs of the useEffect().
      // it won't run at first time
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    console.log('data'+ data)
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading..</span>}
          <input 
            type="text" 
            ref={inputRef}
            value={enteredFilter} 
            onChange={event => {setEnteredFilter(event.target.value)}} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
