import { useState, useEffect, useCallback, startTransition } from 'react';
import { fetchImages } from '../api';

export interface ImageVariant {
  name: string;
  url: string;
  publicId: string;
}

export interface Image {
  id: string;
  filename: string;
  title: string | null;
  description: string | null;
  category: string | null;
  tags: string[];
  uploadedAt: string;
  variants: ImageVariant[];
}

export interface Meta {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
        const data = await fetchImages(p);
        startTransition(() => {
        setImages(data.data);
        setMeta(data.meta);
        setPage(p);
        });
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
        setLoading(false);
    }
}, []);

  useEffect(() => { load(1); }, [load]);

  return { images, meta, page, loading, error, load, setImages };
}