import attachContextMenuIcon from '../utils/attachContextMenuIcon';

function createContextMenuAction(action) {
  const li = document.createElement('li');
  li.classList.add('detail-panel-item');

  li.innerHTML = `
      <span><i class="${attachContextMenuIcon(
        action.toLowerCase(),
      )}"></i></span> ${action}   
  `;

  return li;
}

function renderContextMenu(
  currentPath,
  elcontaine,
  selectedItem,
  onNewFolderSelect,
  onNewFileSelect,
  onEditSelect,
  onRenameSelect,
  onDeleteSelect,
  onCopySelect,
  onCutSelect,
  onPasteSelect,
) {
  const contextMenu = document.getElementById('detail-panel');
  const actionListEl = document.createElement('ul');
  actionListEl.classList.add('detail-panel-items');

  const newFolderAction = createContextMenuAction('New Folder');
  newFolderAction.addEventListener('click', () => {
    contextMenu.hidden = true;
    onNewFolderSelect();
  });
  actionListEl.appendChild(newFolderAction);

  const newFileAction = createContextMenuAction('New File');
  newFileAction.addEventListener('click', () => {
    contextMenu.hidden = true;
    onNewFileSelect();
  });
  actionListEl.appendChild(newFileAction);

  if (elcontaine) {
    const pasteAction = createContextMenuAction('Paste');
    pasteAction.addEventListener('click', () => {
      contextMenu.hidden = true;
      onPasteSelect(currentPath);
    });
    actionListEl.appendChild(pasteAction);
  }

  if (selectedItem) {
    const copyAction = createContextMenuAction('Copy');
    copyAction.addEventListener('click', () => {
      contextMenu.hidden = true;
      onCopySelect(selectedItem);
    });
    actionListEl.appendChild(copyAction);

    const cutAction = createContextMenuAction('Cut');
    cutAction.addEventListener('click', () => {
      contextMenu.hidden = true;
      onCutSelect(selectedItem);
    });
    actionListEl.appendChild(cutAction);

    const { editable, renameable, deleteable } = selectedItem.attributes;

    if (editable) {
      const editFileAction = createContextMenuAction('Edit');
      editFileAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onEditSelect(selectedItem);
      });
      actionListEl.appendChild(editFileAction);
    }

    if (renameable) {
      const renameAction = createContextMenuAction('Rename');
      renameAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onRenameSelect(selectedItem);
      });
      actionListEl.appendChild(renameAction);
    }

    if (deleteable) {
      const deleteAction = createContextMenuAction('Delete');
      deleteAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onDeleteSelect(selectedItem);
      });
      actionListEl.appendChild(deleteAction);
    }
  }

  const closeAction = createContextMenuAction('Close');
  closeAction.classList.add(
    'detail-panel-item--center',
    'detail-panel-item--close',
  );
  closeAction.addEventListener('click', () => {
    contextMenu.hidden = true;
  });
  actionListEl.appendChild(closeAction);

  contextMenu.innerHTML = '';
  contextMenu.appendChild(actionListEl);
  contextMenu.hidden = false;

  contextMenu.addEventListener('click', function () {
    contextMenu.hidden = true;
  });
}

export default renderContextMenu;
