import { useState, useRef } from 'react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
}

export const ImageUpload = ({ 
  images, 
  onImagesChange, 
  onError,
  maxSizeMB = 5 
}: ImageUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setIsProcessing(true);

    try {
      const base64Promises = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not an image file`));
            return;
          }

          if (file.size > maxSizeMB * 1024 * 1024) {
            reject(new Error(`${file.name} is too large. Maximum size is ${maxSizeMB}MB`));
            return;
          }

          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const base64Strings = await Promise.all(base64Promises);
      onImagesChange([...images, ...base64Strings]);
      
      // Clear the input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process images';
      if (onError) {
        onError(errorMessage);
      }
      // Clear the input even on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
        Game Images <span className="text-gray-500 text-xs">(Multiple images allowed)</span>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        id="images"
        name="images"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        disabled={isProcessing}
        className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6B46C1] file:text-white hover:file:bg-[#7C3AED] file:cursor-pointer disabled:opacity-50"
      />

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((base64String, index) => (
            <div key={index} className="relative group">
              <img
                src={base64String}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-[#2D2D44]"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
