import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {
    console.log('Upload complete');
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
