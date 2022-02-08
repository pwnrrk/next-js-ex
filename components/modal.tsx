import React, { MouseEvent, ReactNode, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

type ModalProps = {
  children: ReactNode;
  setShowModal: CallableFunction;
  showing?: boolean;
  clicToClose?: boolean;
};

export default function Modal({
  children,
  showing,
  setShowModal,
  clicToClose,
}: ModalProps) {
  const self = React.createRef<HTMLDivElement>();
  const outsideClick = (event: MouseEvent) => {
    if (event.target == self.current && clicToClose) {
      setShowModal(false);
    }
  };
  useEffect(() => {
    if (showing) {
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
  });
  return (
    <CSSTransition in={showing} timeout={300} classNames="modal" unmountOnExit>
      <div
        ref={self}
        className="top-0 left-0 right-0 bottom-0 fixed bg-black/50"
        onClick={outsideClick}
      >
        {children}
      </div>
    </CSSTransition>
  );
}
