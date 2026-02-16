-- Add recipient column to transactions table
ALTER TABLE transactions 
ADD COLUMN recipient TEXT;

-- Add index for better performance on recipient queries
CREATE INDEX IF NOT EXISTS idx_transactions_recipient ON transactions(recipient);

-- Update existing transactions to have a default recipient (optional)
-- UPDATE transactions SET recipient = 'General' WHERE recipient IS NULL;
