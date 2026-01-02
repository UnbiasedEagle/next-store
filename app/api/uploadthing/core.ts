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
  variantUploader: f({
    image: { maxFileCount: 10, maxFileSize: '4MB' },
  })
    .onUploadError(async ({ error }) => {
      console.log(error);
    })
    .onUploadComplete(async ({ file }) => {
      console.log(file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
