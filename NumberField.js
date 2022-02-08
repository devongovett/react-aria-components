import {useRef, createContext, useContext} from 'react';
import {useNumberFieldState} from 'react-stately';
import {useNumberField, useLocale, mergeProps} from 'react-aria';
import {InputProvider} from './Input';
import {LabelProvider} from './Label';
import {Button} from './Button';
import {GroupProvider} from './Group';

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
    <NumberFieldContext.Provider value={{state, incrementButtonProps, decrementButtonProps}}>
      <GroupProvider {...groupProps}>
        <InputProvider {...inputProps} inputRef={inputRef}>
          <LabelProvider {...labelProps}>
            {props.children}
          </LabelProvider>
        </InputProvider>
      </GroupProvider>
    </NumberFieldContext.Provider>
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
