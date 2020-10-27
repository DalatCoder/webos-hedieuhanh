export default function attachItemName(extension) {
  switch (extension) {
    case '.doc':
    case '.docx':
      return 'Microsoft Word Document';

    case '.ppt':
    case '.pptx':
      return 'Microsoft PowerPoint Presentation';

    case '.xls':
    case '.xlsx':
      return 'Microsoft Excel Worksheet';

    case '.pdf':
      return 'Adobe Acrobat Document';

    case '.jpg':
      return 'JPG File';
    case '.jpeg':
      return 'JPEG File';
    case '.gif':
      return 'GIF File';
    case '.png':
      return 'PNG File';

    case '.mp4':
      return 'MP4 Video File';
    case '.wmv':
      return 'WMV Video File';

    case '.mp3':
      return 'MP3 File';

    case '.zip':
      return 'WinRAR ZIP archive';
    case '.rar':
      return 'WinRAR archive';

    case '.md':
      return 'Markdown Source File';
    case '.cpp':
      return 'C++ Source File';
    case '.c':
      return 'C Source File';
    case '.cs':
      return 'C# Source File';
    case '.json':
      return 'JSON Source File';
    case '.xml':
      return 'XML Document';
    case '.html':
      return 'Chrome HTML Document';
    case '.css':
      return 'Cascading Style Sheet Document';
    case '.js':
      return 'JavaScript File';
    case '.cmd':
      return 'Windows Command Script';
    case '.ps1':
      return 'Windows PowerShell Script';

    case '.txt':
      return 'Text Document';

    case '.sql':
      return 'Microsoft SQL Server Query File';
    case '.exe':
      return 'Application';

    default:
      return 'File';
  }
}
