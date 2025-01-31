import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, DataTable, Frame, Layout, Page, Text, Thumbnail } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import fs from 'fs';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
  query {
    products(first: 250) {
      edges {
        node {
          id
          title
          images(first:1){
            edges{
              node{
                url
                altText
              }
            }
          }
        }
      }
    }
  }`,
  );

  const { data } = await response.json();

  const filePath = './app/reviews.json';

  let reviews = {};
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    reviews = JSON.parse(fileContent);
  }

  return { products: data?.products?.edges, reviews };
};

export default function ReviewWidget() {
  const { products, reviews } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const rows = products?.map((product: { node: { id: string; title: string; images: { edges: { node: { url: string } }[] } } }) => {
    const productId = product.node.id.replace(/^gid:\/\/shopify\/Product\//, '');
    const imageUrl = product?.node?.images?.edges?.[0]?.node?.url;
    const reviewCount = reviews[productId]?.length || 0;
    return [
      product.node.title,
      imageUrl ? (
        <Thumbnail source={imageUrl} alt={imageUrl} />
      ) : (
        <div>No image available</div>
      ),
      <Button onClick={() => { navigate(`/app/review/${productId}`) }}>View</Button>,
      reviewCount
    ];
  }) || [];

  return <Frame>
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingMd">Product List</Text>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'numeric']}
              headings={['Product', 'Image', 'Review', 'Count']}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  </Frame>
}

