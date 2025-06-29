// src/app/blog/[slug]/page.tsx

// This is a simplified example. You would fetch the article content
// and the filtered list of shows here.

import ConcertGridRowWrapper from "@/components/concerts/ConcertGridRowWrapper";

// This function would fetch the specific article's content and the shows
async function getArticleData(slug: string) {
  // In a real app, you'd fetch this from an API
  // For now, we can hardcode it for this example
  if (slug === 'cheap-treats-this-week') {
    return {
      headline: 'Shows Under $20 This Week',
      intro: "Looking for a great night out that won't break the bank? We've rounded up the best affordable shows happening in Atlanta this week. Here's what you can't miss...",
      // You would also fetch the actual shows that match this filter here
      shows: [ /* Array of ApiConcert objects */ ]
    };
  }
  return null;
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const articleData = await getArticleData(params.slug);

  if (!articleData) {
    return <div>Article not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-4">{articleData.headline}</h1>
      <p className="text-lg text-neutral-300 mb-8">{articleData.intro}</p>
      
      {/* This is the magic part: embedding your concert list inside the article */}
      <div className="space-y-2">
        {/* You would map over the 'shows' you fetched for this article */}
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