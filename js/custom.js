document.addEventListener('DOMContentLoaded', () => {
  initChapterCards();
});

// 支持 PJAX 页面切换
document.addEventListener('pjax:complete', () => {
  initChapterCards();
});

function initChapterCards() {
  // 1. 处理导航小卡片点击事件：自动展开对应的章节折叠卡片并平滑滚动
  const navCards = document.querySelectorAll('.chapter-nav-card, a.chapter-jump-btn');
  navCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const href = card.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          if (target.tagName === 'DETAILS') {
            target.open = true;
          } else {
            const parentDetails = target.closest('details');
            if (parentDetails) parentDetails.open = true;
          }

          // 触发 MathJax 渲染
          if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([target]).catch(() => {});
          }

          // 平滑滚动至目标
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // 高亮闪烁反馈
          target.style.transition = 'box-shadow 0.3s ease';
          target.style.boxShadow = '0 0 0 3px rgba(0, 196, 182, 0.5)';
          setTimeout(() => {
            target.style.boxShadow = '';
          }, 1500);
        }
      }
    });
  });

  // 2. 监听所有章节折叠卡片的 toggle 事件，展开时触发 MathJax 补排
  const detailBoxes = document.querySelectorAll('details.chapter-box');
  detailBoxes.forEach(box => {
    box.addEventListener('toggle', () => {
      if (box.open && window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([box]).catch(() => {});
      }
    });
  });

  // 3. 一键全部展开 / 全部收起控制按钮
  const ctrlBtns = document.querySelectorAll('.chapter-ctrl-btn');
  ctrlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentSection = btn.closest('.chapter-section-wrap') || document;
      const boxes = parentSection.querySelectorAll('details.chapter-box');
      const shouldOpen = btn.getAttribute('data-action') !== 'collapse';

      boxes.forEach(box => {
        box.open = shouldOpen;
      });

      if (shouldOpen) {
        btn.setAttribute('data-action', 'collapse');
        btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> 一键全部收起';
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise().catch(() => {});
        }
      } else {
        btn.setAttribute('data-action', 'expand');
        btn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> 一键全部展开';
      }
    });
  });
}
