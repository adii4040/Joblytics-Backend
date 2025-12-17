import Application from '../models/application.model.js'
import User from '../models/user.models.js'

/*-------Import Utilities-----*/
import { asyncHandler } from '../utils/AsyncHandler.utils.js'
import { ApiResponse } from '../utils/ApiResponse.utils.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.utils.js'
import { normalizeSource } from '../utils/normalizeSource.js'


const uploadApplication = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) throw new ApiError(404, 'User not found')

    const {
        companyName,
        role,
        workType,
        workLocationType,
        salaryAmount,
        salaryCurrency,
        applicationStatus,
        location,
        source,
        appliedDate,
        notes
    } = req.body

    //Validation is done in the route using zod

    let jobDescriptionUrl;
    if (req.file) {
        const jobDescriptionLocalPath = req.file?.path;
        if (!jobDescriptionLocalPath) throw new ApiError(400, 'Job description file is missing');

        jobDescriptionUrl = await uploadOnCloudinary(jobDescriptionLocalPath);
        if (!jobDescriptionUrl) throw new ApiError(500, 'Failed to upload job description file');
    }


    const application = await Application.create({
        userId: user?._id,
        companyName,
        role,
        workType,
        workLocationType,
        salary: {
            amount: salaryAmount,
            currency: salaryCurrency || 'INR'
        },
        applicationStatus: applicationStatus || 'Applied',
        location,
        source,
        normalizedSource: normalizeSource(source),
        appliedDate,
        jobDescription: jobDescriptionUrl?.secure_url || null,
        notes
    })

    if (!application) throw new ApiError(500, 'Failed to create application')

    // Update user's total applications count
    await User.findByIdAndUpdate(user._id, { $inc: { totalApplications: 1 } })

    res.status(201).json(
        new ApiResponse(
            201,
            { application },
            'Application created successfully',
        ))
})


const getUsersApplications = asyncHandler(async (req, res) => {
    const user = req.user

    const applications = await Application.find({ userId: user._id }).sort({ createdAt: -1 }) // Sort by appliedDate in descending order

    if (!applications.length) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { applications: [] },
                `No applications found for ${user.fullname}`,
            ))
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { applications },
            'Applications fetched successfully',
        ))
})


const getUsersApplicationsById = asyncHandler(async (req, res) => {
    const user = req.user
    const { applicationId } = req.params

    if (!applicationId) throw new ApiError(400, 'Incorrect application id');

    const application = await Application.findOne({ _id: applicationId, userId: user._id });
    if (application?.userId.toString() !== user._id.toString()) throw new ApiError(403, 'You are not authorized to view this application');

    if (!application) throw new ApiError(404, `No application found for the id ${applicationId}`);

    res.status(200).json(
        new ApiResponse(
            200,
            { application },
            'Application fetched successfully',
        ))

})


const deleteApplication = asyncHandler(async (req, res) => {
    const user = req.user
    const { applicationId } = req.params

    if (!applicationId) throw new ApiError(400, 'Incorrect application id');

    const application = await Application.findOne({ _id: applicationId, userId: user._id });
    if (application?.userId.toString() !== user._id.toString()) throw new ApiError(403, 'You are not authorized to delete this application');

    if (!application) throw new ApiError(404, `No application found for the id ${applicationId}`);

    await Application.deleteOne({ _id: application._id })

    // Update user's total applications count
    await User.findByIdAndUpdate(user._id, { $inc: { totalApplications: -1 } })

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            'Application deleted successfully',
        ))

})


const updateApplication = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) throw new ApiError(404, 'User not found')

    const { applicationId } = req.params
    if (!applicationId) throw new ApiError(400, 'Incorrect application id');

    const {
        companyName,
        role,
        workType,
        workLocationType,
        salaryAmount,
        salaryCurrency,
        applicationStatus,
        location,
        source,
        appliedDate,
        notes
    } = req.body

    const application = await Application.findOne({ _id: applicationId, userId: user._id });
    if (application?.userId.toString() !== user._id.toString()) throw new ApiError(403, 'You are not authorized to update this application');

    if (!application) throw new ApiError(404, `No application found for the id ${applicationId}`);

    application.companyName = companyName || application.companyName
    application.role = role || application.role
    application.workType = workType || application.workType
    application.workLocationType = workLocationType || application.workLocationType
    application.salary.amount = salaryAmount || application.salary.amount
    application.salary.currency = salaryCurrency || application.salary.currency || 'INR'
    application.applicationStatus = applicationStatus || application.applicationStatus || 'Applied'
    application.location = location || application.location
    application.source = source || application.source
    application.appliedDate = appliedDate || application.appliedDate
    application.notes = notes || application.notes

    await application.save({ validateBeforeSave: true })

    res.status(200).json(
        new ApiResponse(
            200,
            { application },
            'Application updated successfully',
        ))

})


const deleteAllApplications = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) throw new ApiError(404, 'User not found')

    const applications = await Application.find({ userId: user._id });
    if (!applications.length) throw new ApiError(404, `No applications found for ${user.fullname}`)

    const deleteResult = await Application.deleteMany({ userId: user._id });
    if (deleteResult.deletedCount === 0) throw new ApiError(500, 'Failed to delete applications');

    // Update user's total applications count to zero
    await User.findByIdAndUpdate(user._id, { totalApplications: 0 })

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            'All applications deleted successfully',
        ))

})

export {
    uploadApplication,
    getUsersApplications,
    getUsersApplicationsById,
    deleteApplication,
    updateApplication,
    deleteAllApplications
}