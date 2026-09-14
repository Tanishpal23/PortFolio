/* --------------------------------------------------------------------------
   TANISH PAL - PORTFOLIO INTERACTION ENGINE (VANILLA JS ES6+)
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioConfig();
  initRoleRotator();
  initNavigation();
  initProjectFiltering();
  initProjectModal();
  initBankingTerminal();
  initChessSimulator();
  initResumeActions();
  initContactAndClipboard();
});

/* --------------------------------------------------------------------------
   0. CENTRALIZED CONFIGURATION BINDING (config.js)
   -------------------------------------------------------------------------- */
function applyPortfolioConfig() {
  if (typeof PORTFOLIO_CONFIG === 'undefined') return;

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj);
  }

  // Bind any HTML element with data-config-link
  document.querySelectorAll('[data-config-link]').forEach(el => {
    const path = el.getAttribute('data-config-link');
    const val = getNestedValue(PORTFOLIO_CONFIG, path);
    if (!val) return;

    if (el.tagName === 'A') {
      if (path.startsWith('personal.email')) {
        el.href = `mailto:${val}`;
      } else if (path.startsWith('personal.phone')) {
        el.href = `tel:${val.replace(/\s+/g, '')}`;
      } else {
        el.href = val;
      }
    } else if (el.hasAttribute('data-copy')) {
      el.setAttribute('data-copy', val);
    }
  });

  // Dynamically sync PROJECT_DETAILS for Architecture Modals
  if (PORTFOLIO_CONFIG.projects) {
    if (typeof PROJECT_DETAILS !== 'undefined') {
      if (PROJECT_DETAILS.banking && PORTFOLIO_CONFIG.projects.coreBanking) {
        PROJECT_DETAILS.banking.demoUrl = PORTFOLIO_CONFIG.projects.coreBanking.demoUrl;
        PROJECT_DETAILS.banking.codeUrl = PORTFOLIO_CONFIG.projects.coreBanking.codeUrl;
      }
      if (PROJECT_DETAILS.mockmate && PORTFOLIO_CONFIG.projects.mockMate) {
        PROJECT_DETAILS.mockmate.demoUrl = PORTFOLIO_CONFIG.projects.mockMate.demoUrl;
        PROJECT_DETAILS.mockmate.codeUrl = PORTFOLIO_CONFIG.projects.mockMate.codeUrl;
      }
      if (PROJECT_DETAILS.kyp && PORTFOLIO_CONFIG.projects.knowYourProduct) {
        PROJECT_DETAILS.kyp.demoUrl = PORTFOLIO_CONFIG.projects.knowYourProduct.demoUrl;
        PROJECT_DETAILS.kyp.codeUrl = PORTFOLIO_CONFIG.projects.knowYourProduct.codeUrl;
      }
      if (PROJECT_DETAILS.chess && PORTFOLIO_CONFIG.projects.chessAnalyzer) {
        PROJECT_DETAILS.chess.demoUrl = PORTFOLIO_CONFIG.projects.chessAnalyzer.demoUrl;
        PROJECT_DETAILS.chess.codeUrl = PORTFOLIO_CONFIG.projects.chessAnalyzer.codeUrl;
      }
      if (PROJECT_DETAILS.powerbi && PORTFOLIO_CONFIG.projects.salesDashboard) {
        PROJECT_DETAILS.powerbi.demoUrl = PORTFOLIO_CONFIG.projects.salesDashboard.demoUrl;
        PROJECT_DETAILS.powerbi.codeUrl = PORTFOLIO_CONFIG.projects.salesDashboard.codeUrl;
      }
      if (PROJECT_DETAILS.nexmeet && PORTFOLIO_CONFIG.projects.nexMeet) {
        PROJECT_DETAILS.nexmeet.demoUrl = PORTFOLIO_CONFIG.projects.nexMeet.demoUrl;
        PROJECT_DETAILS.nexmeet.codeUrl = PORTFOLIO_CONFIG.projects.nexMeet.codeUrl;
      }
    }
  }
}

/* --------------------------------------------------------------------------
   1. DYNAMIC ROLE ROTATOR
   -------------------------------------------------------------------------- */
