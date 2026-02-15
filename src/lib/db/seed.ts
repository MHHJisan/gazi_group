import { db } from "./index";
import { entities, transactions } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Create sample entities
  const [entity1] = await db
    .insert(entities)
    .values({
      name: "Gazi Group Inc.",
      type: "BUSINESS",
      ownerId: 1,
    })
    .returning();

  const [entity2] = await db
    .insert(entities)
    .values({
      name: "Gazi Property Holdings",
      type: "PROPERTY",
      ownerId: 1,
    })
    .returning();

  // Create sample transactions
  await db.insert(transactions).values([
    {
      entityId: entity1.id,
      amount: "100000.00",
      type: "INCOME",
      category: "Investment",
      date: new Date(),
      description: "Initial capital injection",
    },
    {
      entityId: entity1.id,
      amount: "5000.00",
      type: "EXPENSE",
      category: "Operations",
      date: new Date(),
      description: "Monthly operating expenses",
    },
    {
      entityId: entity2.id,
      amount: "50000.00",
      type: "INCOME",
      category: "Property Revenue",
      date: new Date(),
      description: "Rental income",
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
