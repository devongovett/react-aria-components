import {createContext, useContext, useRef} from 'react';
import {useOverlay, useOverlayPosition, useModal, FocusScope, mergeProps, DismissButton, OverlayContainer} from 'react-aria';

export const PopoverContext = createContext();

export function Popover(props) {
  let context = useContext(PopoverContext);
  props = mergeProps(props, context);
  let {popoverRef, triggerRef, children, preserveChildren, restoreFocus = true, state} = props;
  let ref = useRef();
  popoverRef = popoverRef || ref;

  if (!state.isOpen) {
    return preserveChildren ? children : null;
  }

  return (
    <OverlayContainer>
      <Overlay 
        {...props}
        triggerRef={triggerRef}
        popoverRef={popoverRef}
        restoreFocus={restoreFocus}
        state={state}>
        {children}
      </Overlay>
    </OverlayContainer>
  );
}

function usePopover({
  triggerRef,
  popoverRef,
  placement = 'top',
  offset = 5,
  isNonModal,
}, state) {
  let { overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      shouldCloseOnBlur: true,
      isDismissable: true
    },
    popoverRef
  );

  let { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: popoverRef,
    placement,
    offset,
    isOpen: state.isOpen
  });

  let { modalProps } = useModal({
    isDisabled: isNonModal || !state.isOpen
  });

  // TODO: useFocusScope

  return {
    popoverProps: mergeProps(overlayProps, positionProps, modalProps)
  };
}

function Overlay({children, restoreFocus, className, style, state, ...props}) {
  let {popoverProps} = usePopover(props, state);
  
  style = {...style, ...popoverProps.style};

  return (
    <FocusScope restoreFocus={restoreFocus}>
      <div
        {...popoverProps}
        ref={props.popoverRef}
        className={className}
        style={style}>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </FocusScope>
  );
}
