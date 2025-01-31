import fs from 'fs';
interface Review {
  review: string;
  date: Date;
}

interface ReviewsData {
  [productId: string]: Review[];

}

export async function action({ request }: { request: Request }) {
  try {
    const data = await request.json();

    if (!data?.productId) {
      return { success: false, message: 'Product ID is required' };
    }

    const filePath = './app/reviews.json';

    let existingData: ReviewsData = {};
    let productId = data?.productId;

    delete data?.productId;

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(fileContent);
      }
    } catch (fileReadError) {
      console.error('Error reading file:', fileReadError);
      return { success: false, message: 'Error reading the reviews data file' };
    }

    if (!existingData[productId]) {
      existingData[productId] = [];
    }

    existingData[productId].push({ ...data, date: new Date() });

    try {
      const fileData = JSON.stringify(existingData, null, 2);
      fs.writeFileSync(filePath, fileData);
    } catch (fileWriteError) {
      console.error('Error writing to file:', fileWriteError);
      return { success: false, message: 'Error writing to the reviews data file' };
    }

    return { success: true, message: 'Review successfully added!' };
  } catch (err) {
    console.log(err)
    return { success: false, message: 'Something went wrong!' };
  }
}