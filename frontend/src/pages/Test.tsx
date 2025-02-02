"use client";

import { AlertCircle, CheckCircle, Moon, Send, Sun, Upload, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const Test: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleFileSelection = (selectedFile: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(false);
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        handleFileSelection(droppedFile);
      } else {
        setError("Please drop an image file.");
      }
    },
    [previewUrl]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFile(null);
    setError(null);
    setSuccess(false);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      if (data.image) {
        setProcessedImage(`data:image/png;base64,${data.image}`);
        setSuccess(true);
      } else {
        throw new Error("No image data received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during upload");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>File Upload</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? isDarkMode
                  ? "border-blue-400 bg-gray-700"
                  : "border-blue-500 bg-blue-50"
                : isDarkMode
                ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className={`mx-auto mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} size={40} />
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Drag and drop an image here, or click to select
              </p>
              <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Supported formats: JPG or PNG(max 5MB)
              </p>
            </label>
            {file && (
              <button
                type="button"
                onClick={clearFile}
                className={`absolute top-2 right-2 p-1 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                aria-label="Clear file selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {file && (
            <div className="space-y-4">
              <div
                className={`flex items-center justify-between p-2 rounded ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p className={`text-sm truncate ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{file.name}</p>
                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {previewUrl && (
                  <div className={`relative rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Original Image:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageModal(previewUrl)}
                    />
                  </div>
                )}
                {processedImage && (
                  <div className={`relative rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Processed Image:</p>
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageModal(processedImage)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center text-green-500 text-sm">
              <CheckCircle size={16} className="mr-2" />
              File uploaded successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || !file}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isLoading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Upload File
              </>
            )}
          </button>
        </form>
      </div>

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
