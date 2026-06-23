import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  slug?: string;
}

export function SEOHead({ title, description, canonical, ogImage, slug }: SEOHeadProps) {
  const [seo, setSeo] = useState({ title, description, canonical, ogImage });

  useEffect(() => {
    // Keep initial props synced if they change
    setSeo({ title, description, canonical, ogImage });

    if (slug) {
      const fetchCMSSeo = async () => {
        try {
          const { data, error } = await supabase
            .from('pages')
            .select('meta_title, meta_description, canonical_url, og_image_url')
            .eq('slug', slug)
            .single();

          if (!error && data) {
            setSeo(prev => ({
              title: data.meta_title || prev.title,
              description: data.meta_description || prev.description,
              canonical: data.canonical_url || prev.canonical,
              ogImage: data.og_image_url || prev.ogImage,
            }));
          }
        } catch (err) {
          // Silently fail and use fallback props
        }
      };
      fetchCMSSeo();
    }
  }, [slug, title, description, canonical, ogImage]);

  return (
    <Helmet>
      <title>{seo.title ?? 'ClickTake Technologies'}</title>
      <meta name="description" content={seo.description ?? ''} />
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      <meta property="og:title" content={seo.title ?? 'ClickTake Technologies'} />
      <meta property="og:description" content={seo.description ?? ''} />
    </Helmet>
  );
}
