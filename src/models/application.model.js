import mongoose from 'mongoose';
import { ApplicationStatusArray, ApplicationStatusEnum, JobTypeArray, WorkLocationTypeArray, SalaryCurrencyArray, SalaryCurrencyEnum } from '../utils/constant.js';


const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    workType: {
        type: String,
        enum: JobTypeArray,
        required: true,
        trim: true
    },
    workLocationType: {
        type: String,
        enum: WorkLocationTypeArray,
        required: true,
    },
    salary: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            enum: SalaryCurrencyArray,
            default: SalaryCurrencyEnum.INR,
            trim: true
        }
    },
    applicationStatus: {
        type: String,
        enum: ApplicationStatusArray,
        default: ApplicationStatusEnum.APPLIED,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String, // e.g., LinkedIn, Company Website
        required: true,
        trim: true
    },
    normalizedSource: {
        type: String,
        default: "Unknown"
    },

    appliedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    jobDescription: {
        type: String // PDF link (Cloudinary)
    },
    notes: {
        type: String,
        trim: true
    },
}, { timestamps: true });


const Application = mongoose.model('Application', applicationSchema);

export default Application;
