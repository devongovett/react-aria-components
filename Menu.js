import {createContext, useRef, useContext} from 'react';

import {useMenuTriggerState, useTreeState, Item} from 'react-stately';
import {
  useMenu,
  useMenuItem,
  useMenuTrigger,
} from 'react-aria';
import {ButtonContext} from './Button';
import {PopoverContext} from './Popover';
import {Provider, useRenderProps} from './utils';

const MenuContext = createContext();

export function MenuTrigger(props) {
  let state = useMenuTriggerState(props);

  let buttonRef = useRef();
  let {menuTriggerProps, menuProps} = useMenuTrigger({}, state, buttonRef);

  return (
    <Provider
      values={[
        [MenuContext, {menuProps, state}],
        [ButtonContext, {...menuTriggerProps, buttonRef}],
        [PopoverContext, {state, triggerRef: buttonRef}]
      ]}>
      {props.children}
    </Provider>
  );
}

export function Menu(props) {
  let {state: menuTriggerState, menuProps: mp} = useContext(MenuContext);
  let state = useTreeState({...props, selectionMode: 'none'});

  let ref = useRef();
  let {menuProps} = useMenu({
    ...props,
    ...mp,
    autoFocus: menuTriggerState.focusStrategy
  }, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      style={props.style}
      className={props.className}>
      {[...state.collection].map(item => (
        <MenuItem
          key={item.key}
          item={item}
          state={state}
          onAction={props.onAction}
          onClose={menuTriggerState.close} />
      ))}
    </ul>
  );
}

export {Item};

function MenuItem({item, state, onAction, onClose}) {
  let ref = useRef();
  let isFocused = state.selectionManager.focusedKey === item.key;

  let {menuItemProps, isDisabled, isSelected} = useMenuItem({
    key: item.key,
    onAction,
    onClose
  }, state, ref);

  let renderProps = useRenderProps({
    className: item.props.className,
    style: item.props.style,
    children: item.rendered,
    values: {
      isFocused,
      isSelected,
      isDisabled
    }
  });

  return (
    <li
      {...menuItemProps}
      {...renderProps}
      ref={ref} />
  );
}
