
export const ApplicationStatusEnum = {
    APPLIED: 'Applied',
    INTERVIEWING: 'Interviewing',
    OFFERED: 'Offered',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn'
}
export const ApplicationStatusArray = Object.values(ApplicationStatusEnum);


export const JobTypeEnum = {
    JOB: 'Job',
    INTERNSHIP: 'Internship'
}
export const JobTypeArray = Object.values(JobTypeEnum);


export const WorkLocationTypeEnum = {
    REMOTE: 'Remote',
    ONSITE: 'On-Site',
    HYBRID: 'Hybrid'
}
export const WorkLocationTypeArray = Object.values(WorkLocationTypeEnum);


export const SalaryCurrencyEnum = {
    USD: 'USD',
    INR: 'INR',
    EUR: 'EUR',
    GBP: 'GBP'
}
export const SalaryCurrencyArray = Object.values(SalaryCurrencyEnum);


export const cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
}