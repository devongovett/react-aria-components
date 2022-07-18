import {createContext, useContext} from 'react';

export const InputContext = createContext({});

export function Input() {
  let {inputRef, ...inputProps} = useContext(InputContext);
  return <input {...inputProps} ref={inputRef} />;
}
