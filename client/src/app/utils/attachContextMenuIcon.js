export default function attachContextMenuIcon(menuItem) {
  switch (menuItem) {
    case 'new folder':
      return 'fas fa-folder-plus';

    case 'new file':
      return 'fas fa-file';

    case 'edit':
      return 'fas fa-edit';

    case 'rename':
      return 'fas fa-spell-check';

    case 'close':
      return 'fas fa-times';

    case 'delete':
      return 'fas fa-trash';

    case 'copy':
      return 'fas fa-copy';

    case 'cut':
      return 'fas fa-cut';

    case 'paste':
      return 'fas fa-paste';

    default:
      return '';
  }
}