function initRoleRotator() {
  const roleTextEl = document.getElementById('role-text');
  if (!roleTextEl) return;

  const roles = [
    'Low-Level Systems & C++',
    'WASM & High-Performance Engines',
    'AI & Modern Full-Stack Platforms',
    'Distributed Backends & Databases',
    'Algorithmic Problem Solving'
  ];

  let currentRoleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeStep() {
    const currentRole = roles[currentRoleIdx];

    if (isDeleting) {
      charIdx--;
      roleTextEl.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 35;
    } else {
      charIdx++;
      roleTextEl.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at full text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new text
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   2. SCROLL SPY, PROGRESS BAR & NAVIGATION
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // Scroll event
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPos / totalHeight) * 100;

    // Progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Header blur effect
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for active link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   3. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. ARCHITECTURE DEEP-DIVE MODAL
   -------------------------------------------------------------------------- */
const PROJECT_DETAILS = {
  chess: {
    title: 'ChessAnalyzer - WASM Architecture & Engine Pipeline',
    tag: 'WebAssembly & High-Performance Engines',
    demoUrl: 'https://chess-analyzer-pearl.vercel.app/',
    codeUrl: 'https://github.com/Tanishpal23/ChessAnalyzer',
    bodyHtml: `
      <p>ChessAnalyzer is engineered for zero-latency, 100% client-side grandmaster-grade evaluation without round-trip server overhead or paid cloud engine APIs.</p>
      
      <div class="modal-section-title"><i class="fa-solid fa-microchip text-cyan"></i> Asynchronous Web Worker & UCI Protocol</div>
      <ul class="modal-points">
        <li>Offloads the compiled <strong>Stockfish 18 WASM binary</strong> to background Web Workers, leaving the main UI thread purely responsible for 60 FPS SVG board rendering.</li>
        <li>Implements a bidirectional non-blocking Universal Chess Interface (UCI) stream parser handling asynchronous engine commands: <code>position fen</code>, <code>go depth 18</code>, <code>info score cp</code>, and <code>bestmove</code>.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-square-root-variable text-purple"></i> CAPS2 Move Classification Model</div>
      <ul class="modal-points">
        <li>Computes non-linear win probability curves using <code>P(win) = 50 + 50 * tanh(cp / 400)</code>.</li>
        <li>Classifies every move across a 10-tier hierarchy: <em>Brilliant, Great, Best, Excellent, Good, Inaccuracy, Mistake, Missed Win, Blunder</em>.</li>
        <li>Detects material sacrifice brilliancies by validating delta piece evaluation vs subsequent win probability preservation.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-book-open text-emerald"></i> O(1) Opening Theory Engine & Automated Tests</div>
      <ul class="modal-points">
        <li>Indexed 110+ international opening variations in a pre-computed prefix-tree lookup structure delivering instant ECO code detection up to 24 plies.</li>
        <li>Verified entire UCI pipeline and classification math with <strong>61 automated unit tests in Vitest</strong>.</li>
      </ul>
    `
  },
  mockmate: {
    title: 'Mock Mate - AI Technical Assessment Architecture',
    tag: 'Next.js 14, Gemini LLM & Neon DB',
    demoUrl: 'https://mockmate-gamma.vercel.app/',
    codeUrl: 'https://github.com/Tanishpal23/Ai-Interiew-Mocker',
    bodyHtml: `
      <p>Mock Mate simulates realistic voice-driven technical interview rounds with automated quantitative scoring, instant model answers, and qualitative feedback.</p>
      
      <div class="modal-section-title"><i class="fa-solid fa-microphone-lines text-cyan"></i> Sub-Second Voice Interaction Engine</div>
      <ul class="modal-points">
        <li>Leverages browser-native <strong>Web Speech SpeechRecognition and SpeechSynthesis APIs</strong> to achieve sub-second conversational latency without costly third-party audio API latency.</li>
        <li>Buffers streamed candidate answers and prepares them for semantic evaluation.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-shield-halved text-purple"></i> 0% Credential Leakage & Security Hardening</div>
      <ul class="modal-points">
        <li>Eliminated client-side database connections entirely by funneling state mutations through <strong>Next.js 14 React Server Actions</strong>.</li>
        <li>Database secrets, Gemini API keys, and Clerk JWT credentials stay strictly on the server edge runtime.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-database text-emerald"></i> Serverless Postgres Persistence</div>
      <ul class="modal-points">
        <li>Configured Neon Serverless PostgreSQL with <strong>Drizzle ORM</strong> for type-safe schema migrations, managing multi-step session progress and historical performance curves.</li>
      </ul>
    `
  },
  banking: {
    title: 'Core Banking System - C++17 Architecture & Persistence',
    tag: 'Systems Software & Low-Level Design (LLD)',
    demoUrl: 'https://www.onlinegdb.com/MV9SF_PEn',
    codeUrl: 'https://github.com/Tanishpal23/Banking-System',
    bodyHtml: `
      <p>A resilient PIN-authenticated banking engine engineered in C++17 emphasizing low-level data integrity, transaction safety, and clean OOP abstractions.</p>
      
      <div class="modal-section-title"><i class="fa-solid fa-file-shield text-cyan"></i> Append-Only Audit Trail & File I/O</div>
      <ul class="modal-points">
        <li>Engineered a custom file-based persistence layer using an append-only transaction ledger, guaranteeing that account states, deposits, and inter-account transfers survive application restarts.</li>
        <li>Implements atomic write patterns and state replay upon process recovery.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-terminal text-purple"></i> Adaptive Terminal Rendering</div>
      <ul class="modal-points">
        <li>Built cross-platform CLI rendering supporting dynamic terminal width queries, ANSI escape code color support, and UTF-8 glyph fallback for Windows Command Prompt and UNIX shells.</li>
        <li>Enforces strict validation checks preventing overdrafts, negative deposit amounts, and duplicate account identities.</li>
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-circle-check text-emerald"></i> Compilation Rigor</div>
      <ul class="modal-points">
        <li>Compiles warning-free under modern GCC/Clang with aggressive compiler flags: <code>-Wall -Wextra -Wpedantic -std=c++17</code>.</li>
      </ul>
    `
  },
  kyp: {
    title: 'KnowYourProduct - Optical Scanning & Nutrition Engine',
    tag: 'Full-Stack Health Tech',
    demoUrl: 'https://knowyourproduct-wine.vercel.app/',
    codeUrl: 'https://github.com/Tanishpal23/knowyourproduct',
    bodyHtml: `
      <p>A full-stack nutrition intelligence platform enabling consumers to make informed dietary decisions by scanning packaged food barcodes.</p>
      <div class="modal-section-title"><i class="fa-solid fa-barcode text-cyan"></i> Real-time Barcode Recognition</div>
      <ul class="modal-points">
        <li>Integrated HTML5-QRCode scanner directly in the browser, allowing mobile and desktop cameras to scan UPC/EAN barcodes in sub-second frames.</li>
        <li>Maps barcodes to extensive dietary databases for allergens, trans fats, additives, and Nova food classification.</li>
      </ul>
      <div class="modal-section-title"><i class="fa-solid fa-magnifying-glass text-purple"></i> Mongoose Text Indexing & JWT</div>
      <ul class="modal-points">
        <li>Implemented MongoDB full-text indexes for instant fuzzy search across thousands of grocery products.</li>
        <li>JWT-protected endpoints for personalized allergen warning profiles and dietary bookmarking.</li>
      </ul>
    `
  },
  powerbi: {
    title: 'Sales Performance Dashboard - BI Modeling & DAX',
    tag: 'Business Intelligence & Data Modeling',
    demoUrl: 'https://github.com/Tanishpal23/PowerBiPro',
    codeUrl: 'https://github.com/Tanishpal23/PowerBiPro',
    bodyHtml: `
      <p>An enterprise-grade business intelligence dashboard designed to monitor corporate revenue velocity, customer cohorts, and regional growth.</p>
      <div class="modal-section-title"><i class="fa-solid fa-database text-cyan"></i> Star Schema & ETL Pipeline</div>
      <ul class="modal-points">
        <li>Ingested, cleaned, and standardized disparate transaction records using Power Query M language transformations.</li>
        <li>Structured a normalized Star Schema separating Fact tables (Sales, Orders) from Dimension tables (Products, Geography, Date, Customer Segments).</li>
      </ul>
      <div class="modal-section-title"><i class="fa-solid fa-chart-line text-purple"></i> Advanced DAX Measures</div>
      <ul class="modal-points">
        <li>Authored complex DAX calculations for Year-over-Year (YoY) variance, rolling 3-month moving averages, and dynamic profit margin sensitivities.</li>
      </ul>
    `
  },
  nexmeet: {
    title: 'NexMeet & Brainly - Real-time Collaboration & Auth',
    tag: 'Next.js & Real-time WebRTC',
    demoUrl: 'https://nex-meet-beta.vercel.app/',
    codeUrl: 'https://brainly-ko1p.vercel.app/',
    bodyHtml: `
      <p>Real-time collaborative communication and knowledge curation web apps.</p>
      <div class="modal-section-title"><i class="fa-solid fa-video text-cyan"></i> Stream Video WebRTC Engine</div>
      <ul class="modal-points">
        <li>Integrated Stream Video SDK for low-latency multi-participant video rooms, dynamic speaker layout, and screen-sharing controls.</li>
        <li>PostgreSQL-backed meeting scheduling engine with calendar coordination and link generation.</li>
      </ul>
      <div class="modal-section-title"><i class="fa-solid fa-lock text-purple"></i> Zod Validation & NextAuth</div>
      <ul class="modal-points">
        <li>Guaranteed complete schema validity on every API route using Zod schemas.</li>
        <li>NextAuth role-based session tokens enforcing security against unauthorized room joins.</li>
      </ul>
    `
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalBody = document.getElementById('modal-body');
  const modalFooter = document.getElementById('modal-footer');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.btn-details');

  if (!modal || !detailButtons.length) return;

  function openModal(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalBody.innerHTML = data.bodyHtml;

    modalFooter.innerHTML = `
      <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Demo
      </a>
      <a href="${data.codeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
        <i class="fa-brands fa-github"></i> View GitHub Code
      </a>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openModal(proj);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. IN-BROWSER C++ BANKING CLI SIMULATOR
   -------------------------------------------------------------------------- */
function initBankingTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalScreen = document.getElementById('terminal-screen');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  if (!terminalInput || !terminalOutput) return;

  // In-memory simulation state
  const state = {
    accountNumber: 'ACC_882',
    accountHolder: 'Tanish Pal',
    balance: 4500.00,
    destAccount: 'ACC_902',
    destBalance: 1200.00,
    transactions: [
      { id: 'TXN-101', type: 'INITIAL_DEPOSIT', amount: 4500.00, timestamp: '2026-09-14 10:00:00' }
    ]
  };

  function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Echo input
    appendLine(`<span class="prompt-prefix">user@banking-cli:~$</span> <span class="term-user-input">${escapeHtml(cmd)}</span>`);

    const parts = cmd.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();

    switch (mainCmd) {
      case 'help':
        appendLine('--- Available Core Banking Engine Commands ---', 'text-cyan');
        appendLine('  <span class="term-highlight">balance</span>                 : Query current account balance & state');
        appendLine('  <span class="term-highlight">deposit &lt;amount&gt;</span>         : Deposit funds with balance validation');
        appendLine('  <span class="term-highlight">withdraw &lt;amount&gt;</span>        : Withdraw funds with overdraft protection');
        appendLine('  <span class="term-highlight">transfer &lt;acc&gt; &lt;amount&gt;</span>  : Inter-account fund transfer');
        appendLine('  <span class="term-highlight">history</span>                 : View recent transactions');
        appendLine('  <span class="term-highlight">audit</span>                   : Inspect tamper-proof append-only ledger');
        appendLine('  <span class="term-highlight">inspect</span>                 : Display C++ class memory layout');
        appendLine('  <span class="term-highlight">clear</span>                   : Clear terminal output');
        break;

      case 'balance':
        appendLine(`[Query OK] Account: <span class="term-highlight">${state.accountNumber}</span> | Holder: ${state.accountHolder}`);
        appendLine(`Current Available Balance: <span class="term-success">$${state.balance.toFixed(2)} USD</span>`);
        break;

      case 'deposit': {
        const amt = parseFloat(parts[1]);
        if (isNaN(amt) || amt <= 0) {
          appendLine('[ERROR] Invalid deposit amount. Usage: deposit &lt;positive_number&gt;', 'term-error');
        } else {
          state.balance += amt;
          const txnId = `TXN-${Math.floor(100 + Math.random() * 900)}`;
          state.transactions.push({ id: txnId, type: 'DEPOSIT', amount: amt, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) });
          appendLine(`[SUCCESS] Deposited $${amt.toFixed(2)} USD into ${state.accountNumber}.`, 'term-success');
          appendLine(`New Balance: <span class="term-highlight">$${state.balance.toFixed(2)} USD</span> | Ref: ${txnId}`);
        }
        break;
      }

      case 'withdraw': {
        const amt = parseFloat(parts[1]);
        if (isNaN(amt) || amt <= 0) {
          appendLine('[ERROR] Invalid withdrawal amount. Usage: withdraw &lt;positive_number&gt;', 'term-error');
        } else if (amt > state.balance) {
          appendLine(`[REJECTED] Insufficient funds! Requested: $${amt.toFixed(2)}, Available: $${state.balance.toFixed(2)}`, 'term-error');
        } else {
          state.balance -= amt;
          const txnId = `TXN-${Math.floor(100 + Math.random() * 900)}`;
          state.transactions.push({ id: txnId, type: 'WITHDRAW', amount: -amt, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) });
          appendLine(`[SUCCESS] Dispensed $${amt.toFixed(2)} USD from ${state.accountNumber}.`, 'term-success');
          appendLine(`Remaining Balance: <span class="term-highlight">$${state.balance.toFixed(2)} USD</span> | Ref: ${txnId}`);
        }
        break;
      }

      case 'transfer': {
        const dest = parts[1];
        const amt = parseFloat(parts[2]);
        if (!dest || isNaN(amt) || amt <= 0) {
          appendLine('[ERROR] Usage: transfer &lt;destination_acc&gt; &lt;amount&gt; (e.g. transfer ACC_902 350)', 'term-error');
        } else if (amt > state.balance) {
          appendLine(`[REJECTED] Insufficient balance for wire transfer: $${amt.toFixed(2)}`, 'term-error');
        } else {
          state.balance -= amt;
          state.destBalance += amt;
          const txnId = `TXN-${Math.floor(100 + Math.random() * 900)}`;
          state.transactions.push({ id: txnId, type: `TRANSFER_TO_${dest}`, amount: -amt, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) });
          appendLine(`[SUCCESS] Wire Transfer Completed to ${dest}!`, 'term-success');
          appendLine(`Transferred: $${amt.toFixed(2)} | Sender Balance: <span class="term-highlight">$${state.balance.toFixed(2)} USD</span>`);
          appendLine(`Destination Account (${dest}) New Balance: $${state.destBalance.toFixed(2)} USD`);
        }
        break;
      }

      case 'history':
        appendLine('--- Transaction History Ledger ---', 'text-cyan');
        state.transactions.forEach(t => {
          const sign = t.amount > 0 ? '+' : '';
          appendLine(`[${t.timestamp}] ${t.id.padEnd(8)} | ${t.type.padEnd(16)} | <span class="${t.amount >= 0 ? 'term-success' : 'term-error'}">${sign}$${t.amount.toFixed(2)}</span>`);
        });
        break;

      case 'audit':
        appendLine('--- Tamper-Proof Append-Only Audit Trail ---', 'text-cyan');
        appendLine('File: <span class="term-highlight">/var/data/ledger_audit.log</span> (Checked warning-free)');
        state.transactions.forEach((t, i) => {
          const fakeHash = (i * 987654321 + 12345).toString(16).substring(0, 8);
          appendLine(`BLOCK #${i + 1} [HASH: 0x${fakeHash}...] -> [${t.type}] $${Math.abs(t.amount)} | STATUS: COMMITTED`);
        });
        appendLine('Integrity Check: <span class="term-success">PASSED (0 Corruptions Detected)</span>');
        break;

      case 'inspect':
        appendLine('--- C++17 Core Engine Class Definition ---', 'text-cyan');
        appendLine('<span class="token-keyword">struct</span> <span class="token-type">Account</span> {');
        appendLine('    <span class="token-type">uint64_t</span> id = 882;');
        appendLine('    <span class="token-type">double</span> balance = ' + state.balance.toFixed(2) + ';');
        appendLine('    <span class="token-type">std::vector&lt;Transaction&gt;</span> auditLog;');
        appendLine('    <span class="token-type">mutable std::mutex</span> accountLock;');
        appendLine('};');
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      default:
        appendLine(`[UNKNOWN COMMAND] '${cmd}'. Type <span class="term-highlight">help</span> for command list.`, 'term-error');
        break;
    }

    appendLine('&nbsp;');
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      terminalInput.focus();
    });
  });

  // Focus terminal input on container click
  terminalScreen.addEventListener('click', () => {
    terminalInput.focus();
  });
}

