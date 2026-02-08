// Grid overlay toggle component with keyboard shortcut
// Press Cmd+Shift+G (Mac) or Ctrl+Shift+G (Windows) to toggle

(function() {
  let isVisible = false;
  const overlay = document.getElementById('grid-overlay');
  
  if (!overlay) return;

  // Calculate grid overlay based on all containers
  function updateGridOverlay() {
    const containers = document.querySelectorAll('.custom-container');
    if (containers.length === 0) {
      overlay.innerHTML = '';
      return;
    }

    let overlayHTML = '';
    
    containers.forEach((container) => {
      const el = container;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      // Get current breakpoint values
      const rootStyle = getComputedStyle(document.documentElement);
      let columns = parseInt(rootStyle.getPropertyValue('--grid-columns-sm').trim()) || 4;
      
      if (rect.width >= 1024) {
        columns = parseInt(rootStyle.getPropertyValue('--grid-columns-lg').trim()) || 12;
      } else if (rect.width >= 768) {
        columns = parseInt(rootStyle.getPropertyValue('--grid-columns-md').trim()) || 8;
      }
      
      const gap = style.gap || '0';
      const padding = style.paddingLeft || '0';
      
      // Calculate column width
      const gapValue = parseFloat(gap);
      const paddingValue = parseFloat(padding);
      const totalGaps = (columns - 1) * gapValue;
      const availableWidth = rect.width - (paddingValue * 2);
      const columnWidth = (availableWidth - totalGaps) / columns;
      
      // Create grid lines for this container
      const containerId = `grid-container-${Math.random().toString(36).substr(2, 9)}`;
      overlayHTML += `<div class="grid-container-overlay" data-container-id="${containerId}" style="top: ${rect.top + window.scrollY}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px;">`;
      
      for (let i = 0; i <= columns; i++) {
        const left = paddingValue + (i * (columnWidth + gapValue));
        overlayHTML += `<div class="grid-line" style="left: ${left}px;"></div>`;
      }
      
      overlayHTML += '</div>';
    });
    
    overlay.innerHTML = overlayHTML;
  }

  function toggleGrid() {
    isVisible = !isVisible;
    overlay.classList.toggle('hidden', !isVisible);
    
    if (isVisible) {
      updateGridOverlay();
      const updateHandler = () => {
        requestAnimationFrame(updateGridOverlay);
      };
      window.addEventListener('resize', updateHandler);
      window.addEventListener('scroll', updateHandler, true);
      
      // Store handlers for cleanup
      overlay._resizeHandler = updateHandler;
      overlay._scrollHandler = updateHandler;
    } else {
      const resizeHandler = overlay._resizeHandler;
      const scrollHandler = overlay._scrollHandler;
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler, true);
    }
  }

  // Keyboard shortcut: Cmd+Shift+G (Mac) or Ctrl+Shift+G (Windows)
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    
    if (modifier && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
      e.preventDefault();
      toggleGrid();
    }
  });
})();
