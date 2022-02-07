import {createContext, useContext} from 'react';

const InputContext = createContext();

export function InputProvider({children, ...value}) {
  return (
    <InputContext.Provider value={value}>
      {children}
    </InputContext.Provider>
  )
}

export function Input() {
  let {inputRef, ...inputProps} = useContext(InputContext) || {};

  return (
    <input {...inputProps} ref={inputRef} />
  );
}
