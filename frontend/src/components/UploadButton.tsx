import { useRef, useState } from 'react';
import { uploadImage } from '../api';
import type{ Image } from '../hooks/useImages';

interface Props {
  token: string;
  onUpload: (image: Image) => void;
}

export default function UploadButton({ token, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const image = await uploadImage(file, token);
      onUpload(image);
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        className="upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : '+ Upload'}
      </button>
    </>
  );
}