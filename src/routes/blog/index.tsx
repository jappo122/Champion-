import { createFileRoute, useSearch } from "@tanstack/react-router";
import { LanguageSwitcher } from "~/i18n";
import { getBlogPosts, type BlogPost } from "~/content/blog";
import { SiteHeader } from "~/components/site-header";

const POSTS_PER_PAGE = 6;

export const Route = createFileRoute("/blog/")({
  component: BlogListing,
});

function BlogListing() {
  const search = useSearch({ from: Route.id as any });
  const currentPage = Math.max(1, parseInt((search as any)?.page) || 1);
  const allPosts = getBlogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-[#1a2d4a]/50 pt-[184px] pb-16 sm:pt-[200px] sm:pb-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Blog
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Sales Training <span className="gradient-text">Insights</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Expert advice, proven strategies, and actionable tips to master automotive sales and grow your career.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-8">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 sm:p-8"
              >
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="inline-flex items-center rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]">
                    Article
                  </span>
                  <span>{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-[#e63946] transition-colors sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#e63946]">
                  Read More
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {safePage > 1 ? (
                <a
                  href={`/blog?page=${safePage - 1}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a2d4a] px-4 py-2 text-sm text-gray-300 transition-all hover:border-[#e63946]/50 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a2d4a]/30 px-4 py-2 text-sm text-gray-600 cursor-not-allowed">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </span>
              )}
              <span className="text-sm text-gray-400">
                Page <span className="text-white font-semibold">{safePage}</span> of <span className="text-white font-semibold">{totalPages}</span>
              </span>
              {safePage < totalPages ? (
                <a
                  href={`/blog?page=${safePage + 1}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a2d4a] px-4 py-2 text-sm text-gray-300 transition-all hover:border-[#e63946]/50 hover:text-white"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a2d4a]/30 px-4 py-2 text-sm text-gray-600 cursor-not-allowed">
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/training" className="hover:text-white transition-colors">Training</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/support" className="hover:text-white transition-colors">Support</a>
            <a href="/login" className="hover:text-white transition-colors">Sign In</a>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Champion Sales Training & Events. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}