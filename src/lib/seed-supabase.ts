import {
  supabase,
  insertEntity,
  insertTransaction,
} from "@/lib/supabase-client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

async function seed() {
  console.log("Seeding Supabase database...");

  try {
    // Create sample entities
    const entity1 = await insertEntity({
      name: "Gazi Group Inc.",
      type: "BUSINESS",
      owner_id: 1,
    });
    console.log("✓ Created entity:", entity1.name);

    const entity2 = await insertEntity({
      name: "Gazi Property Holdings",
      type: "PROPERTY",
      owner_id: 1,
    });
    console.log("✓ Created entity:", entity2.name);

    // Create sample transactions
    await insertTransaction({
      entity_id: entity1.id,
      amount: "100000.00",
      type: "INCOME",
      category: "Investment",
      date: new Date().toISOString(),
      description: "Initial capital injection",
    });
    console.log("✓ Created transaction for", entity1.name);

    await insertTransaction({
      entity_id: entity1.id,
      amount: "5000.00",
      type: "EXPENSE",
      category: "Operations",
      date: new Date().toISOString(),
      description: "Monthly operating expenses",
    });
    console.log("✓ Created transaction for", entity1.name);

    await insertTransaction({
      entity_id: entity2.id,
      amount: "50000.00",
      type: "INCOME",
      category: "Property Revenue",
      date: new Date().toISOString(),
      description: "Rental income",
    });
    console.log("✓ Created transaction for", entity2.name);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

// Run the seed
seed();
