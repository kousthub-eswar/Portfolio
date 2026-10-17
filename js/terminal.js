/* ============================================================
   TERMINAL.JS — INTERACTIVE DEVELOPER TERMINAL & COMMAND PALETTE
   Supports live bash execution, boot telemetry, quick action
   chips, and global Ctrl+K Command Palette navigation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. HERO INTERACTIVE TERMINAL
  // ============================================================
  const termBody = document.getElementById('terminal-output');
  const termInput = document.getElementById('terminal-input');
  const termForm = document.getElementById('terminal-form');

  if (termBody && termInput && termForm) {
    const commands = {
      help: () => `
<span class="term-cyan">Available commands:</span>
  <span class="term-yellow">skills</span>     - View technical stack & languages
  <span class="term-yellow">projects</span>   - List featured deployed projects
  <span class="term-yellow">resume</span>     - Download Kousthub's latest PDF resume
  <span class="term-yellow">contact</span>    - Show direct email, phone & social handles
  <span class="term-yellow">whoami</span>     - Inspect current terminal session
  <span class="term-yellow">hire</span>       - Jump straight to contact message form
  <span class="term-yellow">clear</span>      - Clear terminal console screen
`,
      skills: () => `
<span class="term-cyan">Technical Stack & Competencies:</span>
  <span class="term-green">Strong:</span> Java, SQL
  <span class="term-green">Comfortable:</span> React 19, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL, Supabase, Tailwind, DSA, OOP
  <span class="term-green">Familiar:</span> Python (basic), C++, Vitest, SQLite, Git, GitHub
`,
      projects: () => `
<span class="term-cyan">Featured Deployed Projects:</span>
  <span class="term-magenta">[01] BillMate:</span> POS & Retail PWA with Atomic PostgreSQL RPCs (create_sale)
  <span class="term-magenta">[02] TuneSense:</span> Explainable Music Recommendation System (6+ Strategies, 14 Models)
  <span class="term-magenta">[03] Campus ClubHub:</span> Role-Segregated Event Portal with QR-Style Event Passes
  <span class="term-magenta">[04] Audit Analytics:</span> Forensic Anomaly Detection on 8,000 Synthetic Txns ($13.75M)
  <span class="term-muted">Type 'view &lt;number&gt;' or click below to inspect.</span>
`,
      resume: () => {
        const link = document.createElement('a');
        link.href = 'assets/resume.pdf';
        link.download = 'Kousthub_Resume.pdf';
        link.click();
        return `<span class="term-green">✔ Initiating download: Kousthub_Resume.pdf...</span>`;
      },
      contact: () => `
<span class="term-cyan">Direct Contact Channels:</span>
  • <span class="term-yellow">Email:</span> <a href="mailto:kousthubeswar@gmail.com" class="term-link">kousthubeswar@gmail.com</a>
  • <span class="term-yellow">Phone:</span> <a href="tel:+917204048727" class="term-link">+91 7204048727</a>
  • <span class="term-yellow">LinkedIn:</span> <a href="https://linkedin.com/in/kousthub-eswar" target="_blank" class="term-link">linkedin.com/in/kousthub-eswar</a>
  • <span class="term-yellow">GitHub:</span> <a href="https://github.com/kousthub-eswar" target="_blank" class="term-link">github.com/kousthub-eswar</a>
`,
      whoami: () => `<span class="term-green">guest_developer@vit-vellore:~$ (Authenticated Visitor)</span>`,
      hire: () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
        return `<span class="term-green">🚀 Teleporting to contact console... Let's build!</span>`;
      },
      clear: () => {
        termBody.innerHTML = '';
        return null;
      }
    };

    function appendOutput(cmd, res) {
      if (cmd !== null) {
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">kousthub:~$</span> <span class="term-cmd-text">${escapeHtml(cmd)}</span>`;
        termBody.appendChild(line);
      }

      if (res) {
        const out = document.createElement('div');
        out.className = 'term-response';
        out.innerHTML = res;
        termBody.appendChild(out);
      }

      termBody.scrollTop = termBody.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function runCommand(raw) {
      const trimmed = raw.trim().toLowerCase();
      if (!trimmed) return;

      if (trimmed === 'clear') {
        commands.clear();
        return;
      }

      if (commands[trimmed]) {
        appendOutput(raw, commands[trimmed]());
      } else if (trimmed.startsWith('view ')) {
        const num = trimmed.replace('view ', '').trim();
        const map = { '1': 'billmate', '2': 'tunesense', '3': 'clubhub', '4': 'auditanalytics' };
        if (map[num]) {
          const btn = document.querySelector(`.open-modal-btn[data-modal="${map[num]}"]`);
          if (btn) btn.click();
          appendOutput(raw, `<span class="term-green">✔ Opening specs for [0${num}]...</span>`);
        } else {
          appendOutput(raw, `<span class="term-red">Project index not found. Try 'projects'.</span>`);
        }
      } else {
        appendOutput(raw, `<span class="term-red">command not found: ${escapeHtml(trimmed)}. Type <span class="term-yellow">'help'</span> for list.</span>`);
      }
    }

    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      termInput.value = '';
      runCommand(val);
    });

    // Quick chip buttons
    document.querySelectorAll('.term-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) {
          termInput.value = cmd;
          runCommand(cmd);
          termInput.value = '';
        }
      });
    });
  }

  // ============================================================
  // 2. COMMAND PALETTE (CTRL + K / CMD + K)
  // ============================================================
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdOpenBtns = document.querySelectorAll('.cmd-trigger-btn');

  if (cmdOverlay && cmdInput && cmdList) {
    function openPalette() {
      cmdOverlay.classList.add('active');
      cmdInput.value = '';
      filterPalette('');
      setTimeout(() => cmdInput.focus(), 50);
      document.body.style.overflow = 'hidden';
    }

    function closePalette() {
      cmdOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    cmdOpenBtns.forEach(btn => btn.addEventListener('click', openPalette));

    // Global Keydown
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('active')) closePalette();
        else openPalette();
      }
      if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
        closePalette();
      }
    });

    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closePalette();
    });

    const items = cmdList.querySelectorAll('.cmd-item');

    function filterPalette(query) {
      const q = query.toLowerCase().trim();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    }

    cmdInput.addEventListener('input', (e) => {
      filterPalette(e.target.value);
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        closePalette();

        if (action === 'navigate') {
          const target = document.querySelector(item.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'resume') {
          const link = document.createElement('a');
          link.href = 'assets/resume.pdf';
          link.download = 'Kousthub_Resume.pdf';
          link.click();
        } else if (action === 'audio') {
          const soundToggle = document.getElementById('sound-toggle');
          if (soundToggle) soundToggle.click();
        } else if (action === 'modal') {
          const btn = document.querySelector(`.open-modal-btn[data-modal="${item.dataset.modal}"]`);
          if (btn) btn.click();
        }
      });
    });
  }
});
