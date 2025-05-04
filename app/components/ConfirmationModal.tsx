interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="px-4 py-5">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
