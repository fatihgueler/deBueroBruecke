import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileWarning } from 'lucide-react';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export default function DropZone({ onFile, disabled = false }) {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: ACCEPT,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    disabled,
    onDrop: (accepted) => {
      if (accepted[0]) onFile(accepted[0]);
    },
  });

  const rejection = fileRejections[0];
  const rejectionMessage = rejection
    ? rejection.errors[0]?.code === 'file-too-large'
      ? t('upload.errorSize')
      : t('upload.errorType')
    : null;

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-slate-700 bg-card hover:border-primary-500/70 hover:bg-slate-800/50'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 text-primary-500" />
        <p className="text-base font-medium text-slate-100">
          {isDragActive ? t('upload.dropzoneActive') : t('upload.dropzone')}
        </p>
        <p className="text-sm text-slate-500">{t('upload.hint')}</p>
      </div>

      {rejectionMessage ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
          <FileWarning className="h-4 w-4" />
          {rejectionMessage}
        </div>
      ) : null}
    </div>
  );
}
