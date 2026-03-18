/**
 * Initializes the tag editor, providing functionality to render tag pills and handle tag input.
 * @param {Object} ui - The UI elements.
 * @param {Function} onUpdate - Callback function triggered when tags are updated.
 * @return {Object} An object containing renderPills and setTags functions.
 */
export function initTagEditor(ui, onUpdate) {
  let tagsSchema = null;
  /**
   * Fetches the tag schema from a JSON file.
   * @return {Promise<Object>} The tags schema.
   */
  const fetchSchema = async () => {
    if (!tagsSchema) {
      const locale = window.CURRENT_LOCALE || 'en';
      tagsSchema = await (await fetch(`/${locale}/tags-schema.json`)).json();
    }
    return tagsSchema;
  };

  /**
   * Renders the current tags as pills in the UI.
   */
  const renderPills = () => {
    ui.tagPills.innerHTML = '';
    const tags = ui.getTags();
    tags.forEach((tag) => {
      const pill = document.createElement('div');
      pill.className = 'tag-pill';
      pill.textContent = tag;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-tag';
      removeBtn.innerHTML = '&times;';
      removeBtn.onclick = () => {
        const newTags = tags.filter((t) => t !== tag);
        ui.tagsInput.value = newTags.join(', ');
        renderPills();
        onUpdate();
      };
      pill.appendChild(removeBtn);
      ui.tagPills.appendChild(pill);
    });
  };

  ui.tagInput.onkeydown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = ui.tagInput.value.trim().replace(/,/g, '');
      if (val) {
        if (ui.aiOnlyExistingTagsToggle.checked) {
          const schema = await fetchSchema();
          const existingTags = schema.properties.tags.items.enum;
          if (!existingTags.includes(val)) {
            const msg = `Only existing tags are allowed: ${existingTags.join(', ')}`;
            import('../utils/dialog-utils.js').then((m) => {
              m.customAlert(ui, msg);
            });
            return;
          }
        }
        const tags = ui.getTags();
        if (!tags.includes(val)) {
          tags.push(val);
          ui.tagsInput.value = tags.join(', ');
          renderPills();
          onUpdate();
        }
        ui.tagInput.value = '';
      }
    }
  };

  return {
    renderPills,
    setTags: (tagsString) => {
      ui.tagsInput.value = tagsString;
      renderPills();
    },
  };
}
