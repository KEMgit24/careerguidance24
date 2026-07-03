import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simulated API endpoint for fetching news.
// In a real scenario, this would fetch from an RSS feed or external news API.
async function fetchLatestNews() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newArticles = [
    {
      id: `news-${Date.now()}`,
      title: "Nouvelles Bourses d'Études pour les Filières Techniques",
      category: "Bourses",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt: "Le gouvernement lance un nouveau programme de bourses pour encourager les étudiants à s'inscrire dans les filières scientifiques et techniques.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
    }
  ];
  return newArticles;
}

export async function GET(request: Request) {
  try {
    // In production, verify the Authorization header to ensure only your cron service can trigger this.
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the new articles
    const latestNews = await fetchLatestNews();

    // Read the existing news file
    const newsFilePath = path.join(process.cwd(), 'src', 'data', 'news.json');
    let existingNews = [];
    
    if (fs.existsSync(newsFilePath)) {
      const fileData = fs.readFileSync(newsFilePath, 'utf8');
      existingNews = JSON.parse(fileData);
    }

    // Prepend new articles
    const updatedNews = [...latestNews, ...existingNews];

    // Keep only the latest 20 articles to prevent the file from growing indefinitely
    const limitedNews = updatedNews.slice(0, 20);

    // Write back to the file
    // Note: In a production environment (like Vercel), the filesystem is read-only.
    // You should use a database (like Supabase, which is present in the project) instead.
    // This is a file-based demonstration.
    fs.writeFileSync(newsFilePath, JSON.stringify(limitedNews, null, 2), 'utf8');

    return NextResponse.json({ success: true, added: latestNews.length, message: "News updated successfully" });
  } catch (error) {
    console.error("Failed to update news:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
