import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, AlertCircle } from 'lucide-react';

const ImageUpload = ({
  label,
  onImageSelect,
  onImageRemove,
  imagePreview,
  required = false,
  error = '',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  hint = '',
  className = '',
}) => {
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }

    setUploadError('');

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(file, reader.result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, maxSize]);

  const handleRemove = useCallback(() => {
    onImageRemove();
    setUploadError('');
  }, [onImageRemove]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  }, [handleFileChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-4 ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div
        className={`flex items-center gap-4 ${
          imagePreview ? 'flex-wrap' : ''
        }`}
      >
        {/* Upload Area */}
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500">Upload</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {hint && (
        <p className="text-xs text-gray-500 mt-2">{hint}</p>
      )}

      {(error || uploadError) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {error || uploadError}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ImageUpload;
