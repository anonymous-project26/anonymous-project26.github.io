(function () {
  'use strict';

  const data = window.DEXCOACH_VIDEOS;
  const state = { mode: 'seen', selectedId: data.seen[0].id, testIndex: 0 };

  const elements = {
    tabs: Array.from(document.querySelectorAll('.mode-tab')),
    listHeading: document.getElementById('list-heading'),
    listDescription: document.getElementById('list-description'),
    selectionList: document.getElementById('selection-list'),
    videoHeading: document.getElementById('video-heading'),
    videoCount: document.getElementById('video-count'),
    selectionDescription: document.getElementById('selection-description'),
    testList: document.getElementById('test-list'),
    videoGrid: document.getElementById('video-grid')
  };

  function currentItems() {
    return state.mode === 'seen' ? data.seen : data.unseen;
  }

  function currentSelection() {
    return currentItems().find((item) => item.id === state.selectedId) || currentItems()[0];
  }

  function selectMode(mode) {
    state.mode = mode;
    state.selectedId = currentItems()[0].id;
    state.testIndex = 0;
    render();
    document.getElementById('videos').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderList() {
    const items = currentItems();
    elements.listHeading.textContent = state.mode === 'seen' ? 'Seen shapes' : 'Unseen objects';
    elements.listDescription.textContent = state.mode === 'seen'
      ? 'Choose one of the ten seen shapes.'
      : 'Choose an unseen object to view its test video.';
    elements.selectionList.replaceChildren();

    items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'selection-item' + (item.id === state.selectedId ? ' is-selected' : '');
      button.setAttribute('aria-pressed', item.id === state.selectedId ? 'true' : 'false');

      const label = document.createElement('span');
      label.className = 'selection-item-label';
      label.textContent = item.label;
      button.appendChild(label);

      if (state.mode === 'seen') {
        const count = document.createElement('span');
        count.className = 'selection-item-count';
        count.textContent = item.videos.length;
        button.appendChild(count);
      } else {
        const name = document.createElement('span');
        name.className = 'selection-item-name';
        name.textContent = item.name;
        button.appendChild(name);
      }

      button.addEventListener('click', () => {
        state.selectedId = item.id;
        state.testIndex = 0;
        render();
      });
      elements.selectionList.appendChild(button);
    });
  }

  function renderTestButtons() {
    const selected = currentSelection();
    elements.testList.replaceChildren();

    if (state.mode !== 'seen') {
      elements.testList.classList.add('is-hidden');
      return;
    }

    elements.testList.classList.remove('is-hidden');
    const label = document.createElement('span');
    label.className = 'test-list-label';
    label.textContent = 'Choose a test';
    elements.testList.appendChild(label);

    selected.videos.forEach((videoInfo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'test-button' + (index === state.testIndex ? ' is-selected' : '');
      button.textContent = 'Testing ' + (index + 1);
      button.setAttribute('aria-pressed', index === state.testIndex ? 'true' : 'false');
      button.addEventListener('click', () => {
        state.testIndex = index;
        render();
      });
      elements.testList.appendChild(button);
    });
  }

  function renderVideos() {
    const selected = currentSelection();
    const videoInfo = state.mode === 'seen'
      ? selected.videos[state.testIndex]
      : { label: 'Test video', src: selected.src };

    elements.videoHeading.textContent = state.mode === 'seen' ? selected.label : selected.label;
    elements.videoCount.textContent = state.mode === 'seen'
      ? 'Testing ' + (state.testIndex + 1) + ' of ' + selected.videos.length
      : '1 video';
    elements.selectionDescription.textContent = state.mode === 'seen'
      ? selected.label + ' — ' + videoInfo.label
      : selected.name;
    elements.videoGrid.replaceChildren();

    const card = document.createElement('article');
    card.className = 'video-card';

    const video = document.createElement('video');
    video.className = 'test-video';
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.src = videoInfo.src;
    video.setAttribute('aria-label', selected.label + ' ' + videoInfo.label);

    const caption = document.createElement('div');
    caption.className = 'video-caption';
    caption.textContent = videoInfo.label;

    card.appendChild(video);
    card.appendChild(caption);
    elements.videoGrid.appendChild(card);
  }

  function render() {
    elements.tabs.forEach((tab) => {
      const active = tab.dataset.mode === state.mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    renderList();
    renderTestButtons();
    renderVideos();
  }

  elements.tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectMode(tab.dataset.mode));
  });

  render();
}());
