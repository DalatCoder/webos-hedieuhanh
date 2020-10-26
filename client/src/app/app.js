/* eslint-disable */
import PATH from 'path';
import fetchDirectory from './api/fetchDirectory';
import createNewDirectory from './api/createNewDirectory';
import createNewFile from './api/createNewFile';
import renameFile from './api/renameFile';
import renameDirectory from './api/renameDirectory';
import deleteFile from './api/deleteFile';
import deleteDirectory from './api/deleteDirectory';
import renderTreeView from './components/treeView';
import renderListView from './components/listView';
import renderEditFileModal from './components/editFileModal';
import renderContextMenu from './components/contextMenuModal';
import renderNewFolderModal from './components/newFolderModal';
import renderNewFileModal from './components/newFileModal';
import renderRenameModal from './components/renameModal';
import renderDeleteModal from './components/deleteModal';

const state = {
  directories: [],
  currentPath: '',
  parentPath: '',
  elcontaine: null,
};

function handleOnItemClick(directory) {
  state.directories = state.directories.map((dir) => {
    const d = { ...dir };
    if (d.id === directory.id) d.selected = !d.selected;
    else d.selected = false;
    return d;
  });

  renderListView(
    state.directories,
    state.parentPath,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
    handleOnBackClick,
  );
}

async function handleOnItemDoubleClick(item) {
  if (item.isFile) {
    if (item.attributes.editable) renderEditFileModal(item.path, item.name);
    else alert('File do not support to view or edit');
  } else {
    let url = PATH.join(item.path, item.name);

    const response = await fetchDirectory(url);
    if (!response.data) return alert(`ERROR! ${response.message}`);
    state.directories = response.data.items;
    state.currentPath = response.data.currentPath;
    state.parentPath = response.data.parentPath;

    renderListView(
      state.directories,
      state.parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  }
}

async function handleOnBackClick(parentPath) {
  const response = await fetchDirectory(parentPath);
  if (!response.data) return alert(`ERROR! ${response.message}`);
  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;

  renderListView(
    state.directories,
    state.parentPath,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
    handleOnBackClick,
  );
}

function handleOnNewFolderSelect() {
  renderNewFolderModal(async (newFolderName) => {
    const result = await createNewDirectory(state.currentPath, newFolderName);
    if (!result) return;

    if (!result.data) return alert(`ERROR: ${result.message}`);

    const { items, currentPath, parentPath } = result.data;
    state.directories = items;
    state.currentPath = currentPath;
    state.parentPath = parentPath;

    renderListView(
      state.directories,
      parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  });
}

function handleOnNewFileSelect() {
  renderNewFileModal(async (fileName, fileContent) => {
    const result = await createNewFile(
      state.currentPath,
      fileName,
      fileContent,
    );
    if (!result) return;
    if (!result.data) return alert(`ERROR: ${result.message}`);

    const { items, currentPath, parentPath } = result.data;
    state.directories = items;
    state.currentPath = currentPath;
    state.parentPath = parentPath;

    renderListView(
      state.directories,
      parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  });
}

function handleOnEditFileSelect(selectedItem) {
  const { name, path } = selectedItem;
  renderEditFileModal(path, name);
}

function handleOnRenameSelect(selectedItem) {
  const { path, name, isFile, isFolder } = selectedItem;

  renderRenameModal(selectedItem, async (newName) => {
    let result = null;
    if (isFile) result = await renameFile(path, name, newName);
    else if (isFolder) result = await renameDirectory(path, name, newName);

    if (!result) return;
    if (!result.data) return alert(`ERROR: ${result.message}`);

    const { items, currentPath, parentPath } = result.data;
    state.directories = items;
    state.currentPath = currentPath;
    state.parentPath = parentPath;

    renderListView(
      state.directories,
      parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  });
}

function handleOnDeleteSelect(selectedItem) {
  const { path, name, isFile, isFolder } = selectedItem;

  renderDeleteModal(selectedItem, async () => {
    let result = null;
    if (isFile) result = await deleteFile(path, name);
    else if (isFolder) result = await deleteDirectory(path, name);

    if (!result) return;
    if (!result.data) return alert(`ERROR: ${result.message}`);

    const { items, currentPath, parentPath } = result.data;
    state.directories = items;
    state.currentPath = currentPath;
    state.parentPath = parentPath;

    renderListView(
      state.directories,
      parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  });
}

function handleOnCopySelect(selectedItem) {
  state.elcontaine = selectedItem;
}

function handleOnCutSelect(selectedItem) {
  state.elcontaine = selectedItem;

  // 1. Lay item

  // 2. Xoa item

  // 3. Hien thi moi
}

async function handleOnPasteSelect(currentPath) {
  const doituong = state.elcontaine;
  const nguon = doituong.path;
  const ten = doituong.name;
  const dich = currentPath;

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    src: nguon,
    dest: dich,
    name: ten,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const res = await fetch(
    `http://localhost:4000/api/${doituong.isFile ? 'file' : 'directory'}/copy`,
    requestOptions,
  );
  const response = await res.json();

  if (!response.data) return alert(`ERROR! ${response.message}`);
  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;

  renderListView(
    state.directories,
    state.parentPath,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
    handleOnBackClick,
  );

  state.elcontaine = null;
}

function handleOnContextMenuOpen() {
  const selectedItem = state.directories.find((d) => d.selected);

  // console.log(state);

  renderContextMenu(
    state.currentPath,
    state.elcontaine,
    selectedItem,
    handleOnNewFolderSelect,
    handleOnNewFileSelect,
    handleOnEditFileSelect,
    handleOnRenameSelect,
    handleOnDeleteSelect,
    handleOnCopySelect,
    handleOnCutSelect,
    handleOnPasteSelect,
  );
}

function handleOnTreeViewItemClick(directories, currentPath, parentPath) {
  if (directories) {
    state.directories = directories;
    state.currentPath = currentPath;
    state.parentPath = parentPath;

    renderListView(
      state.directories,
      state.parentPath,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
      handleOnBackClick,
    );
  }
}

async function main() {
  const response = await fetchDirectory('/');

  if (!response.data) return alert(`ERROR! ${response.message}`);

  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;

  renderTreeView(state.directories, handleOnTreeViewItemClick);
  renderListView(
    state.directories,
    state.parentPath,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
    handleOnBackClick,
  );

  return state;
}

main();

// Disable default context menu
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
