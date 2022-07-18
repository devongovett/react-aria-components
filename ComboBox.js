import {useRef, useState} from 'react';
import {useComboBoxState} from 'react-stately';
import {useComboBox, useFilter} from 'react-aria';
import {PopoverContext} from './Popover';
import {ButtonContext} from './Button';
import {ListBoxContext} from './ListBox';
import {LabelContext} from './Label';
import {InputContext} from './Input';
import {Provider} from './utils';

export function ComboBox(props) {
  let [propsFromListBox, setListBoxProps] = useState(null);

  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({
    defaultFilter: contains,
    ...props,
    items: propsFromListBox ? props.items : [],
    children: () => {},
    ...propsFromListBox
  });

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
    <Provider
      values={[
        [LabelContext, labelProps],
        [ButtonContext, {...buttonProps, buttonRef}],
        [InputContext, {...inputProps, inputRef}],
        [PopoverContext, {state, popoverRef, triggerRef: inputRef, preserveChildren: true, isNonModal: true}],
        [ListBoxContext, {state, setListBoxProps, ...listBoxProps, listBoxRef}]
      ]}>
      {props.children}
    </Provider>
  );
}
