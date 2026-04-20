import { ArticleCardV, SectionHeader } from './shared';

export default function ArticleGrid4({ title, icon, href, articles, color }) {
  return (
    <section className="py-8 border-b border-[#1a1a28]">
      <SectionHeader title={title} icon={icon} href={href} color={color} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {articles.map(a => (
          <ArticleCardV key={a.id} article={a} accentColor={color} />
        ))}
      </div>
    </section>
  );
}
