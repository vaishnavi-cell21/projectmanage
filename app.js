document.addEventListener('DOMContentLoaded', () => {
	const sidebar = document.querySelector('#sidebar');
	const mobileMenu = document.querySelector('#mobileMenu');
	const searchInput = document.querySelector('#searchInput');
	const breadcrumbCurrent = document.querySelector('#breadcrumbCurrent');
	const notificationButton = document.querySelector('#notificationButton');
	const notificationPopover = document.querySelector('#notificationPopover');
	const modalBackdrop = document.querySelector('#modalBackdrop');
	const newProjectButton = document.querySelector('#newProjectButton');
	const modalClose = document.querySelector('#modalClose');
	const cancelModal = document.querySelector('#cancelModal');
	const createProject = document.querySelector('#createProject');
	const projectName = document.querySelector('#projectName');
	const taskRows = [...document.querySelectorAll('.task-row')];
	const filterButtons = [...document.querySelectorAll('.segmented button')];

	const setModalOpen = (isOpen) => {
		modalBackdrop.classList.toggle('open', isOpen);
		modalBackdrop.setAttribute('aria-hidden', String(!isOpen));
		if (isOpen) projectName.focus();
	};

	const setTaskFilter = (filter) => {
		filterButtons.forEach((button) => {
			button.classList.toggle('selected', button.textContent.trim() === filter);
		});
		taskRows.forEach((row) => {
			const isDone = row.querySelector('input').checked;
			row.hidden = filter === 'Open' ? isDone : filter === 'Done' ? !isDone : false;
		});
	};

	document.querySelectorAll('.nav-item[data-view]').forEach((item) => {
		item.addEventListener('click', () => {
			document.querySelectorAll('.nav-item[data-view]').forEach((navItem) => navItem.classList.remove('active'));
			item.classList.add('active');
			breadcrumbCurrent.textContent = item.dataset.view;
			sidebar.classList.remove('open');
		});
	});

	mobileMenu.addEventListener('click', () => sidebar.classList.toggle('open'));

	notificationButton.addEventListener('click', (event) => {
		event.stopPropagation();
		notificationPopover.classList.toggle('open');
	});

	document.addEventListener('click', (event) => {
		if (!notificationPopover.contains(event.target) && event.target !== notificationButton) {
			notificationPopover.classList.remove('open');
		}
		if (event.target === modalBackdrop) setModalOpen(false);
	});

	newProjectButton.addEventListener('click', () => setModalOpen(true));
	modalClose.addEventListener('click', () => setModalOpen(false));
	cancelModal.addEventListener('click', () => setModalOpen(false));

	createProject.addEventListener('click', () => {
		const name = projectName.value.trim();
		if (!name) {
			projectName.focus();
			projectName.classList.add('invalid');
			return;
		}

		const projectRow = document.querySelector('.project-row');
		const projectSymbol = projectRow.cloneNode(true);
		projectSymbol.querySelector('.project-symbol').textContent = name.charAt(0).toUpperCase();
		projectSymbol.querySelector('.project-info strong').textContent = name;
		projectSymbol.querySelector('.project-info span').textContent = 'New project · 1 member';
		projectSymbol.querySelector('.project-progress b').textContent = '0%';
		projectSymbol.querySelector('.project-progress i').style.width = '0%';
		projectSymbol.querySelector('.project-progress span').textContent = 'On track';
		document.querySelector('.health-list').prepend(projectSymbol);
		setModalOpen(false);
		projectName.value = '';
		projectName.classList.remove('invalid');
	});

	projectName.addEventListener('input', () => projectName.classList.remove('invalid'));

	taskRows.forEach((row) => {
		row.querySelector('input').addEventListener('change', () => {
			row.classList.toggle('completed', row.querySelector('input').checked);
			const selectedFilter = document.querySelector('.segmented .selected').textContent.trim();
			setTaskFilter(selectedFilter);
		});
	});

	filterButtons.forEach((button) => button.addEventListener('click', () => setTaskFilter(button.textContent.trim())));

	searchInput.addEventListener('input', () => {
		const query = searchInput.value.trim().toLowerCase();
		document.querySelectorAll('.project-row, .task-row, .activity-item').forEach((item) => {
			item.hidden = query !== '' && !item.textContent.toLowerCase().includes(query);
		});
	});

	document.addEventListener('keydown', (event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			searchInput.focus();
		}
		if (event.key === 'Escape') {
			notificationPopover.classList.remove('open');
			setModalOpen(false);
		}
	});
});
