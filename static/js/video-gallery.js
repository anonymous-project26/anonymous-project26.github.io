(function () {
  'use strict';

  const data = window.DEXCOACH_VIDEOS;
  const state = { mode: 'seen', selectedId: data.seen[0].id, testIndex: 0 };

  const elements = {
    modeSelect: document.getElementById('mode-select'),
    itemSelect: document.getElementById('item-select'),
    itemSelectLabel: document.getElementById('item-select-label'),
    videoGrid: document.getElementById('video-grid')
  };

  function currentItems() {
    return state.mode === 'seen' ? data.seen : data.unseen;
  }

  function currentSelection() {
    return currentItems().find((item) => item.id === state.selectedId) || currentItems()[0];
  }

  function chooseRandomTest() {
    const selected = currentSelection();
    if (state.mode === 'seen' && selected.videos.length > 1) {
      let nextIndex = Math.floor(Math.random() * selected.videos.length);
      if (nextIndex === state.testIndex) {
        nextIndex = (nextIndex + 1) % selected.videos.length;
      }
      state.testIndex = nextIndex;
    } else {
      state.testIndex = 0;
    }
  }

  function populateItemSelect() {
    const items = currentItems();
    elements.itemSelect.replaceChildren();
    elements.itemSelectLabel.textContent = state.mode === 'seen' ? 'Shape' : 'Object';

    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = state.mode === 'seen' ? item.label : item.name;
      elements.itemSelect.appendChild(option);
    });

    elements.itemSelect.value = state.selectedId;
  }

  function renderVideo() {
    const selected = currentSelection();
    const videoInfo = state.mode === 'seen'
      ? selected.videos[state.testIndex]
      : { label: 'Test video', src: selected.src };

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

    card.appendChild(video);
    elements.videoGrid.appendChild(card);
  }

  function render() {
    populateItemSelect();
    renderVideo();
  }

  elements.modeSelect.addEventListener('change', function () {
    state.mode = elements.modeSelect.value;
    state.selectedId = currentItems()[0].id;
    chooseRandomTest();
    render();
  });

  elements.itemSelect.addEventListener('change', function () {
    state.selectedId = elements.itemSelect.value;
    chooseRandomTest();
    render();
  });

  chooseRandomTest();
  render();
}());
