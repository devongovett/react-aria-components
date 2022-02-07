import {createContext, useRef, useContext} from 'react';

import {useMenuTriggerState, useTreeState, Item} from 'react-stately';
import {
  useMenu,
  useMenuItem,
  useMenuTrigger,
} from 'react-aria';
import {PressResponder} from '@react-aria/interactions';
import {PopoverProvider} from './Popover';

const MenuContext = createContext();

export function MenuTrigger(props) {
  let state = useMenuTriggerState(props);

  let buttonRef = useRef();
  let {menuTriggerProps, menuProps} = useMenuTrigger({}, state, buttonRef);
  let [button, ...otherChildren] = props.children;

  return (
    <MenuContext.Provider value={{
      menuProps,
      state
    }}>
      <PressResponder {...menuTriggerProps} ref={buttonRef}>
        {button}
      </PressResponder>
      <PopoverProvider state={state} triggerRef={buttonRef}>
        {otherChildren}
      </PopoverProvider>
    </MenuContext.Provider>
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

  let className = item.props.className;
  if (typeof className === 'function') {
    className = className({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  let style = item.props.style;
  if (typeof style === 'function') {
    style = style({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  let rendered = item.rendered;
  if (typeof rendered === 'function') {
    rendered = rendered({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  return (
    <li
      {...menuItemProps}
      ref={ref}
      style={style}
      className={className}>
      {rendered}
    </li>
  );
}
