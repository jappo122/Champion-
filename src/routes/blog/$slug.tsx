import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "~/i18n";
import { getBlogPost, getBlogPosts, type BlogPost, type BlogSection } from "~/content/blog";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const params = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const p = getBlogPost(params.slug);
    setPost(p);
    // Get other posts for sidebar
    const all = getBlogPosts().filter((bp) => bp.slug !== params.slug);
    setRecentPosts(all);
  }, [params.slug]);

  if (!post) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Post not found</h1>
          <a href="/blog" className="mt-4 inline-block text-[#e63946] hover:underline">Back to Blog</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
<img src="/fb-logo.jpg" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/training" className="text-sm text-gray-400 transition-colors hover:text-white">Training</a>
            <a href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">Blog</a>
            <a href="/#pricing" className="text-sm text-gray-400 transition-colors hover:text-white">Pricing</a>
            <a href="/login" className="text-sm text-gray-400 transition-colors hover:text-white">Sign In</a>
            <a href="/signup" className="btn-primary text-sm">Get Started</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Blog Post */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <article className="lg:col-span-2">
            <a href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#e63946] transition-colors mb-6">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </a>

            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <span className="inline-flex items-center rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]">
                Article
              </span>
              <span>{post.date}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
              {post.title}
            </h1>

            <div className="mt-8 space-y-6">
              {post.sections.map((section, i) => (
                <BlogSectionRenderer key={i} section={section} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white">Ready to master the sales process?</h3>
              <p className="mt-2 text-gray-400">Join Champion Sales Training & Events and get access to our complete training library, interactive assessments, and manager coaching tools.</p>
              <div className="mt-6 flex gap-4">
                <a href="/signup" className="btn-primary text-sm">Start Training</a>
                <a href="/#pricing" className="btn-secondary text-sm">View Plans</a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">More Articles</h3>
              <div className="space-y-4">
                {recentPosts.map((rp) => (
                  <a
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group block"
                  >
                    <p className="text-sm font-medium text-white group-hover:text-[#e63946] transition-colors">
                      {rp.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{rp.date}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-[#1a2d4a] pt-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Start Learning</h3>
                <a href="/signup" className="btn-primary text-sm w-full text-center block">
                  Get Started Free
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/training" className="hover:text-white transition-colors">Training</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
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

function BlogSectionRenderer({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">{section.text}</h2>
      );
    case "subheading":
      return (
        <h3 className="text-lg font-bold text-[#f77f00] mt-6 mb-2">{section.text}</h3>
      );
    case "text":
      return (
        <p className="leading-relaxed text-gray-300">{section.text}</p>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {(section.items || []).map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <div className="border-l-4 border-[#e63946] bg-[#1a2d4a]/50 rounded-r-lg p-4 italic text-gray-300">
          {section.text}
        </div>
      );
    case "separator":
      return <hr className="border-[#1a2d4a] my-8" />;
    default:
      return null;
  }
}