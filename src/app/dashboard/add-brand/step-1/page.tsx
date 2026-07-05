'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Globe, Search, Sparkles, ArrowRight, AlertCircle, CheckCircle, Building2, Users, Tag, TrendingUp, ExternalLink, RefreshCw, Target, ShoppingCart } from 'lucide-react';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

export default function AddBrandStep1(): React.ReactElement {
  const [activeSource, setActiveSource] = useState<'amazon' | 'website'>('amazon');
  const [domain, setDomain] = useState('');
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [amazonMarketplace, setAmazonMarketplace] = useState('com');
  const [amazonOnlySearch, setAmazonOnlySearch] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const router = useRouter();
  
  const { 
    companyState, 
    getCompanyInfo,
    clearCompanyInfo
  } = useCompanyInfo();
  
  const companyData = companyState.result;
  const isAnalyzing = companyState.loading;
  const analysisError = companyState.error;

  const extractAsin = (input: string): string | null => {
    const trimmed = input.trim();

    if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }

    const urlPatterns = [
      /\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
      /\/gp\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
      /\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
      /[?&]asin=([A-Z0-9]{10})(?:&|$)/i,
    ];

    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        return match[1].toUpperCase();
      }
    }

    return null;
  };

  // Watch for successful company data fetch and navigate to step 2
  useEffect(() => {
    if (companyData && !isAnalyzing && !analysisError) {
      // Store company info in sessionStorage
      sessionStorage.setItem('companyInfo', JSON.stringify(companyData));
      
      // Navigate to step 2
      router.push('/dashboard/add-brand/step-2');
    }
    
    // Handle error case
    if (analysisError && !isAnalyzing) {
      setError(analysisError);
      setIsValidating(false);
    }
  }, [companyData, isAnalyzing, analysisError, router]);

  // Domain validation function
  const validateDomain = (inputDomain: string): { isValid: boolean; cleanDomain: string; error: string } => {
    if (!inputDomain.trim()) {
      return { isValid: false, cleanDomain: '', error: 'Domain is required' };
    }

    // Remove protocols and www
    let cleanDomain = inputDomain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.replace(/^www\./, '');
    cleanDomain = cleanDomain.replace(/\/$/, ''); // Remove trailing slash

    // Basic format validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    
    if (!domainRegex.test(cleanDomain)) {
      return { isValid: false, cleanDomain, error: 'Please enter a valid domain (e.g., example.com)' };
    }

    // Check for spaces
    if (cleanDomain.includes(' ')) {
      return { isValid: false, cleanDomain, error: 'Domain cannot contain spaces' };
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9.-]+$/.test(cleanDomain)) {
      return { isValid: false, cleanDomain, error: 'Domain contains invalid characters' };
    }

    // Check if it has at least one dot (TLD)
    if (!cleanDomain.includes('.')) {
      return { isValid: false, cleanDomain, error: 'Please include a top-level domain (e.g., .com, .org)' };
    }

    // Check for consecutive dots
    if (cleanDomain.includes('..')) {
      return { isValid: false, cleanDomain, error: 'Domain cannot have consecutive dots' };
    }

    // Check length
    if (cleanDomain.length > 253) {
      return { isValid: false, cleanDomain, error: 'Domain is too long (max 253 characters)' };
    }

    return { isValid: true, cleanDomain, error: '' };
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    setDomain(newDomain);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleAsinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAsinOrUrl(e.target.value);

    if (error) {
      setError('');
    }
  };

  const handleAnalyzeDomain = async () => {
    setIsValidating(true);
    setError('');

    const hasDomain = activeSource === 'website' && domain.trim().length > 0;
    const hasAsin = activeSource === 'amazon' && asinOrUrl.trim().length > 0;

    if (!hasDomain && !hasAsin) {
      setError(activeSource === 'amazon' ? 'Enter an Amazon ASIN or listing URL.' : 'Enter a product website domain.');
      setIsValidating(false);
      return;
    }

    const validation = hasDomain
      ? validateDomain(domain)
      : { isValid: true, cleanDomain: '', error: '' };
    
    if (!validation.isValid) {
      setError(validation.error);
      setIsValidating(false);
      return;
    }

    const asin = hasAsin ? extractAsin(asinOrUrl) : null;

    if (hasAsin && !asin) {
      setError('Please enter a valid 10-character ASIN or Amazon listing URL.');
      setIsValidating(false);
      return;
    }

    try {
      sessionStorage.setItem('amazonOnlySearch', JSON.stringify(amazonOnlySearch));

      if (asin) {
        const response = await fetch('/api/get-amazon-product-context', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asinOrUrl,
            marketplaceDomain: amazonMarketplace,
            amazonOnlySearch,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to get Amazon product context.');
        }

        let websiteCompanyInfo = null;

        if (hasDomain) {
          const websiteResponse = await fetch('/api/get-company-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ domain: validation.cleanDomain }),
          });

          const websiteData = await websiteResponse.json();

          if (websiteResponse.ok && websiteData.success) {
            websiteCompanyInfo = websiteData.data;
          }
        }

        const amazonProduct = data.data.amazonProduct;
        const mergeUnique = (left: string[] = [], right: string[] = []) =>
          [...left, ...right]
            .map((item) => item.trim())
            .filter((item, index, arr) => item && arr.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index);

        const amazonCompanyInfo = {
          ...(websiteCompanyInfo || data.data),
          companyName: websiteCompanyInfo?.companyName || data.data.companyName,
          shortDescription: websiteCompanyInfo
            ? `${websiteCompanyInfo.shortDescription} Amazon listing context: ${data.data.shortDescription}`
            : data.data.shortDescription,
          productsAndServices: websiteCompanyInfo
            ? mergeUnique(websiteCompanyInfo.productsAndServices, data.data.productsAndServices).slice(0, 10)
            : data.data.productsAndServices,
          keywords: websiteCompanyInfo
            ? mergeUnique(websiteCompanyInfo.keywords, data.data.keywords).slice(0, 10)
            : data.data.keywords,
          competitors: websiteCompanyInfo?.competitors || data.data.competitors || [],
          website: hasDomain ? `https://www.${validation.cleanDomain}` : data.data.website,
          sourceType: 'amazon',
          amazonAsin: asin,
          amazonOnlySearch,
          amazonProduct,
        };

        sessionStorage.setItem('amazonAsin', asin);
        sessionStorage.setItem('amazonProductContext', JSON.stringify(data.data.amazonProduct));
        sessionStorage.setItem('companyInfo', JSON.stringify(amazonCompanyInfo));
        sessionStorage.setItem(
          'brandDomain',
          hasDomain ? validation.cleanDomain : `amazon.${amazonMarketplace}/dp/${asin}`
        );

        router.push('/dashboard/add-brand/step-2');
        setIsValidating(false);
        return;
      }

      sessionStorage.removeItem('amazonAsin');
      sessionStorage.removeItem('amazonProductContext');
      sessionStorage.setItem('brandDomain', validation.cleanDomain);
      await getCompanyInfo(validation.cleanDomain);
      
      setIsValidating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate input. Please try again.');
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzeDomain();
    }
  };

  const validation = domain.trim()
    ? validateDomain(domain)
    : { isValid: false, cleanDomain: '', error: '' };
  const parsedAsin = extractAsin(asinOrUrl);
  const isValid = activeSource === 'website' && domain.trim() ? validation.isValid : true;
  const canContinue = activeSource === 'amazon'
    ? asinOrUrl.trim().length > 0 && !!parsedAsin
    : domain.trim().length > 0 && validation.isValid;

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Header with Logo */}
      <div className="flex justify-center pt-4 pb-2">
        <div className="flex flex-col items-center space-y-1">
          <span className="text-3xl font-bold tracking-tighter text-white">AERO</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Step Indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-8">
              {/* Step 1 - Active */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-black flex items-center justify-center text-lg font-bold mb-2">
                  1
                </div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Source</span>
              </div>

              {/* Connector */}
              <div className="w-16 h-px bg-[rgba(255,255,255,0.1)]"></div>

              {/* Step 2 - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-white/40 flex items-center justify-center text-lg font-bold mb-2">
                  2
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Product</span>
              </div>

              {/* Connector */}
              <div className="w-16 h-px bg-[rgba(255,255,255,0.1)]"></div>

              {/* Step 3 - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-white/40 flex items-center justify-center text-lg font-bold mb-2">
                  3
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Queries</span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 ">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Product Setup
              </h1>
              <p className="text-white/60 text-sm">
                Start with an Amazon ASIN or a product website domain
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 bg-white/5 border border-white/10 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveSource('amazon');
                  setError('');
                }}
                className={`py-3 px-4 font-bold uppercase tracking-widest text-[10px] transition-colors ${
                  activeSource === 'amazon'
                    ? 'bg-primary text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Amazon ASIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSource('website');
                  setError('');
                }}
                className={`py-3 px-4 font-bold uppercase tracking-widest text-[10px] transition-colors ${
                  activeSource === 'website'
                    ? 'bg-primary text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Product Website
              </button>
            </div>

            {/* Domain Input Section */}
            {activeSource === 'website' && (
            <div className="mb-8">
              <label className="block text-white text-sm font-semibold mb-3">
                Product Website Domain
              </label>
              
              <div className="relative mb-3">
                <input
                  type="text"
                  value={domain}
                  onChange={handleDomainChange}
                  onKeyPress={handleKeyPress}
                  placeholder="yourproduct.com"
                  className={`w-full bg-white/5 border text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 text-sm transition-all ${
                    error || analysisError
                      ? 'border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/20'
                      : domain && validation.isValid
                      ? 'border-primary focus:border-primary focus:ring-primary/20'
                      : 'border-white/10 focus:border-primary focus:ring-primary/20'
                  }`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {domain && !error && !analysisError && validation.isValid && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                  {(error || analysisError) && (
                    <AlertCircle className="h-5 w-5 text-[#FF4D4D]" />
                  )}
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Error Messages */}
              {error && (
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-[#FF4D4D] flex-shrink-0" />
                  <p className="text-[#FF4D4D] text-sm">{error}</p>
                </div>
              )}
              
              {analysisError && (
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-[#FF4D4D] flex-shrink-0" />
                  <p className="text-[#FF4D4D] text-sm">{analysisError}</p>
                </div>
              )}
              
              {/* Success Message */}
              {domain && !error && !analysisError && validation.isValid && (
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">Valid domain: {validation.cleanDomain}</p>
                </div>
              )}

              <p className="text-gray-300 text-xs">
                Enter your product&apos;s main website domain (e.g., apple.com, nike.com)
              </p>
              <p className="text-gray-300 text-xs">
                We&apos;ll use AI to research your domain and automatically extract company information for the next step.
              </p>
            </div>
            )}

            {activeSource === 'amazon' && (
            <div className="mb-8">
              <label className="block text-white text-sm font-semibold mb-3">
                Amazon ASIN or Listing URL
              </label>

              <div className="relative mb-3">
                <input
                  type="text"
                  value={asinOrUrl}
                  onChange={handleAsinChange}
                  onKeyPress={handleKeyPress}
                  placeholder="B09H74FXNW or https://www.amazon.com/dp/B09H74FXNW"
                  className={`w-full bg-white/5 border text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 text-sm transition-all ${
                    asinOrUrl && !parsedAsin
                      ? 'border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-[#FF4D4D]/20'
                      : parsedAsin
                      ? 'border-primary focus:border-primary focus:ring-primary/20'
                      : 'border-white/10 focus:border-primary focus:ring-primary/20'
                  }`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {parsedAsin && <CheckCircle className="h-5 w-5 text-primary" />}
                  {asinOrUrl && !parsedAsin && <AlertCircle className="h-5 w-5 text-[#FF4D4D]" />}
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {asinOrUrl && parsedAsin && (
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-primary text-sm">Valid ASIN: {parsedAsin}</p>
                </div>
              )}

              {asinOrUrl && !parsedAsin && (
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-[#FF4D4D] flex-shrink-0" />
                  <p className="text-[#FF4D4D] text-sm">Enter a 10-character ASIN or a valid Amazon product URL.</p>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-[#FF4D4D] flex-shrink-0" />
                  <p className="text-[#FF4D4D] text-sm">{error}</p>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-white text-xs font-medium mb-2">
                  Amazon Marketplace
                </label>
                <select
                  value={amazonMarketplace}
                  onChange={(e) => setAmazonMarketplace(e.target.value)}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary cursor-pointer text-sm"
                >
                  <option value="com" className="bg-black text-white">United States - amazon.com</option>
                  <option value="in" className="bg-black text-white">India - amazon.in</option>
                  <option value="co.uk" className="bg-black text-white">United Kingdom - amazon.co.uk</option>
                  <option value="ca" className="bg-black text-white">Canada - amazon.ca</option>
                  <option value="de" className="bg-black text-white">Germany - amazon.de</option>
                  <option value="fr" className="bg-black text-white">France - amazon.fr</option>
                  <option value="it" className="bg-black text-white">Italy - amazon.it</option>
                  <option value="es" className="bg-black text-white">Spain - amazon.es</option>
                  <option value="com.au" className="bg-black text-white">Australia - amazon.com.au</option>
                  <option value="co.jp" className="bg-black text-white">Japan - amazon.co.jp</option>
                </select>
              </div>

              <label className="flex items-start space-x-3 mt-4 p-4 bg-white/5 border border-white/10 cursor-pointer transition-colors hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={amazonOnlySearch}
                  onChange={(e) => setAmazonOnlySearch(e.target.checked)}
                  disabled={!asinOrUrl.trim()}
                  className="mt-1 bg-white/5 border-white/20 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-white font-bold text-xs uppercase tracking-tight">Ask AI engines to search Amazon only</span>
                </span>
              </label>
            </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeDomain}
              disabled={!canContinue || !isValid || isValidating || isAnalyzing}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-white/5 disabled:text-white/20 text-black font-bold uppercase tracking-widest py-4 px-6 transition-all duration-200 flex items-center justify-center text-xs"
            >
              {(isValidating || isAnalyzing) ? (
                <div className="spinner"></div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span>Build Product Context</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
} 


