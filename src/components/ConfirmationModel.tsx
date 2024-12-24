import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion for animations
import Button from "./Button"; // Import custom Button component

const ConfirmationToast: React.FC<{
  isOpen: boolean; // Determines if the toast is visible
  onClose: () => void; // Function to close the toast
  onConfirm: () => void; // Function to handle the confirmation
  title: string; // The title of the toast
  message: string; // The message of the toast
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {/* Only render the toast if isOpen is true */}
      {isOpen && (
        <motion.div
          className="fixed right-8 bottom-8 z-50 p-4"
          initial={{ opacity: 0, x: 50 }} // Initial state (hidden and shifted right)
          animate={{ opacity: 1, x: 0 }} // Animate to visible position
          exit={{ opacity: 0, x: 50 }} // Animate back out when exiting
          transition={{ type: "spring", stiffness: 300, damping: 20 }} // Spring transition for smooth animation
        >
          {/* Toast content */}
          <motion.div
            className="dark:bg-[#1f1e1e6e] bg-[#ffffffc2] rounded-lg shadow-lg max-w-sm p-4"
            initial={{ scale: 0.8, opacity: 0 }} // Initial state (smaller and hidden)
            animate={{ scale: 1, opacity: 1 }} // Animate to normal size and visible
            exit={{ scale: 0.8, opacity: 0 }} // Animate back to smaller and hidden when exiting
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring transition
          >
            {/* Title of the toast */}
            <h2 className="text-lg font-semibold mb-2 text-textPrimary">
              {title}
            </h2>

            {/* Message of the toast */}
            <p className="mb-4 text-sm text-textSecondary">{message}</p>

            {/* Buttons to either confirm or close the toast */}
            <div className="flex justify-end space-x-3">
              <Button severity="secondary" size="small" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onConfirm} size="small">
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationToast;
