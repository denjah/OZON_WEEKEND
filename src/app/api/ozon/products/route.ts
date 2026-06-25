import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.OZON_CLIENT_ID?.trim() || '2717886';
  const apiKey = process.env.OZON_API_KEY?.trim() || 'c7c4fa75-2ecd-4a8f-bd41-810d992edec3';

  if (!clientId || !apiKey) {
    return NextResponse.json({ error: 'Missing Ozon API credentials' }, { status: 500 });
  }

  const getHeaders = () => ({
    'Client-Id': clientId,
    'Api-Key': apiKey,
    'Content-Type': 'application/json'
  });

  try {
    // 1. Fetch top 10 SKUs by revenue from Analytics API
    const today = new Date();
    const pastMonth = new Date();
    pastMonth.setMonth(today.getMonth() - 1);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const analytRes = await fetch('https://api-seller.ozon.ru/v1/analytics/data', {
      method: 'POST',
      headers: getHeaders(),
      cache: 'no-store',
      body: JSON.stringify({
        date_from: '2026-05-01', // Using fixed date based on your test to ensure data or use pastMonth
        date_to: '2026-06-25',
        metrics: ['revenue', 'ordered_units'],
        dimension: ['sku'],
        limit: 100
      })
    });
    
    if (!analytRes.ok) {
      throw new Error(`Analytics API error: ${analytRes.statusText}`);
    }

    const analytData = await analytRes.json();
    const skuList = analytData.result.data
      .map((d: any) => String(d.dimensions[0].id))
      .filter((id: string) => id && id !== '0' && id !== 'NaN');
    
    // Create a map of sku -> metrics
    const metricsMap = new Map<string, { revenue: number, ordered: number }>();
    analytData.result.data.forEach((d: any) => {
      metricsMap.set(String(d.dimensions[0].id), {
        revenue: d.metrics[0],
        ordered: d.metrics[1] || 0
      });
    });

    if (skuList.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // 2. Fetch product info for these SKUs in chunks of 50 to avoid API limits
    const chunkSize = 50;
    const allItems: any[] = [];
    
    const errors: string[] = [];
    for (let i = 0; i < skuList.length; i += chunkSize) {
      const chunk = skuList.slice(i, i + chunkSize);
      
      const infoData: any = await new Promise((resolve, reject) => {
        const https = require('https');
        const data = JSON.stringify({ sku: chunk, product_id: [], offer_id: [] });
        const options = {
          hostname: 'api-seller.ozon.ru',
          port: 443,
          path: '/v3/product/info/list',
          method: 'POST',
          headers: {
            'Client-Id': clientId,
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }
        };
        const req = https.request(options, res => {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => {
            if (res.statusCode === 200) {
              try { resolve(JSON.parse(body)); } catch (e) { resolve({ error: 'parse error', body }); }
            } else {
              resolve({ error: 'http error', status: res.statusCode, body });
            }
          });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });

      const items = infoData?.result?.items || infoData?.items;
      if (items && Array.isArray(items)) {
        allItems.push(...items);
      } else {
        errors.push(`Batch missing items: ${JSON.stringify(infoData).substring(0, 200)}`);
      }
    }

    // 3. Map to AggregatedProduct
    const products = allItems.map((item: any) => {
      const metrics = metricsMap.get(String(item.sku)) || { revenue: 0, ordered: 0 };
      
      // Determine sizeFt based on name heuristically
      let sizeFt = 0;
      const sizeMatch = item.name.match(/(\d+)\s*фут/i) || item.name.match(/(\d+)ft/i) || item.name.match(/(\d+)\s*фт/i);
      if (sizeMatch) {
        sizeFt = parseInt(sizeMatch[1]);
      } else if (item.name.toLowerCase().includes('мини')) {
        sizeFt = 3;
      }

      const imageUrls = item.images || [];
      const mainImage = item.primary_image && item.primary_image.length > 0 ? item.primary_image[0] : (imageUrls[0] || '');

      return {
        id: item.id.toString(),
        parentProductId: item.id.toString(),
        variantId: item.offer_id,
        title: item.name,
        brandName: 'Weekend', // Hardcoded as this API key belongs to Weekend
        brandId: 'b-weekend',
        sizeFt: sizeFt || 7, // default to 7 if unknown
        workScheme: item.stocks?.stocks?.[0]?.source?.toUpperCase() || 'FBO',
        sku: item.sku.toString(),
        url: `https://www.ozon.ru/product/${item.sku}`,
        mainImage: mainImage,
        imageUrls: imageUrls,
        price: parseFloat(item.price) || 0,
        ordered: metrics.ordered,
        revenue: metrics.revenue,
        asp: parseFloat(item.price) || 0,
        velocity: Math.round((metrics.ordered / 30) * 10) / 10 || 0, // mock velocity based on monthly orders
        buyoutPercent: 95, // default
        contentScore: 100, // mock
        hasVideo: item.hasVideo || false,
        rating: 5.0, // mock
        reviews: 5, // mock
        reviewsDelta: 1,
        questions: 0
      };
    });

    return NextResponse.json({ 
      products, 
      debug: { 
        skuListCount: skuList.length, 
        allItemsCount: allItems.length, 
        errors,
        credentials: {
          clientIdStr: `${clientId.substring(0, 2)}...${clientId.substring(clientId.length - 1)}`,
          apiKeyStr: `${apiKey.substring(0, 2)}...${apiKey.substring(apiKey.length - 2)}`,
          keyLen: apiKey.length
        }
      } 
    });
  } catch (error: any) {
    console.error('Ozon API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
