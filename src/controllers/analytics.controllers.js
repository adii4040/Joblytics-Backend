import { asyncHandler } from '../utils/AsyncHandler.utils.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { ApiResponse } from '../utils/ApiResponse.utils.js'
import getStartDateForRange from '../utils/DateRange.utils.js'


import Application from '../models/application.model.js'
import mongoose from 'mongoose'




const analyticOverview = asyncHandler(async (req, res) => {

    const userObjId = new mongoose.Types.ObjectId(req.user._id)

    const allowedRanges = ['1m', '3m', '6m', '1y']

    //If no range provided or invalid, default to all time , with no date filtering

    const range = allowedRanges.includes(req.query.range) ? req.query.range : null;

    const initialDate = getStartDateForRange(range);

    // const aggregationPipeline = [
    //     {
    //         $match: {
    //             userId: userObjId,
    //             appliedDate: {
    //                 $gte: initialDate,
    //                 $lte: new Date()
    //             }
    //         }
    //     },

    //     // Group by applicationStatus
    //     {
    //         $group: {
    //             _id: "$applicationStatus",
    //             applicationCount: { $sum: 1 }
    //         }
    //     },

    //     // Normalize structure so we can carry status forward
    //     {
    //         $project: {
    //             status: "$_id",
    //             applicationCount: 1,
    //             _id: 0
    //         }
    //     },

    //     // Global aggregation
    //     {
    //         $group: {
    //             _id: null,
    //             totalApplications: { $sum: "$applicationCount" },

    //             acceptedCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["$status", "Accepted"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //             offeredCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["$status", "Offered"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //             interviewingCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["$status", "Interviewing"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //             appliedCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["status", "Applied"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //             withdrawnCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["$status", "Withdrawn"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //             rejectedCount: {
    //                 $sum: {
    //                     $cond: [
    //                         { $eq: ["$status", "Rejected"] },
    //                         "$applicationCount",
    //                         0
    //                     ]
    //                 }
    //             },

    //         },
    //     },

    //     // Final computed metrics
    //     {
    //         $project: {
    //             _id: 0,
    //             total_Applications: "$totalApplications",
    //             accepted_Applications: "$acceptedCount",
    //             offered_Applications: "$offeredCount",
    //             interviewing_Applications: "$interviewingCount",
    //             applied_Applications: "$appliedCount",
    //             withdrawn_Applications: "$withdrawnCount",
    //             rejected_Applications: "$rejectedCount",



    //             //1. Success Rate (Acceptance Rate)
    //             success_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$totalApplications", 0] },
    //                             0,
    //                             { $divide: ["$acceptedCount", "$totalApplications"] }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             },

    //             //2. Performance Rate
    //             performance_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$totalApplications", 0] },
    //                             0,
    //                             {
    //                                 $divide: [
    //                                     { $add: ["$acceptedCount", "$offeredCount"] },
    //                                     "$totalApplications"
    //                                 ]
    //                             }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             },

    //             //3. Applied -> Interview Conversion
    //             applied_to_interview_conversion_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$appliedCount", 0] },
    //                             0,
    //                             { $divide: ["$interviewingCount", "$appliedCount"] }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             },

    //             //4. Interview → Offer Conversion
    //             interview_to_offer_conversion_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$interviewingCount", 0] },
    //                             0,
    //                             { $divide: ["$offeredCount", "$interviewingCount"] }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             },

    //             //5. Offer Acceptance Rate

    //             offer_acceptance_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$offeredCount", 0] },
    //                             0,
    //                             { $divide: ["$acceptedCount", "$offeredCount"] }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             },

    //             //6. Rejection Rate
    //             rejection_rate: {
    //                 $multiply: [
    //                     {
    //                         $cond: [
    //                             { $eq: ["$totalApplications", 0] },
    //                             0,
    //                             { $divide: ["$rejectedCount", "$totalApplications"] }
    //                         ]
    //                     },
    //                     100
    //                 ]
    //             }
    //         }
    //     }
    // ];


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
                workLocationMetrics: [
                    { $group: { _id: "$workLocationType", count: { $sum: 1 } } }
                ],
                jobTypeMetrics: [
                    { $group: { _id: "$workType", count: { $sum: 1 } } }
                ],
                timelineMetrics: [
                    { $group: { _id: { $month: "$appliedDate" }, count: { $sum: 1 } } }
                ],
                sourceMetrics: [
                    {
                        $group: {
                            _id: "$source",
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
                            }
                        }
                    },
                    { $sort: { total: -1 } }
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
                },

                //CATEGORY 2 — Work Location Metrics
                workLocationObj: {
                    $cond: [
                        { $gt: [{ $size: '$workLocationMetrics' }, 0] },
                        {
                            $arrayToObject: {
                                $map: {
                                    input: '$workLocationMetrics',
                                    in: { k: '$$this._id', v: '$$this.count' }
                                }
                            }
                        },
                        {}
                    ]
                },

                //CATEGORY 3 — Job Type Metrics
                jobTypeObj: {
                    $cond: [
                        { $gt: [{ $size: "$jobTypeMetrics" }, 0] },
                        {
                            $arrayToObject: {
                                $map: {
                                    input: "$jobTypeMetrics",
                                    in: { k: "$$this._id", v: "$$this.count" }
                                }
                            }
                        },
                        {}
                    ]
                },


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

                /*-----------Work Location Type Metrics Fields------------*/
                remoteJobs: { $ifNull: ["$workLocationObj.Remote", 0] },
                hybridJobs: { $ifNull: ["$workLocationObj.Hybrid", 0] },
                onSiteJobs: { $ifNull: ["$workLocationObj.On-Site", 0] },


                /*----------Job Type Metrics Fields---------*/
                Jobs: { $ifNull: ["$jobTypeObj.Job", 0] },
                Internships: { $ifNull: ["$jobTypeObj.Internship", 0] },


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
                }


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
                remoteJobs: 1,
                hybridJobs: 1,
                onSiteJobs: 1,
                Jobs: 1,
                Internships: 1,

                // metrics (all safe: we check zero denominators)
                status_rates: {
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

                workLocationType_rates: {
                    remotePercentage: {
                        $multiply: [
                            {
                                $cond: [
                                    { $gt: ["$totalApplications", 0] },
                                    { $divide: ["$remoteJobs", "$totalApplications"] },
                                    0
                                ]
                            },
                            100
                        ]
                    },

                    hybridPercentage: {
                        $multiply: [
                            {
                                $cond: [
                                    { $gt: ["$totalApplications", 0] },
                                    { $divide: ["$hybridJobs", "$totalApplications"] },
                                    0
                                ]
                            },
                            100
                        ]
                    },

                    onSitePercentage: {
                        $multiply: [
                            {
                                $cond: [
                                    { $gt: ["$totalApplications", 0] },
                                    { $divide: ["$onSiteJobs", "$totalApplications"] },
                                    0
                                ]
                            },
                            100
                        ]
                    }
                },

                jobType_rates: {
                    jobPercentage: {
                        $multiply: [
                            {
                                $cond: [
                                    { $gt: ["$totalApplications", 0] },
                                    { $divide: ["$Jobs", "$totalApplications"] },
                                    0
                                ]
                            },
                            100
                        ]
                    },

                    internshipPercentage: {
                        $multiply: [
                            {
                                $cond: [
                                    { $gt: ["$totalApplications", 0] },
                                    { $divide: ["$Internships", "$totalApplications"] },
                                    0
                                ]
                            },
                            100
                        ]
                    }
                },

                sources: 1

            }
        }
    ];


    const result = await Application.aggregate(aggregationPipeline)

    console.log(result[0])

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
                    status_rates: {
                        success_rate: 0,
                        performance_rate: 0,
                        applied_to_interview_conversion: 0,
                        interview_to_offer_conversion: 0,
                        offer_acceptance_rate: 0,
                        rejection_rate: 0
                    }
                }
            },
            "Analytics overview fetched successfully",
        )
    )

})


export {
    analyticOverview
}


