import multer from 'multer';
import path from 'path';
import fs from 'fs';

const publicFolderPath = 'C:\\Hariom Nathani\\Swapnil goverment project\\Swapnil-Project-main\\server\\public';

const createDirIfNotExist = (dir) => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (error) {
        console.error('Error creating directory:', error);
        throw error; // Rethrow the error to handle it at a higher level
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        switch (file.fieldname) {
            case 'Image':
                folder = 'photo';
                break;
            case 'Degree':
                folder = 'Degree';
                break;
            case 'IdProof':
                folder = 'IdProof';
                break;
            default:
                folder = 'misc';
        }
        const dir = path.join(publicFolderPath, folder);
        createDirIfNotExist(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const folderName = file.fieldname === 'Image' ? 'photo' : (file.fieldname === 'Degree' ? 'Degree' : (file.fieldname === 'IdProof' ? 'IdProof' : 'misc'));
        const ext = path.extname(file.originalname);
        const fileName = `${req.regNo}_${folderName}${ext}`;
        cb(null, fileName);
    }
});


const upload = multer({ storage: storage });

export const uploadFiles = upload.fields([
    { name: 'Image', maxCount: 1 },
    { name: 'Degree', maxCount: 1 },
    { name: 'IdProof', maxCount: 1 }
]);


export default uploadFiles;