/* --------------------------------------------------------------------------
   6. CHESS CAPS2 tanh WIN-RATE SIMULATOR
   -------------------------------------------------------------------------- */
function initChessSimulator() {
  const evalSlider = document.getElementById('eval-slider');
  const evalDisplay = document.getElementById('eval-display');
  const metricWinRate = document.getElementById('metric-win-rate');
  const evalBarFill = document.getElementById('eval-bar-fill');
  const metricClassification = document.getElementById('metric-classification');
  const metricDesc = document.getElementById('metric-desc');
  const openingBtns = document.querySelectorAll('.opening-tag-btn');
  const openingResult = document.getElementById('opening-result');

  if (!evalSlider || !evalDisplay) return;

  function updateEval(cpVal) {
    const cp = parseInt(cpVal, 10);
    const scoreFormatted = (cp / 100).toFixed(2);
    const sign = cp > 0 ? '+' : '';

    evalDisplay.textContent = `${sign}${scoreFormatted} (${sign}${cp} cp)`;

    // Hyperbolic tangent model: P(win) = 50 + 50 * tanh(cp / 400)
    const winRate = 50 + 50 * Math.tanh(cp / 400);
    metricWinRate.textContent = `${winRate.toFixed(1)}%`;
    evalBarFill.style.width = `${winRate.toFixed(1)}%`;

    // Classification badges
    metricClassification.className = 'metric-badge';

    if (cp >= 500) {
      metricClassification.classList.add('badge-brilliant');
      metricClassification.innerHTML = '<i class="fa-solid fa-gem"></i> Decisive Win';
      metricDesc.textContent = 'Decisive advantage converted with zero blunders';
    } else if (cp >= 200) {
      metricClassification.classList.add('badge-great');
      metricClassification.innerHTML = '<i class="fa-solid fa-bolt"></i> Brilliant Find';
      metricDesc.textContent = 'Capitalizes on tactical win preservation';
    } else if (cp >= -100 && cp <= 150) {
      metricClassification.classList.add('badge-best');
      metricClassification.innerHTML = '<i class="fa-solid fa-circle-check"></i> Best Move';
      metricDesc.textContent = 'Preserves optimal theoretical equality';
    } else {
      metricClassification.classList.add('badge-blunder');
      metricClassification.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Critical Inaccuracy';
      metricDesc.textContent = 'Win expectation dropped below parity';
    }
  }

  evalSlider.addEventListener('input', (e) => {
    updateEval(e.target.value);
  });

  // Initial update
  updateEval(evalSlider.value);

  // Opening theory tabs
  openingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const eco = btn.getAttribute('data-eco');
      const name = btn.getAttribute('data-name');
      const moves = btn.getAttribute('data-moves');

      openingResult.innerHTML = `
        <span class="eco-code">ECO: ${eco}</span> &bull; 
        <span class="eco-name">${name}</span>
        <div style="color: #94a3b8; font-size: 0.75rem; margin-top: 0.3rem;">Prefix: ${moves}</div>
      `;
    });
  });
}

