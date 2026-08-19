import { useState, useEffect } from 'react'
import { supabase, type BlogPost } from '../supabaseClient'
import Aside from '../components/Aside'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPosts(data as BlogPost[])
        setLoading(false)
      })
  }, [])

  return (
    <div className="container">
      <div className="page-title">
        <h2>Winery Blog</h2>
        <p>Stories, guides and news from Devon Valley Winery</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          {loading ? (
            <div className="loading">Loading blog posts</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No blog posts yet. Check back soon!</div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <article key={post.id} className="blog-card">
                  {post.image_url && <img src={post.image_url} alt={post.title} />}
                  <div className="blog-card-content">
                    <h3>{post.title}</h3>
                    <div className="blog-meta">
                      By {post.author} &middot;{' '}
                      {new Date(post.created_at).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    {expanded === post.id ? (
                      <>
                        <div className="article-body">{post.content}</div>
                        <button
                          className="btn btn-outline mt-2"
                          onClick={() => setExpanded(null)}
                        >
                          Show Less
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => setExpanded(post.id)}
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <Aside />
      </div>
    </div>
  )
}
