(function () {
  'use strict';

  const data = window.DEXCOACH_VIDEOS;
  const state = { mode: 'seen', selectedId: data.seen[0].id, testIndex: 0 };

  const elements = {
    modeSelect: document.getElementById('mode-select'),
    itemSelect: document.getElementById('item-select'),
    itemSelectLabel: document.getElementById('item-select-label'),
    testSelect: document.getElementById('test-select'),
    testSelectField: document.getElementById('test-select-field'),
    controlHint: document.getElementById('control-hint'),
    videoHeading: document.getElementById('video-heading'),
    videoCount: document.getElementById('video-count'),
    selectionDescription: document.getElementById('selection-description'),
    videoGrid: document.getElementById('video-grid')
  };

  function currentItems() {
    return state.mode === 'seen' ? data.seen : data.unseen;
  }

  function currentSelection() {
    return currentItems().find((item) => item.id === state.selectedId) || currentItems()[0];
  }

  function populateItemSelect() {
    const items = currentItems();
    elements.itemSelect.replaceChildren();
    elements.itemSelectLabel.textContent = state.mode === 'seen' ? 'Shape' : 'Object';

    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = state.mode === 'seen' ? item.label : item.label + ' — ' + item.name;
      elements.itemSelect.appendChild(option);
    });

    elements.itemSelect.value = state.selectedId;
  }

  function populateTestSelect() {
    const selected = currentSelection();
    elements.testSelect.replaceChildren();

    if (state.mode !== 'seen') {
      elements.testSelectField.classList.add('is-hidden');
      return;
    }

    elements.testSelectField.classList.remove('is-hidden');
    selected.videos.forEach((videoInfo, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = videoInfo.label;
      elements.testSelect.appendChild(option);
    });
    elements.testSelect.value = String(state.testIndex);
  }

  function renderVideo() {
    const selected = currentSelection();
    const videoInfo = state.mode === 'seen'
      ? selected.videos[state.testIndex]
      : { label: 'Test video', src: selected.src };

    elements.videoHeading.textContent = selected.label;
    elements.videoCount.textContent = state.mode === 'seen'
      ? videoInfo.label
      : '1 video';
    elements.selectionDescription.textContent = state.mode === 'seen'
      ? 'One video shown at a time. Use the Testing dropdown to switch clips.'
      : selected.name;
    elements.controlHint.textContent = state.mode === 'seen'
      ? selected.videos.length + ' testing videos available for this shape.'
      : 'One testing video available for this object.';
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
    populateItemSelect();
    populateTestSelect();
    renderVideo();
  }

  elements.modeSelect.addEventListener('change', function () {
    state.mode = elements.modeSelect.value;
    state.selectedId = currentItems()[0].id;
    state.testIndex = 0;
    render();
  });

  elements.itemSelect.addEventListener('change', function () {
    state.selectedId = elements.itemSelect.value;
    state.testIndex = 0;
    render();
  });

  elements.testSelect.addEventListener('change', function () {
    state.testIndex = Number(elements.testSelect.value);
    render();
  });

  render();
}());
