/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { Modal as JoyModal, ModalDialog } from "@mui/joy";
import { CircleButton } from "./lib";

const ModalContext = React.createContext();

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach((fn) => fn && fn(...args));

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
}

function ModalDismissButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext);

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  });
}

function ModalOpenButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext);

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  });
}

function ModalContentsBase({ children, ...props }) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext);

  return (
    <JoyModal open={isOpen} onClose={() => setIsOpen(false)}>
      <ModalDialog {...props}>{children}</ModalDialog>
    </JoyModal>
  );
}

function ModalContents({ title, children, ...props }) {
  return (
    <ModalContentsBase {...props}>
      <div css={{ display: "flex", justifyContent: "flex-end" }}>
        <ModalDismissButton>
          <CircleButton id="close">
            <span aria-hidden>x</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{ textAlign: "center", fontSize: "2em" }}>{title}</h3>
      {children}
    </ModalContentsBase>
  );
}

export { ModalOpenButton, ModalDismissButton, ModalContents, Modal };
