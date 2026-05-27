import React from 'react';
import { FiUpload, FiUser } from 'react-icons/fi';

interface DealerAvatarUploadProps {
  image: string;
  onImageChange: (value: string) => void;
}

export const DealerAvatarUpload: React.FC<DealerAvatarUploadProps> = ({ image, onImageChange }) => {
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-dealer-avatar-field">
      <div className="admin-dealer-avatar-preview" aria-live="polite">
        {image ? <img src={image} alt="Dealer avatar preview" /> : <FiUser aria-hidden="true" />}
      </div>
      <label className="admin-dealer-avatar-upload btn btn-outline btn-round btn-sm" htmlFor="dealer-avatar-upload">
        <FiUpload aria-hidden="true" />
        <span>Upload Avatar</span>
      </label>
      <input
        id="dealer-avatar-upload"
        className="admin-dealer-avatar-input"
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
    </div>
  );
};
