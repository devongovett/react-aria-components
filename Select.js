import {useRef, createContext, useContext, useState} from 'react';
import {useSelectState} from 'react-stately';
import {useSelect, HiddenSelect} from 'react-aria';
import {PressResponder} from '@react-aria/interactions';
import {PopoverProvider} from './Popover';
import {ButtonProvider} from './Button';
import {ListBoxProvider} from './ListBox';
import {LabelProvider} from './Label';

const SelectContext = createContext();

export function Select(props) {
  let [listBoxProps, setListBoxProps] = useState(null);

  // Create state based on the incoming props
  let state = useSelectState({
    ...props,
    items: [],
    children: () => {},
    ...listBoxProps
  });

  // Get props for child elements from useSelect
  let ref = useRef();
  let {
    labelProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect({...props, label: 's'}, state, ref);

  return (
    <SelectContext.Provider value={{
      state,
      labelProps,
      triggerProps,
      valueProps,
      menuProps,
      setListBoxProps
    }}>
      <LabelProvider {...labelProps} elementType="span">
        <ButtonProvider {...triggerProps} buttonRef={ref}>
          <PopoverProvider state={state} triggerRef={ref}>
            <ListBoxProvider state={state} setListBoxProps={setListBoxProps} {...menuProps}>
              {props.children}
            </ListBoxProvider>
          </PopoverProvider>
        </ButtonProvider>
      </LabelProvider>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name} />
    </SelectContext.Provider>
  );
}

export function Value({children}) {
  let {state, valueProps} = useContext(SelectContext);
  if (typeof children === 'function') {
    children = children({
      selectedItem: state.selectedItem?.rendered
    });
  } else if (children == null) {
    children = state.selectedItem?.rendered || 'Select an item';
  }

  return (
    <span {...valueProps}>
      {children}
    </span>
  );
}
