import React from "react";
import { CloseCircle } from "iconsax-reactjs";

export default function Modal({ children, showModal, setShowModal }: any) {
  if (showModal)
    return (
      <div
        className="bg-black fixed inset-0 bg-opacity-25 backdrop-blur-sm z-50 flex justify-center items-center h-full"
        id="wrapper"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "wrapper")
            return setShowModal(false);
        }}
      >
        <div className="bg-white flex flex-col p-5 rounded-lg w-2/3 overflow-y-scroll h-[95%]">
          <div className="self-end">
            <CloseCircle
              className=" self-end size-6 cursor-pointer  "
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className=""> {children}</div>
        </div>
      </div>
    );
}
