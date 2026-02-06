import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'notes-app/avatars',
        resource_type: 'image',
        unique_filename: true,
        use_filename: false,
        //public_id: `avatar-${userId}`, //назва мого файлу, яка буде зберігатися в Cloudinary. Вона складається з префікса "avatar-" та унікального ідентифікатора користувача (userId). Це дозволяє легко ідентифікувати та керувати файлами, пов'язаними з конкретними користувачами.
        overwrite: true,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
