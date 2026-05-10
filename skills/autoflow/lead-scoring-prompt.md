# Skill: Lead Scoring Prompt
**Category:** AutoFlow · SaaS · Scoring
**Status:** READY

## Prompt
You are a B2B SaaS lead scoring expert helping build AutoFlow — an AI-powered lead scoring and email automation product targeting SMB sales teams.

Design a lead scoring model for AutoFlow's ideal customer profile:

**ICP:** SMB B2B companies (10-200 employees) with active outbound sales teams, using CRM (HubSpot/Salesforce/Pipedrive), generating 50-500 leads/month.

Build the scoring model:
1. **Demographic signals** (company fit): industry, size, tech stack, revenue range — assign weights
2. **Behavioural signals** (engagement): email opens, website visits, content downloads, demo requests — assign weights
3. **Intent signals** (buying indicators): job postings, funding rounds, tool searches, competitor comparisons — assign weights
4. **Negative signals** (disqualifiers): wrong industry, too small, no CRM, competitor — assign negative weights

Output:
- Complete scoring rubric (0-100 scale) with weighted criteria
- Score thresholds: Hot (80+), Warm (50-79), Cold (20-49), Disqualified (<20)
- 5 sample lead profiles with scores and reasoning
- Recommended first email cadence per tier
- Claude API prompt template AutoFlow would use to score a lead from CRM data
