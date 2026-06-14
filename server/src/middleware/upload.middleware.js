import multer from "multer";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isPdf = file.mimetype === "application/pdf";

    if (!isImage && !isVideo && !isPdf) {
      cb(new Error("Only image, pdf and video only accepted"));
    }

    cb(null, true)
  },
});
