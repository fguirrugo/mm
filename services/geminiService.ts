import { GoogleGenAI } from "@google/genai";
import { Activity, BudgetLine, Beneficiary, ComplianceItem } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateExecutiveReport = async (
    activities: Activity[],
    budget: BudgetLine[],
    beneficiaries: Beneficiary[],
    compliance: ComplianceItem[]
): Promise<string> => {
    try {
        const client = getClient();
        
        const completedActivities = activities.filter(a => a.status === 'Completed').length;
        const totalActivities = activities.length;
        const totalSpent = budget.reduce((sum, line) => sum + line.cadEquivalent, 0);
        const totalBeneficiaries = beneficiaries.length;
        const delayedCompliance = compliance.filter(c => c.status === 'Delayed').map(c => c.item).join(', ');

        const prompt = `
        Act as a Monitoring and Evaluation Specialist for the project "Integrating Local Peacebuilders: A GIS Platform for Inclusive Security in Mozambique (CFLI-2025-MPUTO-MZ-0001)".
        
        Generate a professional, concise Executive Summary for a donor report to the Government of Canada (CFLI).
        
        Data Overview:
        - Activities Completed: ${completedActivities}/${totalActivities}
        - Total CAD Spent so far (Approx): $${totalSpent.toLocaleString()}
        - Total Beneficiaries Registered: ${totalBeneficiaries}
        - Compliance Alerts: ${delayedCompliance ? `The following items are delayed: ${delayedCompliance}` : 'All compliance items are on track.'}

        Structure the response with these Markdown headers:
        ## Executive Summary
        ## Key Achievements
        ## Financial Highlights
        ## Challenges & Mitigations
        
        Tone: Institutional, objective, and authoritative. Avoid flowery language.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "No report generated.";
    } catch (error) {
        console.error("Error generating report:", error);
        return "## Error\nUnable to generate report at this time. Please check your API key configuration.";
    }
};
