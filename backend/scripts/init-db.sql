-- Initialize Global Ads Launch Database
-- This script runs when the PostgreSQL container starts

-- Create database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable)

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
-- (These will be created by Prisma migrations, but we can add some here)

-- Set timezone
SET timezone = 'UTC';

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Global Ads Launch database initialized successfully';
END $$;




