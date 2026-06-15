import { useState } from 'react'
import './App.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const TOOLS = [
  // ── Websites ────────────────────────────────────────────────────
  {
    id: 'smart-scraper',
    category: 'Websites',
    name: 'Extract from a webpage',
    tagline: 'Ask anything about a page and get structured answers',
    icon: '🌐',
    endpoint: '/api/v1/smart-scraper',
    sourceType: 'single',
    hasSchema: true,
    promptLabel: 'What do you want to find?',
    promptPlaceholder: 'e.g. Get me the product name, price, and rating',
    sourceLabel: 'Website address',
    sourcePlaceholder: 'https://example.com',
  },
  {
    id: 'smart-scraper-lite',
    category: 'Websites',
    name: 'Quick extract',
    tagline: 'Faster extraction, best for simple text pages',
    icon: '⚡',
    endpoint: '/api/v1/smart-scraper-lite',
    sourceType: 'single',
    hasSchema: true,
    promptLabel: 'What do you want to find?',
    promptPlaceholder: 'e.g. Summarise the main article on this page',
    sourceLabel: 'Website address',
    sourcePlaceholder: 'https://example.com',
  },
  {
    id: 'search-link',
    category: 'Websites',
    name: 'Find links on a page',
    tagline: 'Discover and collect all relevant links from any page',
    icon: '🔗',
    endpoint: '/api/v1/search-link',
    sourceType: 'single',
    hasSchema: true,
    promptLabel: 'What kind of links are you looking for?',
    promptPlaceholder: 'e.g. Find all links related to getting started or tutorials',
    sourceLabel: 'Website address',
    sourcePlaceholder: 'https://example.com',
  },
  {
    id: 'depth-search',
    category: 'Websites',
    name: 'Deep crawl a site',
    tagline: 'Follows links automatically and gathers information across pages',
    icon: '🕸️',
    endpoint: '/api/v1/depth-search',
    sourceType: 'single',
    hasSchema: true,
    badge: 'Thorough',
    promptLabel: 'What are you looking for?',
    promptPlaceholder: 'e.g. Find all pricing plans and their features',
    sourceLabel: 'Starting page',
    sourcePlaceholder: 'https://example.com',
  },
  // ── Multiple Pages ───────────────────────────────────────────────
  {
    id: 'smart-scraper-multi',
    category: 'Multiple Pages',
    name: 'Extract from several pages',
    tagline: 'Ask the same question across multiple websites at once',
    icon: '📋',
    endpoint: '/api/v1/smart-scraper-multi',
    sourceType: 'multi',
    hasSchema: true,
    promptLabel: 'What do you want to find on each page?',
    promptPlaceholder: 'e.g. Get the headline and author from each article',
    sourceLabel: 'Website addresses',
    sourcePlaceholder: 'https://site1.com\nhttps://site2.com\nhttps://site3.com',
  },
  {
    id: 'smart-scraper-multi-batch',
    category: 'Multiple Pages',
    name: 'Bulk extract (large lists)',
    tagline: 'Handle a long list of pages efficiently without running out of memory',
    icon: '📦',
    endpoint: '/api/v1/smart-scraper-multi-batch',
    sourceType: 'multi',
    hasSchema: true,
    badge: 'Best for 5+ pages',
    promptLabel: 'What do you want to find on each page?',
    promptPlaceholder: 'e.g. Get the headline and author from each article',
    sourceLabel: 'Website addresses',
    sourcePlaceholder: 'https://site1.com\nhttps://site2.com',
  },
  {
    id: 'smart-scraper-multi-lite',
    category: 'Multiple Pages',
    name: 'Quick multi-page extract',
    tagline: 'Faster extraction across multiple pages — great for simple content',
    icon: '🚀',
    endpoint: '/api/v1/smart-scraper-multi-lite',
    sourceType: 'multi',
    hasSchema: true,
    promptLabel: 'What do you want to find?',
    promptPlaceholder: 'e.g. Get the title and summary of each page',
    sourceLabel: 'Website addresses',
    sourcePlaceholder: 'https://site1.com\nhttps://site2.com',
  },
  {
    id: 'smart-scraper-multi-concat',
    category: 'Multiple Pages',
    name: 'Read pages as one document',
    tagline: 'Combines content from all pages and answers your question once — ideal for paginated sites',
    icon: '📄',
    endpoint: '/api/v1/smart-scraper-multi-concat',
    sourceType: 'multi',
    hasSchema: true,
    badge: 'Paginated sites',
    promptLabel: 'What do you want to know?',
    promptPlaceholder: 'e.g. Summarise all the content across these pages',
    sourceLabel: 'Page addresses',
    sourcePlaceholder: 'https://blog.com/page/1\nhttps://blog.com/page/2',
  },
  // ── Web Search ───────────────────────────────────────────────────
  {
    id: 'search',
    category: 'Web Search',
    name: 'Search the web',
    tagline: 'Search Google-style and get AI-synthesised answers from the top results',
    icon: '🔍',
    endpoint: '/api/v1/search',
    sourceType: 'none',
    hasSchema: true,
    promptLabel: 'What do you want to know?',
    promptPlaceholder: 'e.g. What are the best Python web scraping libraries in 2025?',
  },
  // ── Generate Code ─────────────────────────────────────────────────
  {
    id: 'code-generator',
    category: 'Generate Code',
    name: 'Generate an extraction function',
    tagline: 'Writes a Python function that pulls specific data from any page automatically',
    icon: '🧩',
    endpoint: '/api/v1/code-generator',
    sourceType: 'single',
    hasSchema: true,
    schemaRequired: true,
    promptLabel: 'What data should the function extract?',
    promptPlaceholder: 'e.g. Extract all headlines and their links',
    sourceLabel: 'Example website',
    sourcePlaceholder: 'https://news.ycombinator.com',
  },
  {
    id: 'script-creator',
    category: 'Generate Code',
    name: 'Write a scraping script',
    tagline: 'Creates a complete, ready-to-run Python script for any website',
    icon: '📝',
    endpoint: '/api/v1/script-creator',
    sourceType: 'single',
    hasLibrary: true,
    promptLabel: 'What should the script do?',
    promptPlaceholder: 'e.g. Scrape all product names and prices from this page',
    sourceLabel: 'Target website',
    sourcePlaceholder: 'https://books.toscrape.com',
  },
  {
    id: 'script-creator-multi',
    category: 'Generate Code',
    name: 'Write a multi-site script',
    tagline: 'Creates one Python script that handles multiple websites in one go',
    icon: '📜',
    endpoint: '/api/v1/script-creator-multi',
    sourceType: 'multi',
    hasLibrary: true,
    promptLabel: 'What should the script collect?',
    promptPlaceholder: 'e.g. Get all article titles and publish dates',
    sourceLabel: 'Target websites',
    sourcePlaceholder: 'https://site1.com\nhttps://site2.com',
  },
  // ── Files & Docs ─────────────────────────────────────────────────
  {
    id: 'json-scraper',
    category: 'Files & Docs',
    name: 'Query a JSON file',
    tagline: 'Ask questions about the contents of a JSON file on the server',
    icon: '{ }',
    endpoint: '/api/v1/json-scraper',
    sourceType: 'single',
    promptLabel: 'What do you want to know?',
    promptPlaceholder: 'e.g. What is the total count of items?',
    sourceLabel: 'File path on server',
    sourcePlaceholder: '/data/file.json',
  },
  {
    id: 'json-scraper-multi',
    category: 'Files & Docs',
    name: 'Query multiple JSON files',
    tagline: 'Ask one question across several JSON files and get a merged answer',
    icon: '{ }',
    endpoint: '/api/v1/json-scraper-multi',
    sourceType: 'multi',
    promptLabel: 'What do you want to know?',
    promptPlaceholder: 'e.g. Compare the totals across all files',
    sourceLabel: 'File paths on server',
    sourcePlaceholder: '/data/a.json\n/data/b.json',
  },
  {
    id: 'xml-scraper',
    category: 'Files & Docs',
    name: 'Query an XML file',
    tagline: 'Extract information from an XML or RSS file on the server',
    icon: '< >',
    endpoint: '/api/v1/xml-scraper',
    sourceType: 'single',
    promptLabel: 'What do you want to extract?',
    promptPlaceholder: 'e.g. List all item titles and descriptions',
    sourceLabel: 'File path on server',
    sourcePlaceholder: '/data/feed.xml',
  },
  {
    id: 'xml-scraper-multi',
    category: 'Files & Docs',
    name: 'Query multiple XML files',
    tagline: 'Extract from several XML files with a single merged result',
    icon: '< >',
    endpoint: '/api/v1/xml-scraper-multi',
    sourceType: 'multi',
    promptLabel: 'What do you want to extract?',
    promptPlaceholder: 'e.g. List all items from all files',
    sourceLabel: 'File paths on server',
    sourcePlaceholder: '/data/a.xml\n/data/b.xml',
  },
  {
    id: 'csv-scraper',
    category: 'Files & Docs',
    name: 'Query a CSV / spreadsheet',
    tagline: 'Ask plain-English questions about tabular data in a CSV file',
    icon: '📊',
    endpoint: '/api/v1/csv-scraper',
    sourceType: 'single',
    promptLabel: 'What do you want to know about the data?',
    promptPlaceholder: 'e.g. What is the total revenue in Q3?',
    sourceLabel: 'File path on server',
    sourcePlaceholder: '/data/sales.csv',
  },
  {
    id: 'csv-scraper-multi',
    category: 'Files & Docs',
    name: 'Query multiple spreadsheets',
    tagline: 'Analyse and compare data across several CSV files at once',
    icon: '📊',
    endpoint: '/api/v1/csv-scraper-multi',
    sourceType: 'multi',
    promptLabel: 'What do you want to compare or summarise?',
    promptPlaceholder: 'e.g. Compare revenue across all quarters',
    sourceLabel: 'File paths on server',
    sourcePlaceholder: '/data/q1.csv\n/data/q2.csv',
  },
  {
    id: 'document-scraper',
    category: 'Files & Docs',
    name: 'Query a document',
    tagline: 'Ask questions about a Markdown or plain-text document on the server',
    icon: '📃',
    endpoint: '/api/v1/document-scraper',
    sourceType: 'single',
    promptLabel: 'What do you want to know?',
    promptPlaceholder: 'e.g. What are the main sections of this document?',
    sourceLabel: 'File path on server',
    sourcePlaceholder: '/docs/readme.md',
  },
  {
    id: 'document-scraper-multi',
    category: 'Files & Docs',
    name: 'Query multiple documents',
    tagline: 'Search and synthesise information across several documents',
    icon: '📃',
    endpoint: '/api/v1/document-scraper-multi',
    sourceType: 'multi',
    promptLabel: 'What do you want to find across the docs?',
    promptPlaceholder: 'e.g. Summarise the key points from all documents',
    sourceLabel: 'File paths on server',
    sourcePlaceholder: '/docs/a.md\n/docs/b.md',
  },
]

