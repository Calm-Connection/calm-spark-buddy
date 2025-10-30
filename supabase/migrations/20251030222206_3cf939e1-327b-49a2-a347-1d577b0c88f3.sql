-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule notification checks every 15 minutes
SELECT cron.schedule(
  'send-scheduled-notifications',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://adlftnqdeltcbdqgibsr.supabase.co/functions/v1/send-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbGZ0bnFkZWx0Y2JkcWdpYnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Mjg0NDcsImV4cCI6MjA3NjUwNDQ0N30.1ygSD3YUXWX9cX7WYNRXYzNg-S1BRE7M8CcQ9tsTtnw"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);