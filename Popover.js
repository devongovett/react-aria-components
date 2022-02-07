import {createContext, useContext, useRef} from 'react';
import {useOverlay, useOverlayPosition, useModal, FocusScope, mergeProps, DismissButton, OverlayContainer} from 'react-aria';

const PopoverContext = createContext();

export function PopoverProvider({children, ...value}) {
  return (
    <PopoverContext.Provider value={value}>
      {children}
    </PopoverContext.Provider>
  );
}

export function Popover(props) {
  let {popoverRef, triggerRef, state} = useContext(PopoverContext);
  let ref = useRef();
  popoverRef = popoverRef || ref;
  let { isOpen = state.isOpen, children, onClose = state.close } = props;
  // if (!isOpen) {
  //   return null;
  // }

  // let { dialogProps } = useDialog(props, popoverRef);

  if (!isOpen) {
    return <div hidden>{children}</div>;
  }

  return (
    <OverlayContainer>
      <Overlay 
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        popoverRef={popoverRef}
        placement={props.placement}>{children}</Overlay>
    </OverlayContainer>
  );
}

function Overlay({children, isOpen, onClose, triggerRef, popoverRef, placement}) {
  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true
    },
    popoverRef
  );

  let { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: popoverRef,
    placement: placement || 'top',
    offset: 5,
    isOpen
  });

  let { modalProps } = useModal({
    isDisabled: !isOpen
  });

  return (
    <FocusScope restoreFocus>
      <div
        {...mergeProps(overlayProps, positionProps, modalProps)}
        ref={popoverRef}>
        <DismissButton onDismiss={onClose} />
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}