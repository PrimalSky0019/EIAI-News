import Parser from 'rss-parser';

const parser = new Parser();

// The Economic Times provides different RSS feeds for different topics
const NEWS_SOURCES = [
    {
        name: "Economic Times - Markets",
        url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        category: "Markets"
    },
    {
        name: "Economic Times - Tech",
        url: "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
        category: "Technology"
    }
];

export async function fetchLiveNews(limitPerSource = 3) {
    const liveArticles = [];

    for (const source of NEWS_SOURCES) {
        try {
            const feed = await parser.parseURL(source.url);
            
            // Take only the top X articles from each feed
            const topItems = feed.items.slice(0, limitPerSource);
            
            for (const item of topItems) {
                liveArticles.push({
                    title: item.title || 'Untitled',
                    // The content snippet is usually in contentSnippet or description
                    raw_text: item.contentSnippet || item.content || "No description available.",
                    source_url: item.link || '',
                    category: source.category,
                    published_at: item.pubDate || new Date().toISOString()
                });
            }
        } catch (error) {
            console.error(`Failed to fetch from ${source.name}:`, error);
        }
    }

    return liveArticles;
}