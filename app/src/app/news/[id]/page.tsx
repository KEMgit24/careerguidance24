"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import newsData from "@/data/news.json";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  sourceUrl: string;
  content: string[];
}

export default function NewsArticlePage() {
  const router = useRouter();
  // Unwrap params with React.use() as recommended by Next.js 15+
  // But since we use simple params extraction in older Next versions, we'll use useParams directly.
  const params = useParams();
  const id = params.id as string;
  
  const [article, setArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const found = newsData.find((n) => n.id === id);
      if (found) {
        setArticle(found as NewsItem);
      } else {
        router.push("/");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [id, router]);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="mt-4 text-sm text-muted-foreground">Chargement de l'article...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Navbar Minimaliste */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link href="/#actualites" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Retour aux actualités
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-12 animate-fade-in-up">
        {/* En-tête de l'article */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground">{article.date}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-4">
            {article.excerpt}
          </p>
        </div>

        {/* Image principale */}
        <div className="h-[400px] w-full overflow-hidden rounded-2xl mb-12 shadow-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
        </div>

        {/* Contenu */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Source de l'article */}
        <div className="mt-16 rounded-xl border border-border bg-muted p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Cet article a été compilé à partir d'informations vérifiées. Vous souhaitez en savoir plus sur ce sujet ?
          </p>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover shadow-lg hover:shadow-xl"
          >
            Lire la source originale
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
}
