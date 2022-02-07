import {useRef, createContext, useContext} from 'react';
import {useOverlayTriggerState} from 'react-stately';
import {useDialog, useOverlayTrigger, FocusScope, usePreventScroll, OverlayContainer, useOverlay, useModal, mergeProps} from 'react-aria';
import {ButtonProvider} from './Button';
import {PopoverProvider} from './Popover';

const DialogContext = createContext();

export function DialogTrigger(props) {
  let state = useOverlayTriggerState(props);
  
  let buttonRef = useRef();
  let {triggerProps, overlayProps} = useOverlayTrigger({type: 'dialog'}, state, buttonRef);

  return (
    <DialogContext.Provider value={{
      overlayProps,
      state
    }}>
      <ButtonProvider {...triggerProps} onPress={() => state.open()} buttonRef={buttonRef}>
        <PopoverProvider state={state} triggerRef={buttonRef} restoreFocus={false}>
          {props.children}
        </PopoverProvider>
      </ButtonProvider>
    </DialogContext.Provider>
  );
}

export function Modal(props) {
  let {state} = useContext(DialogContext);
  if (!state.isOpen) {
    return null;
  }
  
  return (
    <OverlayContainer>
      <ModalInner {...props} />
    </OverlayContainer>
  );
}

function ModalInner(props) {
  let {state, overlayProps: ctxOverlayProps} = useContext(DialogContext);
    
  let ref = useRef();
  let {overlayProps, underlayProps} = useOverlay({
    ...props,
    isOpen: state.isOpen,
    onClose: state.close,
    isDismissable: true
  }, ref);
  let {modalProps} = useModal();
  usePreventScroll();
  
  return (
    <div {...underlayProps} style={props.style} className={props.className}>
      <DialogContext.Provider value={{
        overlayProps: mergeProps(ctxOverlayProps, overlayProps, modalProps),
        state,
        overlayRef: ref
      }}>
        {props.children}
      </DialogContext.Provider>
    </div>
  );
}

export function Dialog(props) {
  let {state, overlayProps, overlayRef} = useContext(DialogContext);
  let ref = useRef();
  overlayRef = overlayRef || ref;
  let {dialogProps} = useDialog(props, ref);
  
  let children = props.children;
  if (typeof children === 'function') {
    children = children({
      close: state.close
    });
  }
  
  return (
    <FocusScope contain restoreFocus autoFocus>
      <section {...mergeProps(overlayProps, dialogProps)} ref={overlayRef} style={props.style} className={props.className}>
        <ButtonProvider>
          {children}
        </ButtonProvider>
      </section>
    </FocusScope>
  );
}