/* --------------------------------------------------------------------------
   7. RESUME ACTIONS (PRINT & DIRECT NAVIGATION)
   -------------------------------------------------------------------------- */
function initResumeActions() {
  const printBtn = document.getElementById('print-resume-btn');
  const resumeQuickBtn = document.getElementById('resume-quick-btn');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (resumeQuickBtn) {
    resumeQuickBtn.addEventListener('click', () => {
      const resumeSection = document.getElementById('resume');
      if (resumeSection) {
        resumeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Dynamically load & parse resume directly from resume.tex
  loadResumeFromTeX();
}

/**
 * Dynamically fetches and parses resume.tex directly into the HTML DOM.
 * Any edits made to resume.tex will automatically reflect on the website.
 */
async function loadResumeFromTeX() {
  const sheet = document.getElementById('ats-resume-sheet');
  const toolbarLeft = document.querySelector('.toolbar-left');
  if (!sheet) return;

  let texContent = null;

  // 1. Try fetching from network (cache-busted, relative and root paths)
  const paths = ['./resume.tex?t=' + Date.now(), '/resume.tex', './resume.tex'];
  for (const path of paths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const text = await res.text();
        if (text && text.includes('\\begin{document}')) {
          texContent = text;
          break;
        }
      }
    } catch (e) {
      // Continue to next path or fallback
    }
  }

  // 2. Fallback to embedded raw LaTeX string from PORTFOLIO_CONFIG
  if (!texContent && typeof PORTFOLIO_CONFIG !== 'undefined' && PORTFOLIO_CONFIG.resumeTex) {
    texContent = PORTFOLIO_CONFIG.resumeTex;
  }

  // 3. Render parsed HTML
  if (texContent) {
    try {
      const parsedHtml = parseLaTeXResume(texContent);
      if (parsedHtml) {
        sheet.innerHTML = parsedHtml;
        if (toolbarLeft && !document.getElementById('tex-sync-badge')) {
          const badge = document.createElement('span');
          badge.id = 'tex-sync-badge';
          badge.style.fontSize = '0.72rem';
          badge.style.padding = '0.15rem 0.5rem';
          badge.style.borderRadius = '999px';
          badge.style.background = 'rgba(16, 185, 129, 0.15)';
          badge.style.color = '#10b981';
          badge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
          badge.style.marginLeft = '0.5rem';
          badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Linked to resume.tex';
          toolbarLeft.appendChild(badge);
        }
        return;
      }
    } catch (parseErr) {
      console.error('LaTeX parsing error:', parseErr);
    }
  }

  // 4. If all fail (e.g. raw file protocol without config)
  sheet.innerHTML = `
    <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #f59e0b; margin-bottom: 1rem; display: block;"></i>
      <h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 0.5rem;">Resume Loading Error</h3>
      <p style="max-width: 520px; margin: 0 auto 1rem; font-size: 0.88rem; line-height: 1.6;">
        Could not load resume.tex source. Please check network connectivity or refresh the page.
      </p>
    </div>
  `;
}

function extractBalancedBrace(str, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) return { content: str.substring(startIndex + 1, i), endIndex: i };
    }
  }
  return null;
}

