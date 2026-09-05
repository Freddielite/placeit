"use client";
import { Logo } from "@/components/logo";
import Link from "next/link";
import React, { useState } from "react";

const SignupSuccessModal = () => {
  // State to control modal visibility
  const [isVisible, setIsVisible] = useState(true);

  // Function to close the modal
  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-center text-[#477DC0] mb-4">
              Congratulations!
            </h2>
            <p className="text-center text-gray-700 mb-6">
              Thank you for signing up! Your account has been successfully
              submitted for review. Our team will review your application, and
              you will be notified once your account is activated. We look
              forward to having you onboard!
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-[#477DC0] text-white py-2 px-4 rounded hover:bg-grey-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupSuccessModal;
