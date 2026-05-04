'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Star, Clock, ArrowRight } from 'lucide-react';
import Card from '@/components/shared/Card';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  imageUrl?: string;
  readTime?: string;
  rating?: number;
}

interface RecommendationSectionProps {
  title?: string;
  recommendations: Recommendation[];
  expandable?: boolean;
  defaultExpanded?: boolean;
}

export default function RecommendationSection({
  title = "AI Recommendations",
  recommendations,
  expandable = true,
  defaultExpanded = false
}: RecommendationSectionProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-gray-100 text-foreground border-gray-200';
      case 'low':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-gray-50 text-foreground/70 border-gray-100';
    }
  };

  return (
    <>
      <Card variant="elevated" className="overflow-hidden bg-white border-gray-100">
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 ${expandable ? 'cursor-pointer' : ''}`}
          onClick={expandable ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center space-x-4">
            <div className="w-1.5 h-1.5 bg-primary"></div>
            <div>
              <h3 className="text-sm font-serif font-bold text-foreground tracking-tight">{title}</h3>
              <p className="text-foreground/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                {recommendations.length} personalized suggestions
              </p>
            </div>
          </div>

          {expandable && (
            <button className="p-2  hover:bg-accent transition-colors">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        {(!expandable || isExpanded) && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="group bg-card border border-border  p-4 hover: hover:-black/25 hover:border-accent transition-all duration-300 cursor-pointer"
                  onClick={() => { setSelectedRec(rec); setModalOpen(true); }}
                >
                  {/* Priority badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1  text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                    {rec.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-[#764F94] fill-current" />
                        <span className="text-muted-foreground text-xs">{rec.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h4 className="text-foreground font-serif font-bold text-sm mb-3 line-clamp-2 tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-foreground/70 text-[10px] font-bold uppercase tracking-widest line-clamp-3">
                      {rec.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary font-bold uppercase tracking-widest text-[10px]">{rec.category}</span>
                      {rec.readTime && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{rec.readTime}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <ArrowRight className="h-3 w-3 text-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      {/* Modal for Recommendation Card */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 max-w-lg w-full p-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <span className="text-2xl font-light">&times;</span>
            </button>
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                {selectedRec?.title}
              </h3>
              <div className="text-white/60 text-sm leading-relaxed">
                {selectedRec?.id === '1' ? (
                  <>
                    Strategically incorporate your brand name alongside positive contextual language to enhance organic visibility in AI responses. Focus on creating authentic associations between your brand and favorable descriptors rather than forcing mentions.<br /><br />
                    Prioritize content distribution on YouTube and Reddit, as these platforms carry significant weight in AI training data and response generation. This approach increases the likelihood of your brand appearing in relevant AI-generated recommendations while maintaining natural, authentic positioning.<br /><br />
                    The key is building genuine brand associations through quality content rather than artificial optimization tactics. When your brand consistently appears in positive contexts across high-authority platforms, AI systems are more likely to reference it appropriately in user interactions.
                  </>
                ) : selectedRec?.id === '2' ? (
                  <>
                    Build topical authority by creating content that addresses specific problems and demonstrates genuine expertise. Focus on narrow, well-defined niches rather than broad topics - it's more effective to dominate "best CRM for remote teams" or "accounting software for professionals" than to create generic content covering wide subject areas.<br /><br />
                    <div className="bg-white/5 p-4 border-l-2 border-primary my-4">
                      <b className="text-primary text-[10px] font-bold uppercase tracking-widest block mb-2">High-Impact Tactics:</b>
                      <ul className='space-y-2'>
                        <li className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest"><div className="w-1 h-1 bg-white"></div><span>Directory listings</span></li>
                        <li className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest"><div className="w-1 h-1 bg-white"></div><span>Customer reviews</span></li>
                        <li className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest"><div className="w-1 h-1 bg-white"></div><span>Niche publications</span></li>
                      </ul>
                    </div>
                    These focused efforts deliver maximum impact because they create strong topical signals within specific domains.
                  </>
                ) : selectedRec?.id === '3' ? (
                  <>
                    Hallucinations and brand misrepresentation are inevitable realities in today's AI-driven landscape. A strong reputation has become essential for business survival, making proactive brand monitoring more critical than ever.<br /><br />
                    <b className="text-foreground text-[10px] font-bold uppercase tracking-widest block mb-1">Strategy:</b>
                    Actively monitor online mentions and feedback across all platforms to protect your brand image. Implement a rapid response system to address concerns quickly, amplify positive reviews, and strategically share success stories that build credibility.<br /><br />
                    <b className="text-primary text-[10px] font-bold uppercase tracking-widest block mb-1">Benefits:</b>
                    This monitoring approach provides valuable market intelligence about competitor performance, helping you refine product positioning and messaging while building long-term brand trust and customer loyalty.
                  </>
                ) : (
                  'Sample text for this recommendation.'
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