function extractArgs(str, startIndex, count) {
  const args = [];
  let cur = startIndex;
  for (let i = 0; i < count; i++) {
    const open = str.indexOf('{', cur);
    if (open === -1) break;
    const res = extractBalancedBrace(str, open);
    if (!res) break;
    args.push(res.content);
    cur = res.endIndex + 1;
  }
  return { args, nextIndex: cur };
}

function parseTexBullets(chunk) {
  const bullets = [];
  const regex = /\\resumeItem\s*\{/g;
  let match;
  while ((match = regex.exec(chunk)) !== null) {
    const openBrace = match.index + match[0].length - 1;
    const res = extractBalancedBrace(chunk, openBrace);
    if (res) {
      bullets.push(formatTexInline(res.content.trim()));
      regex.lastIndex = res.endIndex + 1;
    }
  }
  return bullets;
}

function formatTexInline(str) {
  if (!str) return '';
  let out = str;

  // LaTeX escapes & spacing
  out = out.replace(/\\&/g, '&');
  out = out.replace(/\\\$/g, '$');
  out = out.replace(/\\%/g, '%');
  out = out.replace(/\\hspace\{[^}]+\}/g, ' ');
  out = out.replace(/\\vspace\{[^}]+\}/g, '');
  out = out.replace(/---/g, '—').replace(/--/g, '–');
  out = out.replace(/\\quad/g, ' ');
  out = out.replace(/\\ /g, ' ');

  // Math symbols
  out = out.replace(/\$\\tanh\$/g, 'tanh');
  out = out.replace(/\$O\(1\)\$/g, 'O(1)');
  out = out.replace(/\$([^$]+)\$/g, '$1');

  // FontAwesome Icons
  out = out.replace(/\\faExternalLink\*/g, '<i class="fa-solid fa-arrow-up-right-from-square"></i>');
  out = out.replace(/\\faExternalLink/g, '<i class="fa-solid fa-arrow-up-right-from-square"></i>');
  out = out.replace(/\\faPhone\\?/g, '<i class="fa-solid fa-phone"></i>');
  out = out.replace(/\\faEnvelope\\?/g, '<i class="fa-solid fa-envelope"></i>');
  out = out.replace(/\\faLinkedin\\?/g, '<i class="fa-brands fa-linkedin"></i>');
  out = out.replace(/\\faGithub\\?/g, '<i class="fa-brands fa-github"></i>');
  out = out.replace(/\\faCodeBranch\\?/g, '<i class="fa-solid fa-code-branch"></i>');
  out = out.replace(/\\faCode\\?/g, '<i class="fa-solid fa-code"></i>');

  // Parse macros using balanced braces
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 20) {
    changed = false;
    iterations++;

    // 1. \href{url}{text}
    const hrefIdx = out.indexOf('\\href');
    if (hrefIdx !== -1) {
      const b1 = out.indexOf('{', hrefIdx + 4);
      if (b1 !== -1) {
        const r1 = extractBalancedBrace(out, b1);
        if (r1) {
          const b2 = out.indexOf('{', r1.endIndex + 1);
          if (b2 !== -1 && b2 === r1.endIndex + 1) {
            const r2 = extractBalancedBrace(out, b2);
            if (r2) {
              const url = r1.content.trim();
              const txt = formatTexInline(r2.content);
              out = out.substring(0, hrefIdx) + `<a href="${url}" target="_blank" rel="noopener noreferrer">${txt}</a>` + out.substring(r2.endIndex + 1);
              changed = true;
              continue;
            }
          }
        }
      }
    }

    // 2. \textbf{...}
    const tbIdx = out.indexOf('\\textbf');
    if (tbIdx !== -1) {
      const b = out.indexOf('{', tbIdx + 6);
      if (b !== -1) {
        const r = extractBalancedBrace(out, b);
        if (r) {
          out = out.substring(0, tbIdx) + `<strong>${formatTexInline(r.content)}</strong>` + out.substring(r.endIndex + 1);
          changed = true;
          continue;
        }
      }
    }

    // 3. \textit{...} or \emph{...}
    const itMatch = out.match(/\\(textit|emph)/);
    if (itMatch) {
      const itIdx = itMatch.index;
      const b = out.indexOf('{', itIdx + itMatch[0].length);
      if (b !== -1) {
        const r = extractBalancedBrace(out, b);
        if (r) {
          out = out.substring(0, itIdx) + `<em>${formatTexInline(r.content)}</em>` + out.substring(r.endIndex + 1);
          changed = true;
          continue;
        }
      }
    }

    // 4. \underline{...}
    const ulIdx = out.indexOf('\\underline');
    if (ulIdx !== -1) {
      const b = out.indexOf('{', ulIdx + 9);
      if (b !== -1) {
        const r = extractBalancedBrace(out, b);
        if (r) {
          out = out.substring(0, ulIdx) + formatTexInline(r.content) + out.substring(r.endIndex + 1);
          changed = true;
          continue;
        }
      }
    }

    // 5. \texttt{...}
    const ttIdx = out.indexOf('\\texttt');
    if (ttIdx !== -1) {
      const b = out.indexOf('{', ttIdx + 6);
      if (b !== -1) {
        const r = extractBalancedBrace(out, b);
        if (r) {
          out = out.substring(0, ttIdx) + `<code>${formatTexInline(r.content)}</code>` + out.substring(r.endIndex + 1);
          changed = true;
          continue;
        }
      }
    }
  }

  return out;
}

