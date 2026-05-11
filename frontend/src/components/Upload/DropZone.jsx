import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileWarning, Image, FileText } from 'lucide-react';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = {
  'image/jpeg':      ['.jpg', '.jpeg'],
  'image/png':       ['.png'],
  'application/pdf': ['.pdf'],
};

export default function DropZone({ onFile, onFiles, disabled = false, multiple = false }) {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept:   ACCEPT,
    maxFiles: multiple ? 10 : 1,
    maxSize:  MAX_SIZE,
    multiple,
    disabled,
    onDrop: (accepted) => {
      if (accepted.length === 0) return;
      if (multiple && onFiles) { onFiles(accepted); }
      else if (onFile && accepted[0]) { onFile(accepted[0]); }
      else if (onFiles) { onFiles(accepted); }
    },
  });

  const rejection = fileRejections[0];
  const rejectionMessage = rejection
    ? rejection.errors[0]?.code === 'file-too-large'
      ? t('upload.errorSize')
      : rejection.errors[0]?.code === 'too-many-files'
      ? 'Maximal 10 Dateien gleichzeitig.'
      : t('upload.errorType')
    : null;

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all duration-200 cursor-pointer select-none
          ${isDragActive
            ? 'border-primary-500 bg-primary-500/10 shadow-glow'
            : 'border-border bg-card/30 hover:border-primary-500/60 hover:bg-card/60 hover:shadow-inner-glow'}
          ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-200
          ${isDragActive ? 'border-primary-500/50 bg-primary-500/20 text-primary-300' : 'border-border bg-card-2 text-primary-400'}`}>
          <UploadCloud className="h-8 w-8" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-100">
            {isDragActive ? t('upload.dropzoneActive') : t('upload.dropzone')}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            {t('upload.hint')}{multiple ? ' · bis zu 10 Dateien' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><Image className="h-3.5 w-3.5" /> JPG / PNG</span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> PDF</span>
        </div>
      </div>

      {rejectionMessage && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger animate-fade-in">
          <FileWarning className="h-4 w-4 flex-shrink-0" />{rejectionMessage}
        </div>
      )}
    </div>
  );
}
