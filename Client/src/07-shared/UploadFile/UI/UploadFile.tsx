import React from 'react'
import s from './UploadFile.module.css'

export const UploadFile = (props) => {
  return (
    <div className={s.UploadFile}>
      <input
        className={s.FileInput}
        type="file"
        accept='image/*'
        onChange={props.onChange}
      />
      <div className={s.text}> {props.text || (
        <div className="previewContainer">
          <img src={previewURL} alt="File preview" className={s.FilePreview}/>
        </div>
      )}
      </div>
    </div>
  )
}