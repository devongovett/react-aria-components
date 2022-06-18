import {useRef, createContext, useContext} from 'react';
import {useOverlayTriggerState} from 'react-stately';
import {useDialog, useOverlayTrigger, FocusScope, usePreventScroll, OverlayContainer, useOverlay, useModal, mergeProps} from 'react-aria';
import {ButtonContext} from './Button';
import {PopoverContext} from './Popover';
import {Provider} from './utils';

export const DialogContext = createContext();
const InternalDialogContext = createContext();

export function DialogTrigger(props) {
  let state = useOverlayTriggerState(props);
  
  let buttonRef = useRef();
  let {triggerProps, overlayProps} = useOverlayTrigger({type: 'dialog'}, state, buttonRef);

  return (
    <Provider
      values={[
        [InternalDialogContext, {state, overlayProps}],
        [ButtonContext, {...triggerProps, onPress: () => state.open(), buttonRef}],
        [PopoverContext, {state, triggerRef: buttonRef, restoreFocus: false}]
      ]}>
      {props.children}
    </Provider>
  );
}

export function Modal(props) {
  let {state} = useContext(InternalDialogContext);
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
  let {state, overlayProps: ctxOverlayProps} = useContext(InternalDialogContext);
    
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
      <InternalDialogContext.Provider value={{
        overlayProps: mergeProps(ctxOverlayProps, overlayProps, modalProps),
        state,
        overlayRef: ref
      }}>
        {props.children}
      </InternalDialogContext.Provider>
    </div>
  );
}

export function Dialog(props) {
  let {state, overlayProps, overlayRef} = useContext(InternalDialogContext);
  let propsFromContext = useContext(DialogContext);
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
      <section {...mergeProps(overlayProps, dialogProps, propsFromContext)} ref={overlayRef} style={props.style} className={props.className}>
        <ButtonContext.Provider value={{}}>
          {children}
        </ButtonContext.Provider>
      </section>
    </FocusScope>
  );
}
