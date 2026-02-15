import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { EntityForm } from "@/components/entities/entity-form";
import { EntityActions } from "@/components/entities/entity-actions";
import { getEntities } from "@/lib/actions/entities";

export default async function Entities() {
  const result = await getEntities(1);
  const entities = result.success ? result.data : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
            <p className="text-muted-foreground">
              Manage your business entities and organizations
            </p>
          </div>
          <EntityForm />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entities && entities.length > 0 ? (
            entities.map((entity) => (
              <Card key={entity.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Building2 className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardTitle>{entity.name}</CardTitle>
                  <CardDescription>{entity.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Type:</strong> {entity.type}
                    </div>
                    <div>
                      <strong>Owner ID:</strong> {entity.owner_id}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(entity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <EntityActions
                      entity={{
                        id: entity.id,
                        name: entity.name,
                        type: entity.type as "BUSINESS" | "PROPERTY",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                No entities found. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
