import {createContext, useContext} from 'react';
import {mergeProps} from 'react-aria';

export const LabelContext = createContext({});

export function Label(props) {
  let context = useContext(LabelContext);
  props = mergeProps(context, props);
  let {children, style, className, elementType: ElementType = 'label', ...labelProps} = props;
  return <ElementType {...labelProps} style={style} className={className}>{children}</ElementType>;
}
