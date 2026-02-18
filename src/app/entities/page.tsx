import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Layers, Plus } from "lucide-react";
import { EntityForm } from "@/components/entities/entity-form";
import { EntityActions } from "@/components/entities/entity-actions";
import { AccountForm } from "@/components/accounts/account-form";
import { AccountActions } from "@/components/accounts/account-actions";
import { getAccounts } from "@/lib/actions/accounts";
import { formatDate } from "@/lib/utils/date";
import { UnitForm } from "@/components/units/unit-form";
import { UnitActions } from "@/components/units/unit-actions";
import { EntityUnitForm } from "@/components/units/entity-unit-form";
import { getEntities } from "@/lib/actions/entities";
import { getUnits } from "@/lib/actions/units";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Entities() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const entitiesResult = await getEntities(1);
  const entities = entitiesResult.success ? entitiesResult.data || [] : [];

  // Get units for all entities
  const unitsResult = await getUnits();
  const allUnits = unitsResult.success ? unitsResult.data || [] : [];

  // Group units by entity
  const unitsByEntity = (allUnits || []).reduce(
    (acc, unit) => {
      if (!acc[unit.entity_id]) {
        acc[unit.entity_id] = [];
      }
      acc[unit.entity_id].push(unit);
      return acc;
    },
    {} as Record<number, typeof allUnits>,
  );

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
          <div className="flex gap-2">
            <EntityForm />
            {/* <UnitForm entities={entities} /> */}
          </div>
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
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <strong>Address:</strong>{" "}
                        {entity.address || "No address provided"}
                      </div>
                    </div>
                    <div>
                      <strong>Owner ID:</strong> {entity.owner_id}
                    </div>
                    <div>
                      <strong>Created:</strong> {formatDate(entity.created_at)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <strong>Units:</strong>{" "}
                          {unitsByEntity[entity.id]?.length || 0} unit(s)
                        </div>
                      </div>
                      <EntityUnitForm
                        entity={{
                          id: entity.id,
                          name: entity.name,
                          type: entity.type as "BUSINESS" | "PROPERTY",
                        }}
                      >
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Unit
                        </Button>
                      </EntityUnitForm>
                    </div>
                    {unitsByEntity[entity.id] &&
                      unitsByEntity[entity.id].length > 0 && (
                        <div className="mt-2">
                          <strong>Unit List:</strong>
                          <div className="ml-2 mt-1 space-y-1">
                            {unitsByEntity[entity.id].map(
                              (unit: (typeof allUnits)[number]) => (
                                <div
                                  key={unit.id}
                                  className="flex items-center justify-between text-xs bg-muted px-2 py-1 rounded"
                                >
                                  <div>
                                    {unit.name}
                                    {unit.description && (
                                      <span className="text-muted-foreground">
                                        {" - "}
                                        {unit.description}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    <UnitActions unit={unit} />
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <EntityActions
                      entity={{
                        id: entity.id,
                        name: entity.name,
                        type: entity.type as "BUSINESS" | "PROPERTY",
                        address: entity.address,
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