function parseLaTeXResume(tex) {
  // Strip comments (lines beginning with %)
  const lines = tex.split('\n').filter(line => !line.trim().startsWith('%'));
  const cleanTex = lines.join('\n');

  let html = '';

  // 1. Heading block (\begin{center} ... \end{center})
  const centerMatch = cleanTex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (centerMatch) {
    const headerBlock = centerMatch[1];
    const nameMatch = headerBlock.match(/\{\\(?:Huge|LARGE|Large)\s*\\scshape\s*([^}]+)\}/);
    const name = nameMatch ? nameMatch[1].trim() : 'TANISH PAL';

    const subMatch = headerBlock.match(/\{\\small\s*\\textit\{([^}]+)\}\}/);
    const subtitle = subMatch ? formatTexInline(subMatch[1]) : '';

    const contactLinks = [];
    const hrefRegex = /\\href\{([^}]+)\}\{([^}]+)\}/g;
    let hMatch;
    while ((hMatch = hrefRegex.exec(headerBlock)) !== null) {
      const url = hMatch[1].trim();
      const text = formatTexInline(hMatch[2].trim());
      contactLinks.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
    }

    html += `
      <div class="ats-header">
        <h1 class="ats-name">${name.toUpperCase()}</h1>
        ${subtitle ? `<div class="ats-subtitle">${subtitle}</div>` : ''}
        <div class="ats-contact-bar">
          ${contactLinks.join(' <span>&bull;</span> ')}
        </div>
      </div>
    `;
  }

  // 2. Sections (\section{...})
  const sectionSplitRegex = /\\section\{([^}]+)\}/g;
  let matches = [];
  let sMatch;
  while ((sMatch = sectionSplitRegex.exec(cleanTex)) !== null) {
    matches.push({ title: sMatch[1], index: sMatch.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const startIndex = cur.index + cur.title.length + 9;
    const endIndex = (i + 1 < matches.length) ? matches[i + 1].index : cleanTex.length;
    const secBody = cleanTex.substring(startIndex, endIndex);

    const titleClean = formatTexInline(cur.title).toUpperCase();
    html += `<div class="ats-section">\n  <h2 class="ats-section-title">${titleClean}</h2>\n`;

    // Subheadings (\resumeSubheading)
    const shRegex = /\\resumeSubheading\s*\{/g;
    let shMatch;
    let hasSubheadings = false;
    while ((shMatch = shRegex.exec(secBody)) !== null) {
      hasSubheadings = true;
      const { args, nextIndex } = extractArgs(secBody, shMatch.index + 16, 4);

      if (args.length >= 3) {
        const schoolOrCompany = formatTexInline(args[0]);
        const date = formatTexInline(args[1]);
        const degreeOrRole = formatTexInline(args[2]);
        const loc = args[3] ? formatTexInline(args[3]) : '';

        html += `
        <div class="ats-item">
          <div class="ats-row">
            <strong>${schoolOrCompany}</strong>
            <span>${date}</span>
          </div>
          <div class="ats-sub">${degreeOrRole}${loc ? ` &bull; ${loc}` : ''}</div>
        `;

        const afterSh = secBody.substring(nextIndex);
        const nextIdx = afterSh.search(/\\resumeSubheading|\\resumeProjectHeading|\\end\{itemize\}/);
        const chunk = nextIdx !== -1 ? afterSh.substring(0, nextIdx) : afterSh;

        const bullets = parseTexBullets(chunk);
        if (bullets.length) {
          html += `  <ul class="ats-bullets">\n`;
          bullets.forEach(b => { html += `    <li>${b}</li>\n`; });
          html += `  </ul>\n`;
        }
        html += `</div>\n`;
        shRegex.lastIndex = nextIndex;
      }
    }

    // Project Headings (\resumeProjectHeading)
    const phRegex = /\\resumeProjectHeading\s*\{/g;
    let phMatch;
    while ((phMatch = phRegex.exec(secBody)) !== null) {
      const { args, nextIndex } = extractArgs(secBody, phMatch.index + 20, 2);

      if (args.length >= 2) {
        const leftCol = formatTexInline(args[0]);
        const rightCol = formatTexInline(args[1]);

        html += `
        <div class="ats-item">
          <div class="ats-row">
            <div>${leftCol}</div>
            <span class="ats-links">${rightCol}</span>
          </div>
        `;

        const afterPh = secBody.substring(nextIndex);
        const nextIdx = afterPh.search(/\\resumeProjectHeading|\\resumeSubheading|\\end\{itemize\}/);
        const chunk = nextIdx !== -1 ? afterPh.substring(0, nextIdx) : afterPh;

        const bullets = parseTexBullets(chunk);
        if (bullets.length) {
          html += `  <ul class="ats-bullets">\n`;
          bullets.forEach(b => { html += `    <li>${b}</li>\n`; });
          html += `  </ul>\n`;
        }
        html += `</div>\n`;
        phRegex.lastIndex = nextIndex;
      }
    }

    // General itemize lists (like Technical Skills or standalone items)
    if (!hasSubheadings && !secBody.includes('\\resumeProjectHeading')) {
      const skillRegex = /\\item\s*\\textbf\{([^}]+)\}\s*\{:?\s*([^}]+)\}/g;
      let skMatch;
      let skillItems = [];
      while ((skMatch = skillRegex.exec(secBody)) !== null) {
        skillItems.push(`<div><strong>${formatTexInline(skMatch[1])}:</strong> ${formatTexInline(skMatch[2])}</div>`);
      }

      if (skillItems.length) {
        html += `  <div class="ats-skills-body">\n    ${skillItems.join('\n    ')}\n  </div>\n`;
      } else {
        const bullets = parseTexBullets(secBody);
        if (bullets.length) {
          html += `  <ul class="ats-bullets">\n`;
          bullets.forEach(b => { html += `    <li>${b}</li>\n`; });
          html += `  </ul>\n`;
        }
      }
    }

    html += `</div>\n`;
  }

  return html;
}


/* --------------------------------------------------------------------------
   8. CONTACT FORM, CLIPBOARD COPY & TOASTS
   -------------------------------------------------------------------------- */
function showToast(message, icon = 'fa-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon} text-cyan"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3200);
}

function copyToClipboard(text, label = 'Copied') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(`${label} copied to clipboard!`))
      .catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(`${label} copied to clipboard!`);
}

function initContactAndClipboard() {
  // Copy buttons
  const copyBtns = document.querySelectorAll('.copy-btn, #copy-email-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy') || 'tanish.pal.biz@gmail.com';
      copyToClipboard(copyVal, copyVal.includes('@') ? 'Email' : 'Contact');
    });
  });

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'fa-triangle-exclamation');
        return;
      }

      // Generate mailto link
      const mailtoUrl = `mailto:tanish.pal.biz@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Tanish,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
      
      showToast('Opening your email client...', 'fa-paper-plane');
      window.location.href = mailtoUrl;

      contactForm.reset();
    });
  }
}

// Utility
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
