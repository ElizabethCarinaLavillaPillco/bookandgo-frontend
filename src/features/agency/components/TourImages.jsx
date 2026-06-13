// src/features/agency/components/TourImages.jsx

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Link, FolderOpen } from 'lucide-react';

const TourImages = ({ formData, updateFormData, errors = {} }) => {
  // Cada imagen puede ser: { type: 'url', value: string } | { type: 'file', value: File, preview: string }
  const [images, setImages] = useState(() => {
    const result = [];
    if (formData.featured_image) {
      if (formData.featured_image instanceof File) {
        result.push({ type: 'file', value: formData.featured_image, preview: URL.createObjectURL(formData.featured_image) });
      } else {
        result.push({ type: 'url', value: formData.featured_image, preview: formData.featured_image });
      }
    }
    (formData.images || []).forEach(img => {
      if (img instanceof File) {
        result.push({ type: 'file', value: img, preview: URL.createObjectURL(img) });
      } else {
        result.push({ type: 'url', value: img, preview: img });
      }
    });
    return result;
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'url'
  const fileInputRef = useRef(null);

  const syncFormData = (updatedImages) => {
    const featured = updatedImages[0]?.value || '';
    const rest = updatedImages.slice(1).map(img => img.value);
    updateFormData({
      featured_image: featured,
      images: rest,
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = 5 - images.length;
    if (remaining <= 0) {
      setUrlError('Máximo 5 imágenes permitidas');
      return;
    }

    const toAdd = files.slice(0, remaining).map(file => ({
      type: 'file',
      value: file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...images, ...toAdd];
    setImages(updated);
    syncFormData(updated);
    // reset input para permitir seleccionar el mismo archivo otra vez
    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (!newImageUrl.trim()) {
      setUrlError('Ingresa una URL válida');
      return;
    }
    if (images.length >= 5) {
      setUrlError('Máximo 5 imágenes permitidas');
      return;
    }
    try {
      new URL(newImageUrl);
    } catch {
      setUrlError('URL inválida');
      return;
    }

    const updated = [...images, { type: 'url', value: newImageUrl.trim(), preview: newImageUrl.trim() }];
    setImages(updated);
    syncFormData(updated);
    setNewImageUrl('');
    setUrlError('');
  };

  const handleRemove = (index) => {
    // Liberar object URL si es archivo local
    if (images[index].type === 'file') {
      URL.revokeObjectURL(images[index].preview);
    }
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    syncFormData(updated);
  };

  const handleSetFeatured = (index) => {
    const reordered = [images[index], ...images.filter((_, i) => i !== index)];
    setImages(reordered);
    syncFormData(reordered);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Imágenes del Tour</h2>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Recomendaciones:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mínimo 3 imágenes, máximo 5</li>
              <li>La primera imagen será la imagen destacada</li>
              <li>Puedes subir archivos desde tu equipo o pegar una URL</li>
              <li>Formatos: JPG, PNG, WEBP — máx. 5 MB por imagen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs: Archivo vs URL */}
      <div>
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="w-4 h-4" />
            URL de imagen
          </button>
        </div>

        {activeTab === 'file' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 5}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-10 h-10 text-gray-400" />
              <div className="text-center">
                <p className="font-semibold text-gray-700">Haz clic para seleccionar imágenes</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP — máx. 5 MB cada una</p>
              </div>
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pegar URL de imagen
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={images.length >= 5}
                className="px-6 py-3 bg-primary text-gray-900 font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Agregar
              </button>
            </div>
            {urlError && <p className="text-sm text-red-600 mt-1">{urlError}</p>}
          </div>
        )}
      </div>

      {/* Validation error from parent */}
      {errors.featured_image && (
        <p className="text-sm text-red-600">{errors.featured_image}</p>
      )}
      {errors.images && (
        <p className="text-sm text-red-600">{errors.images}</p>
      )}

      {/* Grid de imágenes */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-all"
            >
              <img
                src={img.preview}
                alt={`Tour ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x300?text=Error+al+cargar';
                }}
              />

              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  Imagen Principal
                </div>
              )}

              {/* Badge tipo */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
                {img.type === 'file' ? 'Archivo' : 'URL'}
              </div>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetFeatured(index)}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                  >
                    Hacer Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No has agregado imágenes aún</p>
          <p className="text-sm text-gray-400">Agrega al menos 3 imágenes para publicar tu tour</p>
        </div>
      )}

      {/* Contador */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {images.length} de 5 imágenes
          {images.length < 3 && (
            <span className="text-red-600 ml-2">(Mínimo 3 requeridas)</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TourImages;