import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/profile-images");
    },

    filename(req, file, cb) {

        const extension = path.extname(file.originalname);

        cb(
            null,
            uuid() + extension
        );
    }

});

function fileFilter(req, file, cb) {

    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp"
    ) {

        cb(null, true);

    } else {

        cb(
            new Error("only image files are allowed"),
            false
        );

    }

}

export const uploadProfileImage = multer({

    storage,
    fileFilter,
    limits: {

        fileSize: 5 * 1024 * 1024

    }

});