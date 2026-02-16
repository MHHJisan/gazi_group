-- Add account_id column to transactions table
ALTER TABLE transactions 
ADD COLUMN account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL;

-- Add index for better performance on account_id queries
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);

-- Add index for better performance on account_id queries
CREATE INDEX IF NOT EXISTS idx_transactions_account_entity ON transactions(account_id, entity_id);
