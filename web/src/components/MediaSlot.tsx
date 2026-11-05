type MediaSlotProps = {
  className: string
  src: string
  alt: string
  video?: boolean
}

export const MediaSlot = ({ className, src, alt, video = false }: MediaSlotProps) => (
  <div className={`media-slot ${className}`}>
    <img className="media-image" src={src} alt={alt} />
    {video && <span className="play-button">▶</span>}
  </div>
)
