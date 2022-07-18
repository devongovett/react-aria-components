import {useRef, createContext, useContext} from 'react';
import {useButton, mergeProps} from 'react-aria';

export const ButtonContext = createContext({});

export function Button(props) {
  let bp = useContext(ButtonContext);
  props = mergeProps(bp, props);
  let ref = useRef();
  ref = props.buttonRef || ref;
  let {buttonProps} = useButton(props, ref);
  return (
    <button
      {...buttonProps}
      ref={ref}>
      {props.children}
    </button>
  );
}
