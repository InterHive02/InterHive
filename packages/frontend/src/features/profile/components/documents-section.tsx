import React from 'react';
import { FileText, Download, Trash2, Upload } from 'lucide-react';

interface DocumentsSectionProps {
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    size: number;
  }[];
  onUpload?: (file: File) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onUpload,
  onDelete,
  onDownload,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Documents
        </h3>
        {onUpload && (
          <label className="inline-flex items-center gap-2 text-primary hover:text-primary-dark cursor-pointer text-sm font-medium">
            <Upload className="w-4 h-4" />
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        )}
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(doc.id)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-1 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No documents uploaded yet
          </p>
        )}
      </div>
    </div>
  );
};
