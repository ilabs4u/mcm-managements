'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { uploadImageAction } from '@/app/actions/upload';

export default function ImageUpload({ bucket = 'uploads', pathPrefix = 'misc', currentImage, onUpload, onError }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${pathPrefix}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageAction(bucket, filePath, formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      
      if (onUpload) {
        onUpload(result.url);
      }
    } catch (error) {
      if (onError) onError(error.message);
      else alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
      {currentImage && (
        <img
          src={currentImage}
          alt="Preview"
          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
        />
      )}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button
          variant="secondary"
          type="button"
          disabled={uploading}
          style={{ pointerEvents: 'none' }} // Button is just visual, the input overlays it
        >
          {uploading ? 'Uploading...' : currentImage ? 'Change Image' : 'Upload Image'}
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
}