const CATEGORIES = [
  { name: 'Websites',       icon: '🌐', desc: 'Extract information from any webpage' },
  { name: 'Multiple Pages', icon: '📋', desc: 'Scrape several pages at once' },
  { name: 'Web Search',     icon: '🔍', desc: 'Search the internet and get AI answers' },
  { name: 'Generate Code',  icon: '⚙️', desc: 'Create Python scraping scripts automatically' },
  { name: 'Files & Docs',   icon: '📄', desc: 'Analyse JSON, CSV, XML, and text files' },
]

function defaultForm() {
  return {
    prompt: '',
    source: '',
    sources: '',
    schema_fields: '',
    library: 'beautifulsoup4',
    config_html_mode: false,
    config_reasoning: false,
    config_reattempt: false,
    config_headless: true,
    config_verbose: false,
    config_max_results: 3,
    config_additional_info: '',
  }
}

function buildPayload(tool, form) {
  const payload = {}
  payload.prompt = form.prompt
  if (tool.sourceType === 'single') payload.source = form.source
  if (tool.sourceType === 'multi')  payload.sources = form.sources.split('\n').map(s => s.trim()).filter(Boolean)
  if (tool.hasSchema && form.schema_fields.trim()) {
    try { payload.schema_fields = JSON.parse(form.schema_fields) } catch { /* skip */ }
  }
  if (tool.hasLibrary) payload.library = form.library

  const cfg = {}
  if (form.config_html_mode)                    cfg.html_mode = true
  if (form.config_reasoning)                    cfg.reasoning = true
  if (form.config_reattempt)                    cfg.reattempt = true
  if (!form.config_headless)                    cfg.headless = false
  if (form.config_verbose)                      cfg.verbose = true
  if (form.config_max_results !== 3)            cfg.max_results = Number(form.config_max_results)
  if (form.config_additional_info.trim())       cfg.additional_info = form.config_additional_info
  if (Object.keys(cfg).length)                  payload.config = cfg

  return payload
}

