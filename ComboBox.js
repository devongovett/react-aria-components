import {useRef, createContext, useContext, useState, useEffect} from 'react';
import {useComboBoxState} from 'react-stately';
import {useComboBox, useFilter} from 'react-aria';
import {PressResponder} from '@react-aria/interactions';
import {PopoverProvider} from './Popover';
import {ButtonProvider} from './Button';
import {ListBoxProvider} from './ListBox';
import {LabelProvider} from './Label';

const ComboBoxContext = createContext();

export function ComboBox(props) {
  let [propsFromListBox, setListBoxProps] = useState(null);

  // Create state based on the incoming props
  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({
    defaultFilter: contains,
    ...props,
    items: propsFromListBox ? undefined : [],
    children: () => {},
    ...propsFromListBox
  });

  // Get props for child elements from useSelect
  let buttonRef = useRef(null);
  let inputRef = useRef(null);
  let listBoxRef = useRef(null);
  let popoverRef = useRef(null);
  let {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps
  } = useComboBox({
      ...props,
      label: 'f',
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef
    },
    state
  );

  return (
    <ComboBoxContext.Provider value={{
      state,
      labelProps,
      inputProps,
      inputRef,
    }}>
      <LabelProvider {...labelProps}>
        <ButtonProvider {...buttonProps} buttonRef={buttonRef}>
          <PopoverProvider state={state} popoverRef={popoverRef} triggerRef={buttonRef}>
            <ListBoxProvider state={state} setListBoxProps={setListBoxProps} {...listBoxProps} listBoxRef={listBoxRef}>
              {props.children}
            </ListBoxProvider>
          </PopoverProvider>
        </ButtonProvider>
      </LabelProvider>
    </ComboBoxContext.Provider>
  );
}

export function Input({children}) {
  let {state, inputProps, inputRef} = useContext(ComboBoxContext);

  return (
    <input {...inputProps} ref={inputRef} />
  );
}
