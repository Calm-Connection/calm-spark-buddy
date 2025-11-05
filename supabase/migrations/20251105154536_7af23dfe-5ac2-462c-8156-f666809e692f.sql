-- Add parent_summary column to wendy_insights table for carer-focused summaries
ALTER TABLE wendy_insights 
ADD COLUMN parent_summary TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN wendy_insights.parent_summary IS 'Carer-focused summary in 3rd person with actionable support tips';