import {useRef, createContext, useContext} from 'react';
import {useNumberFieldState} from 'react-stately';
import {useNumberField, useLocale, mergeProps} from 'react-aria';
import {InputProvider} from './Input';
import {LabelProvider} from './Label';
import {Button} from './Button';

const NumberFieldContext = createContext();

export function NumberField(props) {
  let {locale} = useLocale();
  let state = useNumberFieldState({...props, locale});
  let inputRef = useRef();
  let {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField({...props, label: 's'}, state, inputRef);
  
  return (
    <NumberFieldContext.Provider value={{state, groupProps, incrementButtonProps, decrementButtonProps}}>
      <InputProvider {...inputProps} inputRef={inputRef}>
        <LabelProvider {...labelProps}>
          {props.children}
        </LabelProvider>
      </InputProvider>
    </NumberFieldContext.Provider>
  );
}

export function Group({children, style, className}) {
  let {groupProps} = useContext(NumberFieldContext);
  return (
    <div {...groupProps} style={style} className={className}>
      {children}
    </div>
  );
}

export function IncrementButton(props) {
  let {incrementButtonProps} = useContext(NumberFieldContext);
  return <Button {...mergeProps(props, incrementButtonProps)} />
}

export function DecrementButton(props) {
  let {decrementButtonProps} = useContext(NumberFieldContext);
  return <Button {...mergeProps(props, decrementButtonProps)} />
}
