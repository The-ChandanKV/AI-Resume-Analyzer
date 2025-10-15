// app/constants/index.ts

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,
                                        AIResponseFormat = "JSON",
                                    }: {
    jobTitle: string;
    jobDescription: string;
    AIResponseFormat?: string;
}): string => {
    return `
You are an expert AI resume reviewer.
Evaluate the candidate's resume for the role of "${jobTitle}".

Here’s the job description:
${jobDescription}

Your task:
1. Assess how well the resume aligns with the role.
2. Identify missing or weak skills.
3. Analyze ATS (Applicant Tracking System) compatibility.
4. Suggest clear, specific improvements.
5. Return your answer strictly in ${AIResponseFormat} format with the following fields:
{
  "matchScore": number, // 0-100
  "summary": string,
  "missingSkills": string[],
  "recommendations": string[]
}
  `.trim();
};
