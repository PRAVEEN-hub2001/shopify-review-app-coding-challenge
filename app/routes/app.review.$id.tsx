import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, DataTable, Frame, Layout, Page, Text } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import fs from 'fs';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      product(id: "gid://shopify/Product/${params.id}") {
        title
      }
    }`
  );

  const responseData = await response.json();


  const filePath = './app/reviews.json';

  let reviews = {};
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    reviews = JSON.parse(fileContent);
  }

  return { product: responseData?.data?.product, reviews: reviews[params?.id] };
};


export default function ReviewWidget() {
  const { reviews, product } = useLoaderData<typeof loader>();
  reviews?.sort((a: string, b: string) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  const rows = reviews?.map((review: { name: string, rating: number, comment: string }) => {
    let starRating = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= review?.rating) {
        starRating += '★';
      }
      else {
        starRating += '☆';
      }
    }
    return [
      review.name,
      <p style={{ color: 'gold' }}>{starRating}</p>,
      review.comment
    ];
  }) || [];



  return <Frame>
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingMd" alignment="center">{product?.title}</Text>
            <DataTable
              columnContentTypes={['text', 'text', 'text']}
              headings={['Name', 'Rating (1-5)', 'Comment']}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  </Frame>
}

