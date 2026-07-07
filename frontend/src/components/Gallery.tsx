import { useImages } from '../hooks/useImages';
import ImageCard from './ImageCard';
import { deleteImage } from '../api';
import type{ Image } from '../hooks/useImages';
import UploadButton from './UploadButton';
import './gallery.css'

interface Props {
  isOwner: boolean;
  token: string | null;
}

export default function Gallery({ isOwner, token }: Props) {
  const { images, meta, page, loading, error, load, setImages } = useImages();

  function handleUpload(image: Image) {
    setImages(prev => [image, ...prev]);
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm('Delete this image?')) return;
    try {
      await deleteImage(id, token);
      setImages((prev: Image[]) => prev.filter((img: Image) => img.id !== id));
    } catch (err) {
      alert('Failed to delete image');
      console.log(err);
      
    }
  }

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div>
      {isOwner && token && (
        <div className="gallery__toolbar">
          <UploadButton token={token} onUpload={handleUpload} />
        </div>
      )}
      {images.length === 0
        ? <p className="status">No images yet.</p>
        : <div className="gallery">
            {images.map(image => (
              <ImageCard
                key={image.id}
                image={image}
                isOwner={isOwner}
                onDelete={handleDelete}
              />
            ))}
          </div>
      }
      {meta && meta.totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => load(page - 1)} disabled={!meta.hasPrevPage}>← Prev</button>
          <span>{page} / {meta.totalPages}</span>
          <button onClick={() => load(page + 1)} disabled={!meta.hasNextPage}>Next →</button>
        </div>
      )}
    </div>
  );
}