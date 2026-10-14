import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const TransformAISection: React.FC = () => {
  const cards = [
    {
      id: 'ai-1',
      category: 'BUILDING A BUSINESS',
      title: 'This Breakthrough Technology Is Poised to Accelerate Your Company\'s Growth',
      excerpt: 'Discover a breakthrough technology stacked on top of generative AI, now poised to revolutionize corporate operations.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'ai-2',
      category: 'TECH',
      title: 'The Practical Way Agentic AI is Helping This Growing Beverage Brand Scale Fast',
      excerpt: 'BERO\'s one-person data team used agentic AI to build an automated insights platform that runs their entire logistics.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'ai-3',
      category: 'ENTREPRENEURS',
      title: 'How AI Agents Are Changing the Way We Learn and Execute Strategy',
      excerpt: 'AI agents are opening doors to personalized executive training that just a few years ago would have been unthinkable.',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Header matching Screenshot 4 */}
        <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-tight">
              Transform Your Business with Agentic AI
            </h2>
            <div className="text-xs text-slate-500 font-sans italic pt-1">
              Presented by Sapphire Reserve for Business
            </div>
          </div>

          <Link
            href="/topic/ai"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#1642D0] text-white flex items-center justify-center transition-colors group-hover:bg-blue-800">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/article/${card.id}`}
              className="group flex flex-col space-y-3 cursor-pointer"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                  {card.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug line-clamp-3">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                  {card.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
