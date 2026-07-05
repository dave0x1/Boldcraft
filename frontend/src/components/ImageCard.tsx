import type{ Image } from '../hooks/useImages';

interface Props {
  image: Image;
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export default function ImageCard({ image, isOwner, onDelete }: Props) {
  const thumbnail = image.variants.find(v => v.name === 'thumbnail');
  const full = image.variants.find(v => v.name === 'full');

  return (
    <div className="image-card">
      <a href={full?.url} target="_blank" rel="noopener noreferrer">
        <img
          src={thumbnail?.url}
          alt={image.title ?? image.filename}
          loading="lazy"
        />
      </a>
      <div className="image-card__info">
        {image.title && <p className="image-card__title">{image.title}</p>}
        {image.category && (
          <span className="image-card__category">{image.category}</span>
        )}
      </div>
      {isOwner && (
        <button
          className="image-card__delete"
          onClick={() => onDelete(image.id)}
          aria-label="Delete image"
        >
          ✕
        </button>
      )}
    </div>
  );
}