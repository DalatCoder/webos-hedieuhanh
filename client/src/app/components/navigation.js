function createNavigationItem(item) {
  const { name } = item;

  const li = document.createElement('li');
  li.classList.add('navigation-item');
  li.innerText = name;

  return li;
}

export default function renderNavigation(
  items,
  onBackDirectoryClick,
  onNavigationItemClick,
) {
  const navigationElement = document.getElementById('navigation');

  const naviagtionListElement = document.createElement('ul');
  naviagtionListElement.classList.add('navigation-list');

  const backElement = document.createElement('li');
  backElement.innerHTML = '<i class="fas fa-arrow-circle-left"></i>';
  backElement.classList.add('navigation-item');
  backElement.addEventListener('click', () => {
    onBackDirectoryClick();
  });

  if (items.length > 1) naviagtionListElement.appendChild(backElement);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    const navigationItem = createNavigationItem(item);

    navigationItem.addEventListener('click', () => {
      onNavigationItemClick(item);
    });

    naviagtionListElement.appendChild(navigationItem);
  }

  navigationElement.innerHTML = '';
  navigationElement.appendChild(naviagtionListElement);
}
