import { Upload as UploadIcon, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadSectionProps {
  file: File | null;
  uploading: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

export default function UploadSection({ file, uploading, error, onFileChange, onUpload }: UploadSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <UploadIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">TSVファイルアップロード</h2>
          <p className="text-sm text-gray-600">予測結果データをアップロードしてください</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="file"
            accept=".tsv,.txt"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-3 file:px-6
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-gradient-to-r file:from-blue-500 file:to-blue-600
              file:text-white file:cursor-pointer
              file:hover:from-blue-600 file:hover:to-blue-700
              file:transition-all file:duration-300
              hover:file:shadow-lg
              cursor-pointer"
          />
        </div>

        {file && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900">{file.name}</div>
              <div className="text-xs text-blue-600">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <button
          onClick={onUpload}
          disabled={!file || uploading}
          className={cn(
            "w-full py-3 px-6 rounded-lg font-semibold text-white",
            "transition-all duration-300 flex items-center justify-center gap-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !file || uploading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105"
          )}
        >
          <UploadIcon className="w-5 h-5" />
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </div>
    </div>
  );
}
