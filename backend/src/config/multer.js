import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 1 * 1024 * 1024 // 1MB * 5 files
    }
})