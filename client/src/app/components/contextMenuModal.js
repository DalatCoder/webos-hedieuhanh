import attachContextMenuIcon from '../utils/attachContextMenuIcon';

function renderContextMenuAction(action) {
  const li = document.createElement('li');

  li.innerHTML = `
    <li class="detail-panel-item">
      <span><i class="${attachContextMenuIcon(
        action.toLowerCase(),
      )}"></i></span> ${action}
    </li>      
  `;

  return li;
}

function renderContextMenu(
  source,
  onNewFolderSelect,
  onNewFileSelect,
  onEditSelect,
  onRenameSelect,
  onDeleteSelect,
) {
  const contextMenu = document.getElementById('detail-panel');
  const actionListEl = document.createElement('ul');
  actionListEl.classList.add('detail-panel-items');

  const newFolderAction = renderContextMenuAction('New Folder');
  newFolderAction.addEventListener('click', () => {
    contextMenu.hidden = true;
    onNewFolderSelect();
  });
  actionListEl.appendChild(newFolderAction);

  const newFileAction = renderContextMenuAction('New File');
  newFileAction.addEventListener('click', () => {
    contextMenu.hidden = true;
    onNewFileSelect();
  });
  actionListEl.appendChild(newFileAction);

  if (source) {
    const { editable, renameable, deleteable } = source.attributes;
    if (editable) {
      const editFileAction = renderContextMenuAction('Edit');
      editFileAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onEditSelect(source);
      });
      actionListEl.appendChild(editFileAction);
    }

    if (renameable) {
      const renameAction = renderContextMenuAction('Rename');
      renameAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onRenameSelect(source);
      });
      actionListEl.appendChild(renameAction);
    }

    if (deleteable) {
      const deleteAction = renderContextMenuAction('Delete');
      deleteAction.addEventListener('click', () => {
        contextMenu.hidden = true;
        onDeleteSelect(source);
      });
      actionListEl.appendChild(deleteAction);
    }
  }

  const closeAction = renderContextMenuAction('Close');
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
}

export default renderContextMenu;
