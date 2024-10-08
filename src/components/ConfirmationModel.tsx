import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const ConfirmationToast: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-8 bottom-8 z-50 p-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Toast content */}
          <motion.div
            className="dark:bg-[#1f1e1e6e] bg-[#ffffffc2] rounded-lg shadow-lg max-w-sm p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-lg font-semibold mb-2 text-textPrimary">
              {title}
            </h2>
            <p className="mb-4 text-sm text-textSecondary">{message}</p>

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
