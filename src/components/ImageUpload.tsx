import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#8A7060',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: 'none',
    background: active ? '#F88435' : '#EDE8E3',
    color: active ? '#fff' : '#8A7060',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
  });

  const isDataUrl = value && value.startsWith('data:');
  const isHttpUrl = value && (value.startsWith('http://') || value.startsWith('https://'));
  const hasPreview = isDataUrl || isHttpUrl;

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button type="button" onClick={() => setMode('upload')} style={toggleBtn(mode === 'upload')}>
          📁 Upload from Device
        </button>
        <button type="button" onClick={() => setMode('url')} style={toggleBtn(mode === 'url')}>
          🔗 Paste URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
            style={{
              border: `2px dashed ${dragging ? '#F88435' : '#EDE8E3'}`,
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? '#FFF0E6' : '#FFF8F3',
              transition: 'all 0.2s',
            }}
          >
            {hasPreview ? (
              <div>
                <img
                  src={value}
                  alt="Preview"
                  style={{ maxHeight: '120px', borderRadius: '8px', marginBottom: '8px', objectFit: 'cover' }}
                />
                <p style={{ color: '#22C55E', fontWeight: 600, margin: 0, fontSize: '0.85rem' }}>
                  ✅ Image ready! Click to change.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📸</div>
                <p style={{ color: '#8A7060', margin: '0 0 4px', fontWeight: 600 }}>
                  Click to upload or drag &amp; drop
                </p>
                <p style={{ color: '#aaa', margin: 0, fontSize: '0.8rem' }}>JPG, PNG, WEBP up to 10MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '2px solid #EDE8E3',
              background: '#FFF8F3',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {isHttpUrl && (
            <img
              src={value}
              alt="Preview"
              style={{ marginTop: '8px', maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
