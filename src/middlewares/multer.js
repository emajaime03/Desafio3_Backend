import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {name} = req.body;
        let destinationFolder;
        switch (name) {
            case "profiles", "products", "documents":
                destinationFolder = `src/public/uploads/${name}`;
                break;
            default:
                cb(new Error("Documento no válido"));
        }
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const { uid } = req.params;
        const { name } = req.body;
        let newFilename;
        switch (name) {
            case "profile", "product", "document":
                newFilename = `${uid}-${name}-${file.originalname}`;
                break;
            default:
                cb(new Error("Documento no válido"));
        }
        cb(null, newFilename);
    },
});

export const uploader = multer({ storage });