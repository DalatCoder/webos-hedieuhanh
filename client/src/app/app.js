/* eslint-disable */
import PATH from 'path';
import fetchDirectory from './api/fetchDirectory';
import createNewDirectory from './api/createNewDirectory';
import createNewFile from './api/createNewFile';
import renameFile from './api/renameFile';
import renameDirectory from './api/renameDirectory';
import copyFile from './api/copyFile';
import copyDirectory from './api/copyDirectory';
import cutFile from './api/cutFile';
import cutDirectory from './api/cutDirectory';
import deleteFile from './api/deleteFile';
import deleteDirectory from './api/deleteDirectory';
import renderTreeView from './components/treeView';
import renderListView from './components/listView';
import renderNavigation from './components/navigation';
import renderEditFileModal from './components/editFileModal';
import renderContextMenu from './components/contextMenuModal';
import renderNewFolderModal from './components/newFolderModal';
import renderNewFileModal from './components/newFileModal';
import renderRenameModal from './components/renameModal';
import renderDeleteModal from './components/deleteModal';

//Nguyễn Thị Hà tóc mái ngố dễ thương :3

const state = {
  directories: [],
  navigationItems: [],
  currentPath: '',
  parentPath: '',
  elcontaine: null,
  user_copy_file: false,
  user_cut_file: false,
};

async function handleOnNavigationItemClick(item) {
  console.log(item);

  let url = '/';
  if (item.name !== 'Root') url = PATH.join(item.path, item.name);

  const response = await fetchDirectory(url);
  if (!response.data) return alert(`ERROR! ${response.message}`);
  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;

  renderListView(
    state.directories,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
  );

  // Only root in navigation list
  if (state.navigationItems.length === 1) return;

  const selectedItemIndex = state.navigationItems.findIndex(
    (d) => d.name === item.name && d.path === item.path,
  );
  if (selectedItemIndex > 0)
    state.navigationItems = state.navigationItems.slice(
      0,
      selectedItemIndex + 1,
    );
  else state.navigationItems = state.navigationItems.slice(0, 1);

  renderNavigation(
    state.navigationItems,
    handleOnBackDirectoryClick,
    handleOnNavigationItemClick,
  );
}

function handleOnItemClick(directory) {
  state.directories = state.directories.map((dir) => {
    const d = { ...dir };
    if (d.id === directory.id) d.selected = !d.selected;
    else d.selected = false;
    return d;
  });

  renderListView(
    state.directories,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
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
    state.navigationItems.push(item);

    renderNavigation(
      state.navigationItems,
      handleOnBackDirectoryClick,
      handleOnNavigationItemClick,
    );

    renderListView(
      state.directories,
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
    );
  }
}

async function handleOnBackDirectoryClick() {
  const response = await fetchDirectory(state.parentPath);
  if (!response.data) return alert(`ERROR! ${response.message}`);
  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;
  if (state.navigationItems.length > 1) state.navigationItems.pop();

  renderNavigation(
    state.navigationItems,
    handleOnBackDirectoryClick,
    handleOnNavigationItemClick,
  );

  renderListView(
    state.directories,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
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
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
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
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
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
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
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
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
    );
  });
}

function handleOnCopySelect(selectedItem) {
  state.elcontaine = selectedItem;
  state.user_copy_file = true;
}

function handleOnCutSelect(selectedItem) {
  state.elcontaine = selectedItem;
  state.user_cut_file = true;
}

async function handleOnPasteSelect(currentPath) {
  const { path: src, name, isFile } = state.elcontaine;
  const dest = currentPath;

  let response;
  if (state.user_copy_file) {
    if (isFile) {
      response = await copyFile(src, dest, name);
    } else response = await copyDirectory(src, dest, name);
  } else if (state.user_cut_file) {
    if (isFile) {
      response = await cutFile(src, dest, name);
    } else response = await cutDirectory(src, dest, name);
  }

  if (!response.data) return alert(`ERROR! ${response.message}`);

  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;

  renderListView(
    state.directories,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
  );

  state.elcontaine = null;
  state.user_copy_file = false;
  state.user_cut_file = false;
}

function handleOnContextMenuOpen() {
  const selectedItem = state.directories.find((d) => d.selected);

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
      handleOnItemClick,
      handleOnItemDoubleClick,
      handleOnContextMenuOpen,
    );

    // Set and render navigation items
    if (currentPath === '/') return;

    const parts = currentPath.split('/');
    const newNavigationItems = [
      {
        name: 'Root',
        path: '/',
      },
    ];

    newNavigationItems.push({
      name: parts[1],
      path: '/',
    });

    if (parts.length > 1) {
      for (let i = 2; i < parts.length; i++) {
        const navigationObject = {
          name: parts[i],
          path: parts.slice(0, i).join('/'),
        };
        newNavigationItems.push(navigationObject);
      }
    }

    state.navigationItems = newNavigationItems;

    renderNavigation(
      state.navigationItems,
      handleOnBackDirectoryClick,
      handleOnNavigationItemClick,
    );
  }
}

async function main() {
  const response = await fetchDirectory('/');

  if (!response.data) return alert(`ERROR! ${response.message}`);

  state.directories = response.data.items;
  state.currentPath = response.data.currentPath;
  state.parentPath = response.data.parentPath;
  state.navigationItems = [{ name: 'Root', path: '/' }];

  renderTreeView(state.directories, handleOnTreeViewItemClick);
  renderNavigation(
    state.navigationItems,
    handleOnBackDirectoryClick,
    handleOnNavigationItemClick,
  );
  renderListView(
    state.directories,
    handleOnItemClick,
    handleOnItemDoubleClick,
    handleOnContextMenuOpen,
  );

  return state;
}

main();

// Disable default context menu
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
