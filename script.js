// ===== 參數 =====
const header = document.getElementById('siteHeader');

// ===== 1) 導覽：平滑捲動並補償固定列高度 =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    const headerH = header.getBoundingClientRect().height;
    const top = window.scrollY + target.getBoundingClientRect().top - (headerH + 12);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== 2) 導覽高亮：觀察每個區塊 =====
const sections = ['about', 'works', 'flow', 'qa', 'contact'].map(id => document.getElementById(id));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: `-${header.offsetHeight + 20}px 0px -60% 0px`, threshold: 0 });

sections.forEach(sec => sec && observer.observe(sec));



// ===== 3) 作品展示區：共用展示區 + 分類切換 + 淡入淡出 + 滑動 =====

// 🎨 分類按鈕
const tabBtns = document.querySelectorAll('.tab-btn');

// 📸 各分類的圖片
const galleryData = {
  illust: ["images/illust1.jpg", "images/illust2.jpg", "images/illust3.jpg"],
  prop: ["images/prop1.jpg", "images/prop2.jpg", "images/prop3.jpg"],
  design: ["images/design1.jpg", "images/design2.jpg", "images/design3.jpg"]
};

// 🎞️ 共用展示元件
const panel = document.getElementById('panel-main');
const main = panel.querySelector('.ph-main');
const thumbs = panel.querySelectorAll('.ph-sq');
const dots = panel.querySelectorAll('.dots span');

// 狀態
let currentCategory = "illust";
let currentIndex = 0;

// 初始化
showImage();

// ===== 點分類切換 =====
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.target;
    if (category === currentCategory) return;

    // 切換按鈕外觀
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 更新分類與索引
    currentCategory = category;
    currentIndex = 0;

    // 顯示第一張圖
    showImage();
  });
});

// ===== 顯示當前圖片 =====
function showImage() {
  const images = galleryData[currentCategory];

  // 淡入淡出主圖
  main.style.transition = "opacity 0.5s ease";
  main.style.opacity = 0;

  setTimeout(() => {
    main.style.background = `url("${images[currentIndex]}") center/cover no-repeat`;
    main.style.opacity = 1;
  }, 250);

  // 顯示縮圖
  thumbs.forEach((t, i) => {
    t.style.background = `url("${images[i % images.length]}") center/cover no-repeat`;
  });

  // 更新 dots
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });

  // 啟用滑動
  enableSwipe(main);
}

// ===== 左右箭頭 =====
document.querySelectorAll('.carousel-arrow').forEach(arrow => {
  arrow.addEventListener('click', () => {
    if (arrow.classList.contains('left')) prevImage();
    else nextImage();
  });
});

// ===== 手機滑動換圖 =====
function enableSwipe(element) {
  let startX = 0;
  let isTouching = false;

  element.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isTouching = true;
  });

  element.addEventListener('touchmove', e => {
    if (!isTouching) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 60) {
      if (deltaX < 0) nextImage(); // 左滑
      else prevImage();            // 右滑
      isTouching = false;
    }
  });

  element.addEventListener('touchend', () => {
    isTouching = false;
  });
}

// ===== 上一張 / 下一張 =====
function nextImage() {
  const images = galleryData[currentCategory];
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prevImage() {
  const images = galleryData[currentCategory];
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}



// ===== 4) Q&A：手風琴（不變暗） =====
const qaItems = document.querySelectorAll('.qa-item');
qaItems.forEach(item => {
  const q = item.querySelector('.qa-q');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    qaItems.forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Esc 鍵關閉
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    qaItems.forEach(i => i.classList.remove('open'));
  }
});
