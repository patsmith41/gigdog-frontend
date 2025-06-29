// src/app/blog/[slug]/page.tsx

// This is a simplified example. You would fetch the article content
// and the filtered list of shows here.
import ConcertGridRowWrapper from "@/components/concerts/ConcertGridRowWrapper";

async function getArticleData(slug: string) {
  if (slug === 'cheap-treats-this-week') {
    return {
      headline: 'Shows Under $20 This Week',
      intro: "Looking for a great night out that won't break the bank? We've rounded up the best affordable shows happening in Atlanta this week. Here's what you can't miss...",
      shows: []
    };
  }
  return null;
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articleData = await getArticleData(params.slug);

  if (!articleData) {
    return <div>Article not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-4">{articleData.headline}</h1>
      <p className="text-lg text-neutral-300 mb-8">{articleData.intro}</p>
      
      <div className="space-y-2">
        {/* 
        {articleData.shows.map(concert => (
          <ConcertGridRowWrapper key={concert.show_id} concert={concert} ... />
        ))}
        */}
        <p className="text-neutral-500">(Filtered concert list will go here)</p>
      </div>
    </main>
  );
}
