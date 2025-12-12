import multer from 'multer'
import { ApiError } from '../../utils/ApiError.utils.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const jobDescriptionFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('application/pdf')) {
        cb(null, true)
    } else {
        cb(new ApiError(401, "Job description must be a PDF file."))
    }
}

const uploadJobDescription = multer({
    storage: storage,
    fileFilter: jobDescriptionFilter,
    limits: { fileSize: 20 * 1024 * 1024 } //20Mb limit
})


export default uploadJobDescription