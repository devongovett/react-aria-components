import {useRef, useState} from 'react';
import {useComboBoxState} from 'react-stately';
import {useComboBox, useFilter} from 'react-aria';
import {PopoverProvider} from './Popover';
import {ButtonProvider} from './Button';
import {ListBoxProvider} from './ListBox';
import {LabelProvider} from './Label';
import {InputProvider} from './Input';

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
    <LabelProvider {...labelProps}>
      <ButtonProvider {...buttonProps} buttonRef={buttonRef}>
        <InputProvider {...inputProps} inputRef={inputRef}>
          <PopoverProvider state={state} popoverRef={popoverRef} triggerRef={buttonRef} preserveChildren>
            <ListBoxProvider state={state} setListBoxProps={setListBoxProps} {...listBoxProps} listBoxRef={listBoxRef}>
              {props.children}
            </ListBoxProvider>
          </PopoverProvider>
        </InputProvider>
      </ButtonProvider>
    </LabelProvider>
  );
}
