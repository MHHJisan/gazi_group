-- Create accounts table for financial accounts management
CREATE TABLE IF NOT EXISTS accounts (
  id serial PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL, -- CHECKING, SAVINGS, CREDIT, etc.
  account_number text,
  bank_name text,
  balance decimal(15,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(type);
CREATE INDEX IF NOT EXISTS idx_accounts_active ON accounts(is_active);

-- Add sample data
INSERT INTO accounts (name, type, bank_name, account_number, balance, currency, description)
VALUES 
  ('Main Business Account', 'CHECKING', 'Chase Bank', '1234', 75000.00, 'USD', 'Primary business checking account'),
  ('Savings Account', 'SAVINGS', 'Bank of America', '5678', 35000.00, 'USD', 'Business savings reserve'),
  ('Emergency Fund', 'SAVINGS', 'Wells Fargo', '9012', 15000.00, 'USD', 'Emergency business fund')
ON CONFLICT DO NOTHING;
