function getPerformanceReport(performanceRate) {
    let category = "";
    let feedback = "";

    switch (true) {

        case (performanceRate <= 10):
            category = "Very Low Performance";
            feedback =
                "Your performance rate is extremely low, meaning very few applications are converting into interviews or offers. This is usually a sign that your resume or application targeting needs major improvement. Try applying to better-matched roles and refining your resume for each application.";
            break;

        case (performanceRate <= 25):
            category = "Low Performance";
            feedback =
                "Your performance rate is on the lower side. Some applications are moving forward, but not consistently. Improve your resume tailoring, focus on relevant skills, and apply more strategically to suitable positions.";
            break;

        case (performanceRate <= 40):
            category = "Average Performance";
            feedback =
                "You’re performing at an average level. You're doing something right, but there's still noticeable room for improvement. Work on strengthening your resume, improving skill alignment, and preparing better for initial screenings.";
            break;

        case (performanceRate <= 60):
            category = "Good Performance";
            feedback =
                "Good job! Your applications are converting at a healthy rate. You're on the right path. With small improvements in targeting and preparation, you can reach even higher levels.";
            break;

        case (performanceRate <= 80):
            category = "Great Performance";
            feedback =
                "Your performance is great. A significant portion of your applications are leading to interviews or offers. This indicates strong targeting and effective presentation. Keep this momentum going!";
            break;

        default:
            category = "Excellent Performance";
            feedback =
                "Outstanding work! Your performance rate is excellent. Almost every application is turning into an opportunity. Your targeting, resume, and preparation strategy are clearly working extremely well.";
            break;
    }

    return { category, feedback };
}

function getSuccessRateReport(successRate) {
    let category = "";
    let feedback = "";

    switch (true) {

        case (successRate <= 10):
            category = "Very Low Success";
            feedback =
                "Only a very small portion of your applications are turning into final acceptances. This suggests issues with role targeting, interview performance, or skill alignment. A serious review of your approach is needed.";
            break;

        case (successRate <= 25):
            category = "Low Success";
            feedback =
                "Your success rate is low. While some applications convert, most do not reach final acceptance. Improving interview preparation and applying more selectively could significantly help.";
            break;

        case (successRate <= 40):
            category = "Average Success";
            feedback =
                "Your success rate is average. You are doing reasonably well, but many opportunities are still slipping through. With better preparation and refinement, this can improve further.";
            break;

        case (successRate <= 60):
            category = "Good Success";
            feedback =
                "Good job! A healthy portion of your applications result in acceptances. This indicates strong job matching and decent interview performance. Keep refining your strategy.";
            break;

        case (successRate <= 80):
            category = "Great Success";
            feedback =
                "You are performing very well. Most of your applications are converting into acceptances, which shows excellent targeting and strong interviews. Stay consistent.";
            break;

        default:
            category = "Excellent Success";
            feedback =
                "Outstanding performance! Your success rate is exceptionally high. You are applying to the right roles and performing extremely well in interviews. Maintain this momentum.";
            break;
    }

    return { category, feedback };
}

function getAppliedToInterviewReport(conversionRate) {
    let category = "";
    let feedback = "";

    switch (true) {

        case (conversionRate <= 10):
            category = "Very Poor Resume Performance";
            feedback =
                "Very few applications convert into interviews. This strongly indicates resume or ATS issues. Your resume likely lacks keyword alignment or is not tailored to roles.";
            break;

        case (conversionRate <= 25):
            category = "Low Resume Performance";
            feedback =
                "Interview conversion is low. Your resume passes occasionally but struggles overall. Better role targeting and resume customization are needed.";
            break;

        case (conversionRate <= 40):
            category = "Average Resume Performance";
            feedback =
                "Your resume performs at an average level. It works for some roles but fails for others. Fine-tuning keywords and achievements will improve results.";
            break;

        case (conversionRate <= 60):
            category = "Good Resume Performance";
            feedback =
                "Good interview conversion. Your resume is generally effective and aligns well with most roles you apply for.";
            break;

        case (conversionRate <= 80):
            category = "Strong Resume Performance";
            feedback =
                "Strong performance. Your resume consistently attracts interviews, indicating solid ATS optimization and role targeting.";
            break;

        default:
            category = "Excellent Resume Performance";
            feedback =
                "Excellent! Nearly every application results in an interview. Your resume is highly optimized and well-aligned with your target roles.";
            break;
    }

    return { category, feedback };
}


