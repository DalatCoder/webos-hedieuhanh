export default function attachFileIcon(extension) {
  switch (extension) {
    case '.doc':
    case '.docx':
      return 'fas fa-file-word';

    case '.ppt':
    case '.pptx':
      return 'fas fa-file-powerpoint';

    case '.xls':
    case '.xlsx':
      return 'fas fa-file-excel';

    case '.pdf':
      return 'fas fa-file-pdf';

    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.png':
      return 'fas fa-file-image';

    case '.mp4':
    case '.wmv':
      return 'fas fa-file-video';

    case '.mp3':
      return 'fas fa-file-audio';

    case '.zip':
    case '.rar':
      return 'fas fa-file-archive';

    case '.md':
    case '.cpp':
    case '.c':
    case '.cs':
    case '.json':
    case '.xml':
    case '.html':
    case '.css':
    case '.js':
    case '.cmd':
    case '.ps1':
      return 'fas fa-file-code';

    case '.txt':
      return 'fas fa-file-alt';

    default:
      return 'fas fa-file';
  }
}
