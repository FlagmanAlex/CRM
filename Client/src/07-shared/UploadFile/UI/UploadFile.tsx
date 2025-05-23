import s from './UploadFile.module.css'

interface IUploadFileProps {
    text: string
    onChange: () => void
    prevUrl: string
}

export const UploadFile = ({ text, onChange }: IUploadFileProps) => {
  return (
    <div className={s.UploadFile}>
      <input
        className={s.FileInput}
        type="file"
        accept='image/*'
        onChange={onChange}
      />
      <div className={s.text}> {text || (
        <div className="previewContainer">
          <img src={previewURL} alt="File preview" className={s.FilePreview}/>
        </div>
      )}
      </div>
    </div>
  )
}