import multer from 'multer';
import { messages } from '../core/messages';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/')
    },

    filename: function (req: any, file: any, cb: any) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});


export const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error(messages.UNSUPPORTED_FILE_FORMAT), false);
    }
}

// export const imageFilter = (req: any, file: any, cb: any) => {
//     if (file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/png") {

//         cb(null, true);
//     } else {
//         cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
//     }
// }