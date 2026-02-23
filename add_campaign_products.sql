-- Add campaign_id to listings table to link products to campaigns
ALTER TABLE listings ADD COLUMN campaign_id uuid REFERENCES brand_campaigns(id);

-- Create an index for faster queries
CREATE INDEX idx_listings_campaign_id ON listings(campaign_id);

-- Update the listings policy to allow brands to add products to their campaigns
CREATE POLICY "Brands can add products to their campaigns"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (
    campaign_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM brand_campaigns 
      WHERE id = campaign_id AND user_id = auth.uid()
    )
  );
