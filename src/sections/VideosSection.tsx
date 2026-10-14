import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const VideosSection: React.FC = () => {
  const videos = [
    {
      id: 'vid-1',
      title: 'This Founder Changed How People Book Restaurants. He Says Food Entrepreneurs Have Never Had a Better Shot — If They Get This Right',
      excerpt: 'The founder behind Eater and Resy says restaurants have unprecedented digital tools available.',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'vid-2',
      title: "A Photo of a Croissant Got 1.6 Million Views and Filled Their Restaurant for Four Months. Here's the Simple Strategy Behind It.",
      excerpt: 'One photo of a croissant changed everything for this artisanal bakery in central London.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'vid-3',
      title: 'He Asked His Instagram Followers One Simple Question. The Response Led to a Business Partnership That Now Has 13 Locations.',
      excerpt: 'He had no business plan and no partner. One Instagram poll launched a multi-state franchise.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Header Bar matching Screenshot 2 */}
        <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            <Link href="/videos" className="hover:underline">Latest Videos</Link>
          </h2>

          <Link
            href="/videos"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#1642D0] text-white flex items-center justify-center transition-colors group-hover:bg-blue-800">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* 3-Column Video Cards Grid (Matching Screenshot 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <Link
              key={vid.id}
              href={`/article/${vid.id}`}
              className="group flex flex-col space-y-3 cursor-pointer"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                <img
                  src={vid.imageUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug line-clamp-3">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                  {vid.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
