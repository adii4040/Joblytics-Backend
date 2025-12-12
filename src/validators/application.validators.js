import * as z from "zod";
import { ApplicationStatusArray, JobTypeArray, WorkLocationTypeArray, SalaryCurrencyArray, } from '../utils/constant.js';


const applicationValidation = z.object({
    companyName: z
        .string()
        .min(1, { message: "Company name is required" })
        .trim(),

    role: z
        .string()
        .min(1, { message: "Role is required" })
        .trim(),

    workType: z
        .enum(JobTypeArray, {
            message: `Work type must be one of: ${JobTypeArray.join(', ')}`
        }),

    workLocationType: z
        .enum(WorkLocationTypeArray, {
            message: `Work location type must be one of: ${WorkLocationTypeArray.join(', ')}`
        }),

    salaryAmount: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "Salary amount must be a positive number")
    ),
    salaryCurrency: z
        .enum(SalaryCurrencyArray, {
            message: `Salary currency must be one of: ${SalaryCurrencyArray.join(', ')}`
        }),

    applicationStatus: z
        .enum(ApplicationStatusArray, {
            message: `Status must be one of: ${ApplicationStatusArray.join(', ')}`
        }),

    location: z
        .string()
        .min(1, { message: "Location is required" })
        .trim(),

    source: z
        .string()
        .min(1, { message: "Source is required" })
        .trim(),
    appliedDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Date must be in YYYY-MM-DD format (e.g., 2025-10-16)",
        })
        .refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Use a valid calendar date.",
        })
        .refine(val => new Date(val) <= new Date(), {
            message: "Applied date cannot be in the future.",
        })
        .transform(val => new Date(val)), // ✅ Convert to Date object for Mongoose
    notes: z
        .string()
        .max(500)
        .optional(),
    //Job description will be a pdf file thus cloudinary will be used to upload and store the file
})


const updateApplicationValidation = z.object({
    companyName: z
        .string()
        .min(1, { message: "Company name is required" })
        .trim()
        .optional()
        .or(z.literal("")),
    role: z
        .string()
        .min(1, { message: "Role is required" })
        .trim()
        .optional()
        .or(z.literal("")),
    workType: z
        .enum(JobTypeArray, {
            message: `Work type must be one of: ${JobTypeArray.join(', ')}`
        })
        .optional()
        .or(z.literal("")),
    workLocationType: z
        .enum(WorkLocationTypeArray, {
            message: `Work location type must be one of: ${WorkLocationTypeArray.join(', ')}`
        })
        .optional()
        .or(z.literal("")),
    salaryAmount: z.preprocess(
        (val) => Number(val),
        z.number().min(0, "Salary amount must be a positive number").optional()
    )
    .or(z.literal("")),
    salaryCurrency: z
        .enum(SalaryCurrencyArray, {
            message: `Salary currency must be one of: ${SalaryCurrencyArray.join(', ')}`
        })
        .optional()
        .or(z.literal("")),
    applicationStatus: z
        .enum(ApplicationStatusArray, {
            message: `Status must be one of: ${ApplicationStatusArray.join(', ')}`
        })
        .optional()
        .or(z.literal("")),
    location: z
        .string()
        .min(1, { message: "Location is required" })
        .trim()
        .optional() 
        .or(z.literal("")),
    source: z
        .string()
        .min(1, { message: "Source is required" })
        .trim()
        .optional()
        .or(z.literal("")),
    appliedDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Date must be in YYYY-MM-DD format (e.g., 2025-10-16)",
        })
        .refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Use a valid calendar date.",
        })
        .refine(val => new Date(val) <= new Date(), {
            message: "Applied date cannot be in the future.",
        })
        .transform(val => new Date(val)) // ✅ Convert to Date object for Mongoose
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(500)
        .optional()
        .or(z.literal("")),
})


export {
    applicationValidation,
    updateApplicationValidation
}