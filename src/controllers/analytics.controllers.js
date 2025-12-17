import { asyncHandler } from '../utils/AsyncHandler.utils.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { ApiResponse } from '../utils/ApiResponse.utils.js'
import getStartDateForRange from '../utils/DateRange.utils.js'
import { getPerformanceReport, getSuccessRateReport, getAppliedToInterviewReport, getInterviewToOfferReport, getOfferAcceptanceReport, getRejectionRateReport, getWorkTypeReport, getWorkLocationReport, getSourceReport } from '../utils/AnalyticsReports.utils.js'

import Application from '../models/application.model.js'
import mongoose from 'mongoose'




const analyticOverview = asyncHandler(async (req, res) => {

    const userObjId = new mongoose.Types.ObjectId(req.user._id)

    const allowedRanges = ['1m', '3m', '6m', '1y']

    //If no range provided or invalid, default to all time , with no date filtering

    const range = allowedRanges.includes(req.query.range) ? req.query.range : null;

    const initialDate = getStartDateForRange(range);


    const aggregationPipeline = [
        // 1) filter by user and date range
        {
            $match: {
                userId: userObjId,
                appliedDate: { $gte: initialDate, $lte: new Date() }
            }
        },

        // 2) compute raw grouped arrays via facet
        {
            $facet: {
                statusMetrics: [
                    { $group: { _id: "$applicationStatus", count: { $sum: 1 } } }
                ],
                timelineMetrics: [
                    { $group: { _id: { $month: "$appliedDate" }, count: { $sum: 1 } } }
                ],
                sourceMetrics: [
                    {
                        $group: {
                            _id: "$normalizedSource",
                            total: { $sum: 1 },

                            offered: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Offered"] }, 1, 0] }
                            },
                            accepted: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Accepted"] }, 1, 0] }
                            },
                            rejected: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Rejected"] }, 1, 0] }
                            },
                            interviewing: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Interviewing"] }, 1, 0] }
                            },
                            applied: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Applied"] }, 1, 0] }
                            },
                        }
                    },
                    { $sort: { total: -1 } }
                ],

                workTypeMetrics: [
                    {
                        $group: {
                            _id: '$workType',
                            total: { $sum: 1 },
                            offered: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Offered"] }, 1, 0] }
                            },
                            accepted: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Accepted"] }, 1, 0] }
                            },
                            rejected: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Rejected"] }, 1, 0] }
                            },
                            interviewing: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Interviewing"] }, 1, 0] }
                            },
                            applied: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Applied"] }, 1, 0] }
                            },

                        }
                    }
                ],

                workLocationMetrics: [
                    {
                        $group: {
                            _id: '$workLocationType',
                            total: { $sum: 1 },
                            offered: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Offered"] }, 1, 0] }
                            },
                            accepted: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Accepted"] }, 1, 0] }
                            },
                            rejected: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Rejected"] }, 1, 0] }
                            },
                            interviewing: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Interviewing"] }, 1, 0] }
                            },
                            applied: {
                                $sum: { $cond: [{ $eq: ["$applicationStatus", "Applied"] }, 1, 0] }
                            },

                        }
                    }
                ]

            }
        },

        // 3) turn statusMetrics array into an object for easier access later 
        {
            $addFields: {

                //CATEGORY 1 — Status-Based Metrics (CORE)
                statusObj: {
                    $cond: [
                        { $gt: [{ $size: "$statusMetrics" }, 0] },
                        {
                            $arrayToObject: {
                                $map: {
                                    input: "$statusMetrics",
                                    as: "s",
                                    in: { k: "$$s._id", v: "$$s.count" }
                                }
                            }
                        },
                        {} // empty object if no statuses
                    ]
                }
            }
        },

        // 4) materialize numeric totals WITH fallbacks so later math never sees undefined
        {
            $addFields: {
                totalApplications: { $sum: "$statusMetrics.count" },           // array sum (works even if array empty -> returns 0)

                /*---------Status Metrics Fields----------*/
                applied: { $ifNull: ["$statusObj.Applied", 0] },
                interviewing: { $ifNull: ["$statusObj.Interviewing", 0] },
                offered: { $ifNull: ["$statusObj.Offered", 0] },
                accepted: { $ifNull: ["$statusObj.Accepted", 0] },
                rejected: { $ifNull: ["$statusObj.Rejected", 0] },
                withdrawn: { $ifNull: ["$statusObj.Withdrawn", 0] },


                /*----------Source Metrics with all the required status rates Calculations---------*/
                sources: {
                    $map: {
                        input: "$sourceMetrics",
                        in: {
                            source: "$$this._id",
                            total: "$$this.total",
                            accepted: "$$this.accepted",
                            offered: "$$this.offered",
                            interviewing: "$$this.interviewing",
                            rejected: "$$this.rejected",
                            applied: "$$this.applied",

                            successRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.offered", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            interviewRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.interviewing", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerAcceptanceRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.offered", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.offered"] }
                                        ]
                                    },
                                    100
                                ]
                            },


                        }
                    }
                },


                /*----------Work Type Metrics with all the required status rates Calculations---------*/
                workType: {
                    $map: {
                        input: "$workTypeMetrics",
                        in: {
                            workType: "$$this._id",
                            total: "$$this.total",
                            accepted: "$$this.accepted",
                            offered: "$$this.offered",
                            interviewing: "$$this.interviewing",
                            rejected: "$$this.rejected",
                            applied: "$$this.applied",

                            workTypePercentage: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: [{ $sum: "$statusMetrics.count" }, 0] },
                                            0,
                                            { $divide: ["$$this.total", { $sum: "$statusMetrics.count" }] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            successRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.offered", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            interviewRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.interviewing", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerAcceptanceRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.offered", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.offered"] }
                                        ]
                                    },
                                    100
                                ]
                            }
                        }
                    }
                },


                /*----------Work Location Type Metrics with all the required status rates Calculations---------*/
                workLocationType: {
                    $map: {
                        input: "$workLocationMetrics",
                        in: {
                            workLocationType: "$$this._id",
                            total: "$$this.total",
                            accepted: "$$this.accepted",
                            offered: "$$this.offered",
                            interviewing: "$$this.interviewing",
                            rejected: "$$this.rejected",
                            applied: "$$this.applied",
                            workLocationTypePercentage: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: [{ $sum: "$statusMetrics.count" }, 0] },
                                            0,
                                            { $divide: ["$$this.total", { $sum: "$statusMetrics.count" }] }
                                        ]
                                    },
                                    100
                                ]
                            },
                            successRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.offered", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            interviewRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.total", 0] },
                                            0,
                                            { $divide: ["$$this.interviewing", "$$this.total"] }
                                        ]
                                    },
                                    100
                                ]
                            },

                            offerAcceptanceRate: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$$this.offered", 0] },
                                            0,
                                            { $divide: ["$$this.accepted", "$$this.offered"] }
                                        ]
                                    },
                                    100
                                ]
                            }
                        }
                    }
                },


            }
        },

        // 5) compute metrics using the safe numeric fields
        {
            $project: {
                _id: 0,

                // raw counts
                totalApplications: 1,
                applied: 1,
                interviewing: 1,
                offered: 1,
                accepted: 1,
                rejected: 1,
                withdrawn: 1,
                overall_status_rates: {
                    success_rate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$totalApplications", 0] },
                                    0,
                                    { $divide: ["$accepted", "$totalApplications"] }
                                ]
                            },
                            100
                        ]
                    },

                    performance_rate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$totalApplications", 0] },
                                    0,
                                    {
                                        $divide: [
                                            { $add: ["$accepted", "$offered"] },
                                            "$totalApplications"
                                        ]
                                    }
                                ]
                            },
                            100
                        ]
                    },

                    applied_to_interview_conversion: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$applied", 0] },
                                    0,
                                    { $divide: ["$interviewing", "$applied"] }
                                ]
                            },
                            100
                        ]
                    },

                    interview_to_offer_conversion: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$interviewing", 0] },
                                    0,
                                    { $divide: ["$offered", "$interviewing"] }
                                ]
                            },
                            100
                        ]
                    },

                    offer_acceptance_rate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$offered", 0] },
                                    0,
                                    { $divide: ["$accepted", "$offered"] }
                                ]
                            },
                            100
                        ]
                    },

                    rejection_rate: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: ["$applied", 0] },
                                    0,
                                    { $divide: ["$rejected", "$applied"] }
                                ]
                            },
                            100
                        ]
                    }
                },

                // workLocationType_rates: {
                //     remotePercentage: {
                //         $multiply: [
                //             {
                //                 $cond: [
                //                     { $gt: ["$totalApplications", 0] },
                //                     { $divide: ["$remoteJobs", "$totalApplications"] },
                //                     0
                //                 ]
                //             },
                //             100
                //         ]
                //     },

                //     hybridPercentage: {
                //         $multiply: [
                //             {
                //                 $cond: [
                //                     { $gt: ["$totalApplications", 0] },
                //                     { $divide: ["$hybridJobs", "$totalApplications"] },
                //                     0
                //                 ]
                //             },
                //             100
                //         ]
                //     },

                //     onSitePercentage: {
                //         $multiply: [
                //             {
                //                 $cond: [
                //                     { $gt: ["$totalApplications", 0] },
                //                     { $divide: ["$onSiteJobs", "$totalApplications"] },
                //                     0
                //                 ]
                //             },
                //             100
                //         ]
                //     }
                // },

                // jobType_rates: {
                //     jobPercentage: {
                //         $multiply: [
                //             {
                //                 $cond: [
                //                     { $gt: ["$totalApplications", 0] },
                //                     { $divide: ["$Jobs", "$totalApplications"] },
                //                     0
                //                 ]
                //             },
                //             100
                //         ]
                //     },

                //     internshipPercentage: {
                //         $multiply: [
                //             {
                //                 $cond: [
                //                     { $gt: ["$totalApplications", 0] },
                //                     { $divide: ["$Internships", "$totalApplications"] },
                //                     0
                //                 ]
                //             },
                //             100
                //         ]
                //     }
                // },

                sources: 1,
                workType: 1,
                workLocationType: 1

            }
        }
    ];


    const result = await Application.aggregate(aggregationPipeline)

    //console.log(result[0])
    const performanceReport = getPerformanceReport(result[0]?.overall_status_rates.performance_rate || 0);
    const successRateReport = getSuccessRateReport(result[0]?.overall_status_rates.success_rate || 0);
    const appliedToInterviewReport = getAppliedToInterviewReport(result[0]?.overall_status_rates.applied_to_interview_conversion || 0);
    const interviewToOfferReport = getInterviewToOfferReport(result[0]?.overall_status_rates.interview_to_offer_conversion || 0);
    const offerAcceptanceReport = getOfferAcceptanceReport(result[0]?.overall_status_rates.offer_acceptance_rate || 0);
    const rejectionRateReport = getRejectionRateReport(result[0]?.overall_status_rates.rejection_rate || 0);
    const workTypeReport = getWorkTypeReport(result[0]?.workType || []);
    const workLocationReport = getWorkLocationReport(result[0]?.workLocationType || []);
    const sourceReport = getSourceReport(result[0]?.sources || []);

    return res.json(
        new ApiResponse(
            200,
            {
                userId: userObjId,
                overview: result[0] || {
                    totalApplications: 0,
                    applied: 0,
                    interviewing: 0,
                    offered: 0,
                    accepted: 0,
                    rejected: 0,
                    withdrawn: 0,
                    overall_status_rates: {
                        success_rate: 0,
                        performance_rate: 0,
                        applied_to_interview_conversion: 0,
                        interview_to_offer_conversion: 0,
                        offer_acceptance_rate: 0,
                        rejection_rate: 0
                    }
                },
                report: {
                    overall_status_report: {
                        performanceReport,
                        successRateReport,
                        appliedToInterviewReport,
                        interviewToOfferReport,
                        offerAcceptanceReport,
                        rejectionRateReport
                    },
                    workTypeReport,
                    workLocationReport,
                    sourceReport
                },
            },
            "Analytics overview fetched successfully",
        )

    )

})


export {
    analyticOverview
}


