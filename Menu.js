import {cloneElement, createContext, useRef, useContext} from 'react';

import {useMenuTriggerState, useTreeState, Item} from 'react-stately';
import {
  mergeProps,
  useMenu,
  useMenuItem,
  useMenuSection,
  useMenuTrigger,
} from 'react-aria';
import {ButtonContext} from './Button';
import {PopoverContext} from './Popover';
import {Provider, useRenderProps} from './utils';
import {Separator, SeparatorContext} from './Separator';

const MenuTriggerContext = createContext();
const MenuContext = createContext();

export function MenuTrigger(props) {
  let state = useMenuTriggerState(props);

  let buttonRef = useRef();
  let {menuTriggerProps, menuProps} = useMenuTrigger({
    ...props,
    type: 'menu'
  }, state, buttonRef);

  return (
    <Provider
      values={[
        [MenuTriggerContext, {menuProps, state}],
        [ButtonContext, {...menuTriggerProps, buttonRef}],
        [PopoverContext, {state, triggerRef: buttonRef}]
      ]}>
      {props.children}
    </Provider>
  );
}

export function Menu(props) {
  let {state: menuTriggerState, menuProps: mp} = useContext(MenuTriggerContext);
  let state = useTreeState(props);

  let ref = useRef();
  let {menuProps} = useMenu(mergeProps(props, mp), state, ref);

  let renderSection = props.renderSection || ((section) => <MenuSection section={section} />);
  let renderItem = props.renderItem || ((item) => <MenuItem item={item} />);
  let renderSeparator = props.renderSeparator || ((separator) =>  <Separator {...separator.props} />);

  return (
    <ul
      {...menuProps}
      ref={ref}
      style={props.style}
      className={props.className}>
      <Provider
        values={[
          [MenuContext, {renderItem, state}],
          [SeparatorContext, {elementType: 'li'}]
        ]}>
        {[...state.collection].map(item => cloneElement(
          item.type === 'section'
            ? renderSection(item)
            : item.type === 'separator'
              ? renderSeparator(item)
              : renderItem(item)
        , {key: item.key}))}
      </Provider>
    </ul>
  );
}

export function MenuSection({section, children, className, style}) {
  let {renderItem, state} = useContext(MenuContext);
  let {itemProps, headingProps, groupProps} = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label']
  });

  let renderProps = useRenderProps({
    className: className || section.props.className,
    style: style || section.props.style,
    children: children || section.rendered,
    values: section
  });

  return (
    <li {...itemProps} style={{display: 'contents'}}>
      {renderProps.children &&
        <span {...headingProps} style={{display: 'contents'}}>
          {renderProps.children}
        </span>
      }
      <ul {...groupProps} {...renderProps}>
        {[...section.childNodes].map(renderItem)}
      </ul>
    </li>
  );
}

export function MenuItem({item, children, className, style}) {
  let {state} = useContext(MenuContext);
  let ref = useRef();
  let {menuItemProps, isDisabled, isSelected, isFocused} = useMenuItem({key: item.key}, state, ref);

  let renderProps = useRenderProps({
    className: className || item.props.className,
    style: style || item.props.style,
    children: children || item.rendered,
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
