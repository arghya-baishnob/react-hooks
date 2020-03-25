import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (currentHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
      case 'RESPONSE':
        return {...currentHttpState, loading: false, data: action.responseData, extra: action.extra};
      case 'ERROR':
        return {loading: false, error: action.errorMessage};
      case 'CLEAR':
        return initialState;
      default : 
        throw new Error('Should not get reached to httpReducer !!');
    }
  }

const useHttp = () => {
    // Firebase API URI
    const firebaseApi = process.env.REACT_APP_FIREBASE_API ;

    const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState);

    // clear the loading status/error modal
    const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

    // this send request to firebase
    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
        fetch(
            firebaseApi + url, 
            {
                method: method,
                body: body,
                headers: { 'Content-Type': 'application/json' }
            })
        .then(response => response.json())
        .then(responseData => {
            dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra });
        })
        .catch(error => {
            dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong !!! ' + error.message });
        });
    }, [firebaseApi]);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    };
};

export default useHttp;