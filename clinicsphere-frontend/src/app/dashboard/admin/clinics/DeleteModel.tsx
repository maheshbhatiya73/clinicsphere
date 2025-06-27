import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface DeleteModelProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  clinicName: string;
}

const DeleteModel: React.FC<DeleteModelProps> = ({ isOpen, onClose, onDelete, clinicName }) => {
  const handleDelete = async () => {
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-white p-6 rounded-lg w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sky-600">Delete Clinic</h2>
          <FaTimes className="text-sky-600 cursor-pointer" onClick={onClose} />
        </div>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete <span className="font-semibold">{clinicName}</span>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sky-600 border border-sky-300 rounded hover:bg-sky-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModel;