import renderNewFileModal from './newFileModal';
import renderNewFolderModal from './newFolderModal';
import renderDeleteModal from './deleteModal';
import attachContextMenuIcon from './utils/attachContextMenuIcon';

function handleItemSelected(itemName, itemObj, currentPath, callback) {
  const action = itemName.toLowerCase();

  switch (action) {
    case 'new folder':
      renderNewFolderModal(currentPath, callback);
      break;

    case 'new file':
      renderNewFileModal(currentPath, callback);
      break;

    case 'delete':
      renderDeleteModal(itemObj, currentPath, callback);
      break;

    default:
      alert('Invalid action!');
      break;
  }
}

export default function renderContextMenu(
  menuElementID,
  source,
  currentPath,
  callback,
) {
  const contextMenu = document.getElementById(menuElementID);
  const items = ['New Folder', 'New File'];

  if (source) {
    if (source.attributes.editable) items.push('Edit');
    items.push('Rename', 'Delete');
  }

  items.push('Close');
  // Render context menu
  const ul = document.createElement('ul');
  ul.classList.add('detail-panel-items');

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    const li = document.createElement('li');
    const html = `
        <li class="detail-panel-item">
          <span><i class="${attachContextMenuIcon(
            item.toLowerCase(),
          )}"></i></span> ${item}
        </li>    
    `;

    li.addEventListener('click', () => {
      contextMenu.hidden = true;

      if (item !== 'Close')
        handleItemSelected(item, source, currentPath, callback);
    });

    li.innerHTML = html;
    ul.appendChild(li);
  }

  const closeItem = ul.lastElementChild;
  closeItem.classList.add('detail-panel-item--center');
  closeItem.classList.add('detail-panel-item--close');

  closeItem.addEventListener('click', function handleCloseContextMenu() {
    contextMenu.hidden = true;
  });

  ul.appendChild(closeItem);

  contextMenu.innerHTML = '';
  contextMenu.appendChild(ul);
  contextMenu.hidden = false;
}
