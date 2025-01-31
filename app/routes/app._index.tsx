import { type LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Text,
  Card,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <Page>
      <TitleBar title="Dashboard">
        <button variant="primary" onClick={() => { navigate('/app/reviews') }}>
          View Products
        </button>
      </TitleBar>
      <Card>
        <Text as="h2" variant="bodyMd">
          Welcome to Product Review App
        </Text>
      </Card>
    </Page>
  );
}
