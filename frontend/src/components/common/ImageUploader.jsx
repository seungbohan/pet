import { useState, useRef } from 'react';
import { uploadImages, removeFile, getImageUrl } from '../../api/upload';

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const res = await uploadImages(files);
      onChange([...images, ...res.data]);
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (idx) => {
    const img = images[idx];
    try {
      await removeFile(img.fileName || img.imageURL);
    } catch {}
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-pet-gray">
            <img
              src={img.thumbnailURL || getImageUrl(img.fileName)}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-pet-peach text-pet-brown rounded-xl text-sm font-medium hover:bg-pet-orange hover:text-white transition-colors"
      >
        {uploading ? '업로드 중...' : '📷 사진 추가'}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
