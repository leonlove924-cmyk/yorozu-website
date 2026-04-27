/* =============================================
   生活支援代行サービス - メインスクリプト
   ============================================= */

// ローディング画面
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.add('hidden');
  }, 2200);
});

// ヘッダースクロール処理
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    header.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
});

// ハンバーガーメニュー
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// ナビリンクをクリックしたらメニューを閉じる
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// スクロールアニメーション
const animateElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// 料金表タブ
const priceTabs = document.querySelectorAll('.price-tab');
const pricePanels = document.querySelectorAll('.price-panel');

const tabMap = {
  'misc': 'tab-misc',
  'garden': 'tab-garden',
  'junk': 'tab-junk',
  'cleaning': 'tab-cleaning',
  'vacant': 'tab-vacant',
  'furniture': 'tab-furniture',
  'investigation': 'tab-investigation',
  'agency': 'tab-agency',
  'estate': 'tab-estate',
  'travel': 'tab-travel'
};

priceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    priceTabs.forEach(t => t.classList.remove('active'));
    pricePanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = tabMap[tab.dataset.tab];
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  });
});

// お問い合わせフォーム送信
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const service = form.service.value;
  const message = form.message.value;

  // Gmailリンクを生成
  const subject = encodeURIComponent(`【お問い合わせ】${name}様より`);
  const body = encodeURIComponent(
    `お名前: ${name}\n` +
    `メールアドレス: ${email}\n` +
    (form.phone.value ? `電話番号: ${form.phone.value}\n` : '') +
    (service ? `ご希望のサービス: ${service}\n` : '') +
    `\nお問い合わせ内容:\n${message}`
  );

  const mailtoLink = `mailto:japan.yorozu.sien@gmail.com?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;

  // 送信完了メッセージ
  showSuccessMessage();
}

function showSuccessMessage() {
  const existing = document.querySelector('.success-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>メールアプリが開きます。送信をお願いします。</span>
  `;
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: #1a4b8c; color: white; padding: 14px 24px;
    border-radius: 50px; font-size: 0.9rem; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999; animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// スムーズスクロール（ナビリンク）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerHeight = 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// アクティブナビリンク
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header-nav a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    if (
      scrollPos >= section.offsetTop &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${section.id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
});

// アクティブナビスタイル追加
const style = document.createElement('style');
style.textContent = `
  .header-nav a.active-nav {
    color: var(--primary);
    background: rgba(26,75,140,0.07);
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);

// 電話番号のクリックトラッキング（アナリティクス用）
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    console.log('電話番号クリック:', link.href);
    // Google Analytics等のトラッキングコードをここに追加可能
  });
});
