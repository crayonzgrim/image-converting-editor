import { create } from "zustand";
import {
  type ImageFile,
  type FilterSettings,
  type ClientOutputFormat,
  type ServerOutputFormat,
  DEFAULT_FILTER_SETTINGS,
  MAX_IMAGES,
  generateImageId,
  getFormatFromExtension,
  needsServerProcessing,
} from "@/types/image";

interface EditorState {
  // Image state
  images: ImageFile[];
  currentIndex: number;

  // UI state
  isProcessing: boolean;
  processingProgress: number;

  // Actions
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  removeAllImages: () => void;
  setCurrentIndex: (index: number) => void;
  nextImage: () => void;
  prevImage: () => void;

  // Per-image settings actions
  setImageOutputFormat: (id: string, format: ClientOutputFormat | ServerOutputFormat) => void;
  setImageFilterSettings: (id: string, settings: Partial<FilterSettings>) => void;
  resetImageFilters: (id: string) => void;
  setImageQuality: (id: string, quality: number) => void;

  // Current image convenience actions
  setCurrentOutputFormat: (format: ClientOutputFormat | ServerOutputFormat) => void;
  setCurrentFilterSettings: (settings: Partial<FilterSettings>) => void;
  resetCurrentFilters: () => void;
  setCurrentQuality: (quality: number) => void;

  // Processing actions
  setProcessing: (isProcessing: boolean) => void;
  setProcessingProgress: (progress: number) => void;
  updateImageProcessedUrl: (id: string, url: string | null) => void;
  updateImageError: (id: string, error: string | null) => void;
  setImageProcessing: (id: string, isProcessing: boolean) => void;

  // Getters
  getCurrentImage: () => ImageFile | null;
  hasImages: () => boolean;
  canAddMoreImages: () => boolean;
  getRemainingSlots: () => number;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  images: [],
  currentIndex: 0,
  isProcessing: false,
  processingProgress: 0,

  // Image actions
  addImages: (files: File[]) => {
    const { images } = get();
    const remainingSlots = MAX_IMAGES - images.length;

    // Limit files to remaining slots
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: ImageFile[] = filesToAdd.map((file) => {
      const format = getFormatFromExtension(file.name);
      return {
        id: generateImageId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        format,
        originalUrl: URL.createObjectURL(file),
        processedUrl: null,
        needsServerProcessing: needsServerProcessing(format),
        isProcessing: false,
        error: null,
        // Individual settings with defaults
        outputFormat: "png",
        filterSettings: { ...DEFAULT_FILTER_SETTINGS },
        quality: 90,
      };
    });

    set((state) => ({
      images: [...state.images, ...newImages],
    }));
  },

  removeImage: (id: string) => {
    set((state) => {
      const imageToRemove = state.images.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.originalUrl);
        if (imageToRemove.processedUrl) {
          URL.revokeObjectURL(imageToRemove.processedUrl);
        }
      }

      const newImages = state.images.filter((img) => img.id !== id);
      const newIndex = Math.min(
        state.currentIndex,
        Math.max(0, newImages.length - 1)
      );

      return {
        images: newImages,
        currentIndex: newIndex,
      };
    });
  },

  removeAllImages: () => {
    const { images } = get();
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.processedUrl) {
        URL.revokeObjectURL(img.processedUrl);
      }
    });

    set({
      images: [],
      currentIndex: 0,
    });
  },

  setCurrentIndex: (index: number) => {
    const { images } = get();
    if (index >= 0 && index < images.length) {
      set({ currentIndex: index });
    }
  },

  nextImage: () => {
    const { currentIndex, images } = get();
    if (currentIndex < images.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevImage: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  // Per-image settings actions
  setImageOutputFormat: (id, format) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, outputFormat: format } : img
      ),
    }));
  },

  setImageFilterSettings: (id, settings) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, filterSettings: { ...img.filterSettings, ...settings } }
          : img
      ),
    }));
  },

  resetImageFilters: (id) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, filterSettings: { ...DEFAULT_FILTER_SETTINGS } }
          : img
      ),
    }));
  },

  setImageQuality: (id, quality) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, quality: Math.max(1, Math.min(100, quality)) }
          : img
      ),
    }));
  },

  // Current image convenience actions
  setCurrentOutputFormat: (format) => {
    const currentImage = get().getCurrentImage();
    if (currentImage) {
      get().setImageOutputFormat(currentImage.id, format);
    }
  },

  setCurrentFilterSettings: (settings) => {
    const currentImage = get().getCurrentImage();
    if (currentImage) {
      get().setImageFilterSettings(currentImage.id, settings);
    }
  },

  resetCurrentFilters: () => {
    const currentImage = get().getCurrentImage();
    if (currentImage) {
      get().resetImageFilters(currentImage.id);
    }
  },

  setCurrentQuality: (quality) => {
    const currentImage = get().getCurrentImage();
    if (currentImage) {
      get().setImageQuality(currentImage.id, quality);
    }
  },

  // Processing actions
  setProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  setProcessingProgress: (progress) => {
    set({ processingProgress: progress });
  },

  updateImageProcessedUrl: (id, url) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              processedUrl: url,
              isProcessing: false,
              error: null,
            }
          : img
      ),
    }));
  },

  updateImageError: (id, error) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              error,
              isProcessing: false,
            }
          : img
      ),
    }));
  },

  setImageProcessing: (id, isProcessing) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              isProcessing,
            }
          : img
      ),
    }));
  },

  // Getters
  getCurrentImage: () => {
    const { images, currentIndex } = get();
    return images[currentIndex] ?? null;
  },

  hasImages: () => {
    return get().images.length > 0;
  },

  canAddMoreImages: () => {
    return get().images.length < MAX_IMAGES;
  },

  getRemainingSlots: () => {
    return MAX_IMAGES - get().images.length;
  },
}));
