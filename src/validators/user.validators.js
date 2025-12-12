import * as z from "zod";


const emailValidation = z.object({
    email: z
        .email({ message: "Invalid Email" })
        .trim(),
})

const loginUserValidation = emailValidation.extend({

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(12, { message: "Password can not be more than 12 digits" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }
        )
        .trim(),
})
const registerUserValidation = loginUserValidation.extend({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username can not be more than 20 characters" })
        .trim()
        .regex(/^(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, { message: "Username can only contain letters, numbers, underscores, and dots. It cannot start or end with an underscore or dot, nor have consecutive underscores or dots." }),

    fullname: z
        .string()
        .trim()
        .min(1, "Fullname can't be empty"),
})

const resetPasswordValidation = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(12, { message: "Password can not be more than 12 digits" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }
        )
        .trim(),
    confirmPassword: z
        .string()

}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password does not match"
})

const updateUserValidation = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long " })
        .max(20, { message: "Username can not be more than 20 characters" })
        .trim()
        .regex(/^(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, { message: "Username can only contain letters, numbers, underscores, and dots. It cannot start or end with an underscore or dot, nor have consecutive underscores or dots." })
        .optional()
        .or(z.literal("")),
    fullname: z
        .string()
        .trim()
        .min(1, "Fullname can't be empty")
        .optional()
        .or(z.literal("")),

    email: z
        .email("Invalid email format")
        .optional()
        .or(z.literal("")),

})


export {
    emailValidation,
    registerUserValidation,
    loginUserValidation,
    resetPasswordValidation,
    updateUserValidation
}