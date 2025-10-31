-- Create tool_usage table to track children's use of calming tools
CREATE TABLE public.tool_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  duration_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

-- Policies for tool_usage
CREATE POLICY "Users can view their own tool usage"
  ON public.tool_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tool usage"
  ON public.tool_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_tool_usage_user_id ON public.tool_usage(user_id);
CREATE INDEX idx_tool_usage_created_at ON public.tool_usage(created_at DESC);