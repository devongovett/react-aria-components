import {useRef, createContext, useContext} from 'react';
import {useTooltipTriggerState} from 'react-stately';
import {useTooltipTrigger, useTooltip, useOverlayPosition, OverlayContainer, mergeProps} from 'react-aria';
import {FocusableProvider} from '@react-aria/focus';

const TooltipContext = createContext();

export function TooltipTrigger(props) {
  let state = useTooltipTriggerState(props);
  let ref = useRef();
  let {triggerProps, tooltipProps} = useTooltipTrigger(props, state, ref);
  
  let overlayRef = useRef();
  let {overlayProps, arrowProps, placement} = useOverlayPosition({
    placement: props.placement || 'top',
    targetRef: ref,
    overlayRef,
    offset: props.offset,
    crossOffset: props.crossOffset,
    isOpen: state.isOpen
  });
  
  return (
    <TooltipContext.Provider value={{state, overlayProps, overlayRef, tooltipProps, arrowProps, placement}}>
      <FocusableProvider {...triggerProps} ref={ref}>
        {props.children}
      </FocusableProvider>
    </TooltipContext.Provider>
  );
}

export function Tooltip(props) {
  let {state} = useContext(TooltipContext);
  if (!state.isOpen) {
    return null;
  }
  
  return (
    <OverlayContainer>
      <TooltipInner {...props} />
    </OverlayContainer>
  )
}

function TooltipInner(props) {
  let {state, overlayRef, overlayProps, placement} = useContext(TooltipContext);
  
  let className = props.className;
  if (typeof className === 'function') {
    className = className({placement});
  }
  
  let style = props.style;
  if (typeof style === 'function') {
    style = style({placement});
  }
  
  let children = props.children;
  if (typeof children === 'function') {
    children = children({placement});
  }
  
  props = mergeProps(props, overlayProps);
  let {tooltipProps} = useTooltip(props, state);
    
  return (
    <span {...tooltipProps} ref={overlayRef} style={{...style, ...overlayProps.style}} className={className}>
      {props.children}
    </span>
  );
}

export function Arrow(props) {
  let {arrowProps} = useContext(TooltipContext);
  
  return (
    <span {...arrowProps} style={props.style} className={props.className}>{props.children}</span>
  )
}
