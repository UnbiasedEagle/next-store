import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db";
import { Sales } from "./sales";
import Earnings from "./earnings";

const AnalyticsPage = async () => {
  const totalOrders = await db.query.orderProducts.findMany({
    with: {
      order: {
        with: {
          user: true,
        },
      },
      product: true,
      productVariant: {
        with: {
          variantImages: true,
        },
      },
    },
  });

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8 ">
        <Sales totalOrders={totalOrders} />
        <Earnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