export default function App() {
  const [activeCat, setActiveCat] = useState('Websites')
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState(defaultForm())
  const [showAdv, setShowAdv]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [response, setResponse]   = useState(null)
  const [reqError, setReqError]   = useState(null)
  const [copied, setCopied]       = useState(false)

  const catTools  = TOOLS.filter(t => t.category === activeCat)
  const catMeta   = CATEGORIES.find(c => c.name === activeCat)

  function selectTool(tool) {
    setSelected(tool)
    setForm(defaultForm())
    setResponse(null)
    setReqError(null)
    setShowAdv(false)
  }

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    setReqError(null)
    try {
      const payload = buildPayload(selected, form)
      const res = await fetch(`${BASE_URL}${selected.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (err) {
      setReqError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    const text = response ? JSON.stringify(response.data, null, 2) : reqError
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="header-title">ScrapeGraph<span className="header-accent">AI</span></div>
              <div className="header-sub">Turn any website or file into structured data</div>
            </div>
          </div>
          <div className="header-pill">
            <span className="status-dot" />
            <span>Live</span>
          </div>
        </div>
      </header>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-label">What would you like to do?</div>
          <nav className="nav">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                className={`nav-btn${activeCat === cat.name ? ' active' : ''}`}
                onClick={() => { setActiveCat(cat.name); setSelected(null) }}
              >
                <span className="nav-icon">{cat.icon}</span>
                <span className="nav-name">{cat.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="section-header">
            <h2 className="section-title">{catMeta?.icon} {catMeta?.name}</h2>
            <p className="section-desc">{catMeta?.desc}</p>
          </div>

          <div className="tool-grid">
            {catTools.map(tool => (
              <button
                key={tool.id}
                className={`tool-card${selected?.id === tool.id ? ' selected' : ''}`}
                onClick={() => selectTool(tool)}
              >
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-info">
                  <div className="tool-name">
                    {tool.name}
                    {tool.badge && <span className="tool-badge">{tool.badge}</span>}
                  </div>
                  <div className="tool-tagline">{tool.tagline}</div>
                </div>
                <div className="tool-arrow">→</div>
              </button>
            ))}
          </div>

          {/* Form panel */}
          {selected && (
            <div className="panel">
              <div className="panel-top">
                <div className="panel-icon">{selected.icon}</div>
                <div>
                  <div className="panel-name">{selected.name}</div>
                  <div className="panel-tagline">{selected.tagline}</div>
                </div>
                <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                {/* Prompt */}
                {!selected.noPrompt && (
                  <div className="field">
                    <label className="label">{selected.promptLabel || 'What are you looking for?'} <span className="req">*</span></label>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder={selected.promptPlaceholder || 'Describe what you want to extract…'}
                      value={form.prompt}
                      onChange={e => setField('prompt', e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Source — single URL/path */}
                {selected.sourceType === 'single' && (
                  <div className="field">
                    <label className="label">{selected.sourceLabel || 'Address'} <span className="req">*</span></label>
                    <input
                      className="input"
                      type="text"
                      placeholder={selected.sourcePlaceholder || 'https://example.com'}
                      value={form.source}
                      onChange={e => setField('source', e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Sources — multiple */}
                {selected.sourceType === 'multi' && (
                  <div className="field">
                    <label className="label">{selected.sourceLabel || 'Addresses'} <span className="req">*</span> <span className="hint">— one per line</span></label>
                    <textarea
                      className="textarea"
                      rows={4}
                      placeholder={selected.sourcePlaceholder}
                      value={form.sources}
                      onChange={e => setField('sources', e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Schema */}
                {selected.hasSchema && (
                  <div className="field">
                    <label className="label">
                      Output fields
                      {selected.schemaRequired && <span className="req"> *</span>}
                      <span className="hint"> — optional, tells the AI exactly what to return</span>
                    </label>
                    <input
                      className="input input-mono"
                      type="text"
                      placeholder='{"title": "str", "price": "str", "rating": "str"}'
                      value={form.schema_fields}
                      onChange={e => setField('schema_fields', e.target.value)}
                      required={!!selected.schemaRequired}
                    />
                  </div>
                )}

                {/* Library */}
                {selected.hasLibrary && (
                  <div className="field">
                    <label className="label">Code style</label>
                    <select className="select" value={form.library} onChange={e => setField('library', e.target.value)}>
                      <option value="beautifulsoup4">BeautifulSoup (recommended)</option>
                      <option value="playwright">Playwright (for JavaScript sites)</option>
                      <option value="requests">Requests (lightweight)</option>
                    </select>
                  </div>
                )}

                {/* Advanced toggle */}
                <button
                  type="button"
                  className="adv-toggle"
                  onClick={() => setShowAdv(v => !v)}
                >
                  <span className={`adv-arrow${showAdv ? ' open' : ''}`}>▶</span>
                  Advanced settings
                </button>

                {showAdv && (
                  <div className="adv-panel">
                    <div className="adv-section">
                      <div className="adv-title">Options</div>
                      <div className="check-grid">
                        {[
                          ['config_html_mode',  'Faster mode (less accurate on complex pages)'],
                          ['config_reasoning',  'Think step by step before answering'],
                          ['config_reattempt',  'Retry automatically if result is empty'],
                          ['config_headless',   'Run browser invisibly in background'],
                          ['config_verbose',    'Show detailed processing logs'],
                        ].map(([key, label]) => (
                          <label key={key} className="check-item">
                            <input
                              type="checkbox"
                              checked={form[key]}
                              onChange={e => setField(key, e.target.checked)}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                      <div className="adv-row">
                        <div className="field">
                          <label className="label">Max pages to check</label>
                          <input className="input" type="number" min={1} max={10} value={form.config_max_results} onChange={e => setField('config_max_results', parseInt(e.target.value) || 3)} />
                        </div>
                        <div className="field">
                          <label className="label">Extra instructions</label>
                          <input className="input" type="text" placeholder="Any extra guidance for the AI…" value={form.config_additional_info} onChange={e => setField('config_additional_info', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="run-btn" disabled={loading}>
                  {loading ? <><span className="spinner" /> Running…</> : 'Run'}
                </button>
              </form>

              {/* Response */}
              {(response || reqError) && (
                <div className="result-panel">
                  <div className="result-header">
                    <span className="result-label">Result</span>
                    {response && (
                      <span className={`badge ${response.status < 300 ? 'ok' : 'err'}`}>
                        {response.status < 300 ? '✓ Success' : '✗ Error'}
                      </span>
                    )}
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="result-body">
                    {reqError
                      ? <div className="result-error">{reqError}</div>
                      : <pre className="result-json">{JSON.stringify(response.data, null, 2)}</pre>
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
