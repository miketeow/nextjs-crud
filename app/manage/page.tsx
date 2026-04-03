import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemForm } from "./_components/item-form";

export default function Manage() {
  return (
    <div className="container max-w-5xl mx-auto items-center justify-center mt-5">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">
            Manage Inventory
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage your inventory details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm />
        </CardContent>
      </Card>
    </div>
  );
}
