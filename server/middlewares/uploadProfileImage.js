import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const uploadDirectory = fileURLToPath(new URL("../uploads/profile-images/", import.meta.url));
mkdirSync(uploadDirectory, { recursive: true });
const extensions = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDirectory);
    },

    filename(req, file, cb) {

        const extension = extensions[file.mimetype];

        cb(
            null,
            randomUUID() + extension
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

        cb(Object.assign(new Error("only image files are allowed"), { status: 400 }), false);

    }

}

export const uploadProfileImage = multer({

    storage,
    fileFilter,
    limits: {

        fileSize: 5 * 1024 * 1024

    }

});