function getInterviewToOfferReport(conversionRate) {
    let category = "";
    let feedback = "";

    switch (true) {

        case (conversionRate <= 10):
            category = "Very Poor Interview Performance";
            feedback =
                "Most interviews are not converting into offers. This suggests major gaps in interview preparation, communication, or problem-solving. Focus on structured interview practice and feedback.";
            break;

        case (conversionRate <= 25):
            category = "Weak Interview Performance";
            feedback =
                "Your interview-to-offer conversion is low. You are clearing initial stages but struggling to close offers. Improving interview structure, confidence, and clarity will help.";
            break;

        case (conversionRate <= 40):
            category = "Average Interview Performance";
            feedback =
                "Your interview performance is average. Some interviews convert into offers, but many don’t. With focused preparation and mock interviews, this can improve significantly.";
            break;

        case (conversionRate <= 60):
            category = "Good Interview Performance";
            feedback =
                "Good work! A healthy number of interviews are converting into offers. Your interview skills are solid, with room for refinement.";
            break;

        case (conversionRate <= 80):
            category = "Strong Interview Performance";
            feedback =
                "Strong interview skills. You convert most interviews into offers, showing clear communication and strong problem-solving abilities.";
            break;

        default:
            category = "Excellent Interview Performance";
            feedback =
                "Excellent performance! Nearly every interview results in an offer. You demonstrate outstanding interview skills. Maintain this level of preparation and execution.";
            break;
    }

    return { category, feedback };
}

function getOfferAcceptanceReport(acceptanceRate) {
    let category = "";
    let feedback = "";

    switch (true) {

        case (acceptanceRate <= 10):
            category = "Very Poor Offer Acceptance";
            feedback =
                "Most offers are being rejected. This suggests a major mismatch between your expectations and the offers you receive. Re-evaluate role criteria, compensation range, and company preferences.";
            break;

        case (acceptanceRate <= 25):
            category = "Low Offer Acceptance";
            feedback =
                "You receive offers but accept very few. This indicates unclear expectations or poor alignment with roles applied for. Clarifying priorities will help improve outcomes.";
            break;

        case (acceptanceRate <= 40):
            category = "Average Offer Acceptance";
            feedback =
                "Your offer acceptance rate is average. Some offers align well, others don’t. Better role filtering and early salary discussions can improve this.";
            break;

        case (acceptanceRate <= 60):
            category = "Good Offer Acceptance";
            feedback =
                "Good balance. Most offers you receive meet your expectations. Your role selection and decision-making are reasonably aligned.";
            break;

        case (acceptanceRate <= 80):
            category = "Strong Offer Acceptance";
            feedback =
                "Strong acceptance rate. You typically receive offers that match your expectations, showing clear role targeting and good judgment.";
            break;

        default:
            category = "Excellent Offer Acceptance";
            feedback =
                "Excellent! Nearly every offer you receive is accepted. This indicates excellent alignment between your goals and the roles you pursue.";
            break;
    }

    return { category, feedback };
}

function getRejectionRateReport(rejectionRate) {
    switch (true) {
        case rejectionRate <= 10:
            return {
                category: "Excellent Targeting",
                feedback:
                    "Very low rejection rate. Most of your applications pass the initial screening, indicating excellent role targeting and a strong resume."
            };

        case rejectionRate <= 25:
            return {
                category: "Strong Targeting",
                feedback:
                    "Your rejection rate is low, suggesting good alignment between your profile and the roles you apply for. Minor refinements could improve results further."
            };

        case rejectionRate <= 40:
            return {
                category: "Average Targeting",
                feedback:
                    "A noticeable portion of applications are being rejected early. Improving resume customization and role selection can help reduce this."
            };

        case rejectionRate <= 60:
            return {
                category: "Weak Targeting",
                feedback:
                    "Many applications are rejected during initial screening. Focus on better role fit and tailoring your resume more precisely."
            };

        case rejectionRate <= 80:
            return {
                category: "Poor Targeting",
                feedback:
                    "High rejection rate indicates poor job targeting or resume mismatch. A focused application strategy is needed."
            };

        default:
            return {
                category: "Very Poor Targeting",
                feedback:
                    "Almost all applications are rejected early. This suggests a major mismatch between your profile and the roles applied for. A complete strategy reset is recommended."
            };
    }
}





export { 
    getPerformanceReport,
    getSuccessRateReport,
    getAppliedToInterviewReport,
    getInterviewToOfferReport,
    getOfferAcceptanceReport,
    getRejectionRateReport

 };