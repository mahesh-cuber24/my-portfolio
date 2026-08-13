// `metrics` renders as a stat row inside the expanded panel, and the panel has room
// for charts underneath — add a `charts` array per project when those exist.
export const projects = [
  {
    id: 'memora',
    index: '01',
    title: 'Memora',
    subtitle: 'AI-Powered Flashcard & Spaced-Repetition Platform',
    year: '2026',
    blurb:
      'A deployed full-stack product that turns raw notes into flashcards with a streaming LLM, then schedules reviews with a real SM-2 algorithm. Now driveable by AI assistants over MCP.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'MCP', 'Groq'],
    links: {
      demo: 'https://memora-sooty-pi.vercel.app',
      github: 'https://github.com/mahesh-cuber24/Memora',
      docs: 'https://memora-backend-c3f6.onrender.com/docs',
    },
    metrics: [
      { value: '70', label: 'Automated tests in CI' },
      { value: '5', label: 'MCP tools exposed' },
      { value: '2', label: 'LLM providers, with fallback' },
      { value: 'SM-2', label: 'Scheduling algorithm' },
    ],
    detail: {
      overview:
        'Anki has real spaced-repetition scheduling but a dated interface and fully manual card creation. Quizlet is polished but has no scheduling science underneath. Memora does both halves: paste in raw notes, the AI writes the flashcards, and a real algorithm decides when you see each card again. Built, tested and deployed end-to-end as a solo project.',
      highlights: [
        'Streaming generation over Server-Sent Events — the model is prompted for one flashcard per line (NDJSON) so each card renders the instant it arrives, and a malformed line is dropped instead of failing the whole batch.',
        'SM-2 scheduling engine written as a pure function with no side effects and table-driven unit tests covering every rating scenario.',
        'An MCP server wrapping five existing endpoints as tools, letting Claude create, review and reschedule cards conversationally — additive, with no backend logic duplicated.',
        'Append-only reviews table: never updated or deleted from, which is what makes the streak, retention percentage and heatmap trustworthy rather than a mutable counter.',
        'Security-conscious auth — bcrypt hashing plus identical error messages for a wrong password and an unknown email, so accounts cannot be probed.',
      ],
      challenges: [
        {
          title: 'A real cross-account data leak, found after deployment',
          body: 'The frontend cached API responses under a shared cache key, so if one person logged out and another logged in on the same browser, they could briefly see the previous user’s decks. Fixed by scoping the cache per user id — a genuine post-launch bug, not a hypothetical.',
        },
        {
          title: 'The AI provider could be down, rate-limited, or unconfigured',
          body: 'Built a Groq → Gemini fallback chain plus a fully offline mock provider so the app and every test run with zero API keys. A misconfigured real provider was deliberately made to fail loudly rather than silently serve fake data as genuine.',
        },
        {
          title: 'CORS broke on every new deployment',
          body: 'Vercel generates a fresh URL per preview deployment, so an exact allow-list would need editing on every branch push. Solved with a regex scoped to this project’s Vercel URLs without opening CORS to unrelated sites.',
        },
      ],
      stack: [
        'FastAPI',
        'SQLAlchemy 2.0',
        'Alembic',
        'Pydantic v2',
        'React 19',
        'TypeScript',
        'Tailwind v4',
        'TanStack Query',
        'PostgreSQL (Neon)',
        'Groq',
        'Gemini',
        'MCP',
        'Playwright',
        'pytest',
      ],
      status:
        'Live in production — Vercel frontend, Render backend, Neon database, with git-push-to-deploy and CI running 51 backend and 19 end-to-end tests on every push.',
    },
  },
  {
    id: 'anchor',
    index: '02',
    title: 'Anchor',
    subtitle: 'Corpus-Agnostic, Grounded RAG Agent',
    year: '2026',
    blurb:
      'A question-answering agent that answers strictly from its document corpus and refuses when the corpus does not support a confident answer — with groundedness measured, not assumed.',
    tags: ['LangGraph', 'FAISS', 'Groq', 'Gradio', 'Python'],
    links: {},
    metrics: [
      { value: '100%', label: 'Adversarial refusal accuracy' },
      { value: '5.00', label: 'Groundedness score (of 5)' },
      { value: '78%', label: 'Overall evaluation pass rate' },
      { value: '376', label: 'Unit tests' },
    ],
    detail: {
      overview:
        'Fluency is not truthfulness. When a model does not know something it will often produce a confident, well-written answer anyway — and for company policy or compliance material, a confidently wrong answer is worse than none. Anchor enforces groundedness rather than assuming it, and the document corpus is swappable without a single code change: corpus identity lives entirely in a small manifest file, never hard-coded.',
      highlights: [
        'Built as a LangGraph state machine (route → retrieve → generate → verify → respond) because the flow genuinely loops — a failed verification sends control back to retrieval with a widened search.',
        'Two-layer guardrails: a free deterministic check confirms every citation points at a real retrieved chunk, then a separate LLM call independently verifies the passages actually support the claims.',
        'Layered architecture where a core layer defines four narrow interfaces and depends on no AI library — so the entire reasoning graph unit-tests with no internet, no API key and no downloaded model.',
        'Corpus-agnostic evaluation that generates its own test questions from the indexed documents, plus adversarial out-of-corpus questions the system is expected to refuse.',
        'Provider-swappable between Groq and Google Gemini via a single configuration value — proving the abstraction rather than only claiming it.',
      ],
      challenges: [
        {
          title: 'A verified false claim was still nearly served',
          body: 'The guardrail correctly flagged a specific claim as unsupported, but the overall answer was still labelled "partially supported" and accepted by default — leaving a known-incorrect statement one setting away from being shown. The logic now refuses whenever any specifically named claim is unsupported, regardless of the overall verdict.',
        },
        {
          title: 'The evaluation framework lied about itself',
          body: 'A test comparing performance with and without guardrails showed an alarming quality drop. It was not real: the provider’s daily free limit had been hit partway through, so every question failed for an unrelated reason. The framework now detects this and refuses to report the run as a valid measurement rather than producing a misleading number.',
        },
        {
          title: 'A diversity feature that reduced answer quality',
          body: 'A re-ranking step added to avoid near-duplicate passages passed isolated testing, but against real questions it sometimes discarded a genuinely relevant passage to include an unrelated one purely to satisfy diversity. Fixed by moving the relevance filter to run before the diversity step, so only passages that already clear the quality bar are eligible.',
        },
        {
          title: 'Silent text truncation during chunking',
          body: 'Chunk size was set larger than the embedding model’s real processing limit, so the model silently discarded the end of oversized chunks — information invisibly lost before it could ever be retrieved. Corrected, with a build-time check that now refuses to proceed if the configured size exceeds the model’s limit again.',
        },
      ],
      stack: [
        'Python 3.11',
        'LangGraph',
        'FAISS',
        'Sentence-Transformers',
        'Groq (Llama 3.3)',
        'Google Gemini',
        'Gradio',
        'Pydantic',
        'pytest',
        'Ruff',
        'Mypy',
      ],
      status:
        'Retrieval hit rate of 0.67 is the identified bottleneck — since groundedness scores a perfect 5.00, the model is not the weak point, retrieval is. Hybrid semantic + keyword search is the next step.',
    },
  },
  {
    id: 'edge-generative',
    index: '03',
    title: 'Edge-Optimized Generative Image Model',
    subtitle: 'GAN Compression for Low-Power Hardware',
    year: '2025',
    blurb:
      'A compact GAN compressed via structured pruning and INT8 quantization to run on Raspberry Pi / Jetson-class hardware instead of a cloud GPU, with a prototype LLaMA text-conditioning path.',
    tags: ['PyTorch', 'GANs', 'Quantization', 'LLaMA'],
    links: {
      github: 'https://github.com/mahesh-cuber24/Edge-Optimized-Generative-Image-Model',
    },
    metrics: [
      { value: '40%', label: 'Generator weights pruned' },
      { value: '4×', label: 'Size reduction from INT8' },
      { value: '50', label: 'Training epochs' },
      { value: '32²', label: 'Output resolution (RGB)' },
    ],
    detail: {
      overview:
        'Most generative models need a cloud GPU, which rules them out where privacy, latency, cost or connectivity matter — cameras, robotics, wearables, field sensors. This is a research prototype answering whether a generative image model can be made small and fast enough to run directly on low-power edge hardware while still producing usable output.',
      highlights: [
        'DCGAN-style generator and discriminator built from scratch in PyTorch — transposed convolutions upsampling a 100-dimensional latent vector to a 32×32 RGB image.',
        'L1-unstructured pruning removing 40% of weights from the generator’s transposed convolution layers, followed by post-training static INT8 quantization via the fbgemm backend.',
        'A PromptConditioning module that tokenizes a text prompt, runs it through LLaMA, mean-pools to a single embedding and projects it into the generator’s latent dimension.',
        'Adversarial training stabilised with batch normalisation and standard Adam settings (lr 2e-4, betas 0.5/0.999), with samples saved every 10 epochs to catch mode collapse early.',
      ],
      challenges: [
        {
          title: 'A lightweight GAN paired with a heavyweight LLM',
          body: 'The text-conditioning extension surfaced a real tension rather than a clean win: LLaMA is itself large, working directly against the edge goal. The takeaway was that building for edge means budgeting size and compute across every component of a pipeline, not just the headline model — the honest conclusion is to reach for a distilled model from the start.',
        },
        {
          title: 'Quantizing layers with limited operator support',
          body: 'Transposed convolutions have historically had inconsistent support across PyTorch quantization backends. Handled by explicitly selecting the fbgemm backend and validating the prepare/convert workflow against the actual model rather than assuming compatibility.',
        },
        {
          title: 'Balancing compression against output quality',
          body: 'Aggressive pruning or quantization visibly degrades generated images. A moderate 40% pruning ratio was chosen and outputs were evaluated qualitatively before and after each compression stage rather than compressing blindly.',
        },
      ],
      stack: [
        'Python',
        'PyTorch',
        'Torchvision',
        'OpenCV',
        'CIFAR-10',
        'Hugging Face Transformers',
        'LLaMA',
      ],
      status:
        'A research prototype, framed honestly — the compression pipeline is complete and validated; the LLaMA fusion is a tested standalone module, not yet merged into the training loop. Real hardware benchmarking is the next step.',
    },
  },
];
