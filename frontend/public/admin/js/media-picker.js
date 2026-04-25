(function () {
  var modal = document.getElementById('adminMediaPickerModal');
  if (!modal) return;

  var grid = document.getElementById('adminMediaPickerGrid');
  var searchInput = document.getElementById('adminMediaPickerSearch');
  var searchButton = document.getElementById('adminMediaPickerSearchBtn');
  var loadMoreButton = document.getElementById('adminMediaPickerLoadMore');
  var statusNode = document.getElementById('adminMediaPickerStatus');
  var paginationNode = document.getElementById('adminMediaPickerPagination');
  var activeInput = null;
  var activePreview = null;
  var state = {
    page: 1,
    pageSize: 24,
    hasMore: false,
    totalItems: 0,
    query: '',
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setStatus(message) {
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  function updateMeta() {
    if (paginationNode) {
      paginationNode.textContent = 'Page ' + state.page + (state.hasMore ? ' (more available)' : '');
    }
    if (loadMoreButton) {
      loadMoreButton.disabled = !state.hasMore;
      loadMoreButton.textContent = state.hasMore ? 'Load more' : 'No more images';
    }
  }

  function openModal() {
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
      window.jQuery(modal).modal('show');
      return;
    }
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  function closeModal() {
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
      window.jQuery(modal).modal('hide');
      return;
    }
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  function renderItems(items, append) {
    if (!grid) return;

    if (!Array.isArray(items) || !items.length) {
      if (!append) {
        grid.innerHTML = '<div class="text-muted">No images found.</div>';
      }
      updateMeta();
      return;
    }

    var html = items.map(function (item) {
      var title = escapeHtml(item.title || 'Untitled');
      var filename = escapeHtml(item.filename || '');
      var previewUrl = escapeHtml(item.previewUrl || item.publicUrl || '');
      var publicUrl = escapeHtml(item.publicUrl || item.previewUrl || '');
      return ''
        + '<article class="admin-media-picker-card">'
        + '  <img src="' + previewUrl + '" alt="' + title + '">'
        + '  <strong class="d-block mt-2 small">' + title + '</strong>'
        + '  <small class="d-block text-muted text-truncate">' + filename + '</small>'
        + '  <button type="button" class="btn btn-sm btn-outline-primary btn-block mt-2 admin-media-picker-select" data-value="' + publicUrl + '" data-preview="' + previewUrl + '">Use image</button>'
        + '</article>';
    }).join('');

    grid.innerHTML = append ? grid.innerHTML + html : html;
    updateMeta();
  }

  async function fetchImages(append) {
    state.query = searchInput && searchInput.value ? searchInput.value.trim() : '';
    if (!append) {
      state.page = 1;
    }
    setStatus('Loading images...');

    var response = await fetch(
      '/admin/mediahub/actions/images?q=' + encodeURIComponent(state.query)
      + '&page=' + encodeURIComponent(state.page)
      + '&pageSize=' + encodeURIComponent(state.pageSize)
    );
    var payload = await response.json().catch(function () { return {}; });
    if (!response.ok || payload.success === false) {
      throw new Error((payload.error && payload.error.message) || 'Media search failed.');
    }

    var data = payload.data || {};
    var pagination = data.pagination || {};
    var items = Array.isArray(data.items) ? data.items : [];
    state.page = Number(pagination.page) || state.page;
    state.hasMore = Boolean(pagination.hasMore);
    state.totalItems = Number(pagination.totalItems || items.length);
    renderItems(items, append);
    setStatus(state.totalItems ? ('Showing images from Media Hub (' + state.totalItems + ' total).') : 'No matching images found.');
  }

  function resolveTarget(button) {
    var inputSelector = button.getAttribute('data-media-picker-input');
    var previewSelector = button.getAttribute('data-media-picker-preview');
    activeInput = inputSelector ? document.querySelector(inputSelector) : null;
    activePreview = previewSelector ? document.querySelector(previewSelector) : null;

    if (!activeInput) {
      var field = button.closest('[data-media-picker-field]');
      activeInput = field ? field.querySelector('[data-media-picker-value]') : null;
      activePreview = field ? field.querySelector('[data-media-picker-preview-image]') : activePreview;
    }
  }

  document.addEventListener('click', function (event) {
    var openButton = event.target.closest('[data-media-picker-open]');
    if (openButton) {
      resolveTarget(openButton);
      if (!activeInput) {
        setStatus('No image field was found for this picker button.');
        return;
      }
      openModal();
      fetchImages(false).catch(function (error) {
        setStatus(error.message);
      });
      return;
    }

    var clearButton = event.target.closest('[data-media-picker-clear]');
    if (clearButton) {
      var field = clearButton.closest('[data-media-picker-field]');
      var input = field ? field.querySelector('[data-media-picker-value]') : null;
      var preview = field ? field.querySelector('[data-media-picker-preview-image]') : null;
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (preview) {
        preview.removeAttribute('src');
        preview.classList.add('d-none');
      }
      return;
    }

    var selectButton = event.target.closest('.admin-media-picker-select');
    if (selectButton && activeInput) {
      var value = selectButton.getAttribute('data-value') || '';
      var previewUrl = selectButton.getAttribute('data-preview') || value;
      activeInput.value = value;
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.dispatchEvent(new Event('change', { bubbles: true }));
      if (activePreview) {
        activePreview.src = previewUrl;
        activePreview.classList.remove('d-none');
      }
      closeModal();
    }
  });

  if (searchButton) {
    searchButton.addEventListener('click', function () {
      fetchImages(false).catch(function (error) {
        setStatus(error.message);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        fetchImages(false).catch(function (error) {
          setStatus(error.message);
        });
      }
    });
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function () {
      if (!state.hasMore) return;
      state.page += 1;
      fetchImages(true).catch(function (error) {
        setStatus(error.message);
      });
    });
  }
})();
