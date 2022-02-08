import { forwardRef, useImperativeHandle, useState } from "react";
import Button from "./button";
import Modal from "./modal";

interface AlertOptions {
  title: string;
  description: string;
  showConfirm?: boolean;
}

const Alert = forwardRef((props, ref) => {
  const [showing, setShowing] = useState(false);
  const defaultOptions: AlertOptions = {
    title: "",
    description: "",
    showConfirm: false,
  };
  const [options, setOption] = useState(defaultOptions);
  const [confirm, setConfirm] = useState(() => () => {});
  const [cancel, setCancel] = useState(() => () => {});

  useImperativeHandle(ref, () => ({
    fire(options: AlertOptions) {
      setShowing(true);
      setOption(options);
      return new Promise((resolve) => {
        setConfirm(() => () => {
          resolve(true);
          setShowing(false);
        });
        setCancel(() => () => {
          resolve(false);
          setShowing(false);
        });
      });
    },
  }));

  return (
    <div>
      <Modal setShowModal={setShowing} showing={showing}>
        <div className="max-w-md bg-white rounded p-5 mx-auto my-12">
          <div className="text-lg text-medium my-5 text-center">
            {options.title}
          </div>
          <p className="my-5">{options.description}</p>
          <div className="text-center">
            {options.showConfirm && (
              <Button
                variants="secondary"
                className="mx-3"
                onClick={() => cancel()}
              >
                Cancel
              </Button>
            )}
            <Button
              variants="primary"
              onClick={() => confirm()}
              className="mx-3"
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

Alert.displayName = "Alert";
export default Alert;
