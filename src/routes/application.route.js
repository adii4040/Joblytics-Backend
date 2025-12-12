import Router from 'express';
import { uploadApplication, getUsersApplications, getUsersApplicationsById, deleteApplication, updateApplication, deleteAllApplications } from '../controllers/application.controllers.js';


// Middleware
import { validate, validationSource, validateObjectId } from '../middlewares/validate.middleware.js'
import uploadJobDescription from '../middlewares/multer.config/application.multer.middleware.js'
import verifyJWT from '../middlewares/auth.middlewares.js'

// Validators
import { applicationValidation, updateApplicationValidation } from '../validators/application.validators.js'

const router = Router()

router.route('/upload').post(
    verifyJWT,
    uploadJobDescription.single("jobDescription"),
    validate(applicationValidation, validationSource.BODY),
    uploadApplication
)

router.route('/get').get(
    verifyJWT,
    getUsersApplications
)

router.route('/get/:applicationId').get(
    verifyJWT,
    validateObjectId("applicationId"),
    getUsersApplicationsById
)

router.route('/delete/:applicationId').delete(
    verifyJWT,
    validateObjectId("applicationId"),
    deleteApplication
)

router.route('/update/:applicationId').put(
    verifyJWT,
    validateObjectId("applicationId"),
    validate(updateApplicationValidation, validationSource.BODY),
    updateApplication
)

router.route('/delete-all').delete(
    verifyJWT,
    deleteAllApplications
)

export default router