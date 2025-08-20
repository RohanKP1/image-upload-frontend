import React, { useEffect, useState, useRef } from 'react';
import { getImages, uploadImage } from '../services/api';
import ImageModal from './ImageModal';

const HomePage = ({ token }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getImages(token);
      setImages(Array.isArray(data) ? data : data.images || []);
    } catch (err) {
      setError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [token]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setSelectedCount(files.length);
    setUploading(true);
    setError('');
    try {
      // uploadImage accepts FileList or Array<File>
      await uploadImage(files, token);
      await fetchImages();
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSelectedCount(0);
    } catch (err) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900" id="all-images-heading">All Images</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500" aria-live="polite">{selectedCount > 0 ? `${selectedCount} selected` : ''}</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={uploading}
            multiple
            aria-label="Upload images"
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="inline-flex items-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 px-7 py-2 text-base font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
            disabled={uploading}
            aria-busy={uploading}
            aria-label={uploading ? 'Uploading images' : 'Upload images'}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload Images
              </>
            )}
          </button>
        </div>
      </div>
      {error && <div className="mb-4 rounded-2xl bg-red-50 text-red-700 px-4 py-2" role="alert">{error}</div>}
      {loading ? (
        <p className="text-center text-gray-500" aria-live="polite">Loading...</p>
      ) : images.length === 0 ? (
        <div className="text-center text-gray-400 text-lg py-16" aria-live="polite">No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" aria-labelledby="all-images-heading">
          {images.map((img) => (
            <button
              key={img.id}
              className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => setSelectedImage(img)}
              aria-label={`View image ${img.filename}`}
            >
              <div className="overflow-hidden rounded-t-2xl bg-gray-100 flex items-center justify-center h-52">
                <img
                  src={img.thumbnail_url}
                  alt={img.filename}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="font-semibold text-gray-900 truncate">{img.filename}</div>
                <div className="text-xs text-gray-400 mt-1">{img.uploaded_at && new Date(img.uploaded_at).toLocaleString()}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      {selectedImage && (
        <ImageModal imageUrl={selectedImage.original_url} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default HomePage;