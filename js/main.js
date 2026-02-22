document.addEventListener('DOMContentLoaded', function () {
	// Theme toggle setup
	const themeToggle = document.getElementById('theme-toggle');
	const stored = localStorage.getItem('site-theme');
	function setTheme(mode) {
		if (mode === 'dark') {
			document.body.classList.add('dark');
			if (themeToggle) { themeToggle.textContent = 'Dark'; themeToggle.setAttribute('aria-pressed', 'true'); }
		} else {
			document.body.classList.remove('dark');
			if (themeToggle) { themeToggle.textContent = 'Light'; themeToggle.setAttribute('aria-pressed', 'false'); }
		}
		localStorage.setItem('site-theme', mode);
	}
	// initialize theme
	if (stored === 'dark') setTheme('dark'); else setTheme('light');
	if (themeToggle) {
		themeToggle.addEventListener('click', function () {
			const isDark = document.body.classList.contains('dark');
			setTheme(isDark ? 'light' : 'dark');
		});
	}

	const gpaForm = document.getElementById('gpaform');
	const addBtn = document.getElementById('add-course-btn');
	const resultEl = document.getElementById('calc-result');

	const MAX_COURSES = 15;

	// count existing course inputs

	let courseCount = gpaForm.querySelectorAll('.course-inputt').length;

	// Helper to create a new course input
	function createCourseInput(index) {
		const wrap = document.createElement('div');
		wrap.className = 'form-group';

		const label = document.createElement('label');
		label.htmlFor = `course${index}`;
		label.textContent = `Course ${index} marks`;

		const inputname = document.createElement('input');
		inputname.type = 'text';
		inputname.id = `course${index}-name`;
		inputname.className = 'form-input course-input';


		inputname.placeholder = 'Enter course name';

		const input = document.createElement('input');
		input.type = 'number';
		input.id = `course${index}`;
		input.name = `course${index}`;


		input.className = 'form-input course-inputt';
		input.placeholder = 'Enter marks (0-100)';
		input.min = '0';
		input.max = '100';

		wrap.appendChild(label);


		wrap.appendChild(inputname);
		wrap.appendChild(input);
		return wrap;
	}

	// Convert a single mark (0–100) to GPA point on a 0–5 scale
	function markToGPA(mark) {
		if (mark >= 80) return 5;
		if (mark >= 70) return 4;
		if (mark >= 60) return 3;
		if (mark >= 50) return 2;
		if (mark >= 45) return 1;
		return 0;
	}

	// Classify based on GPA average
	function getClassification(gpa) {
		if (gpa >= 5)   return '🏆 First Class';
		if (gpa >= 4)   return '🥈 Second Class Upper';
		if (gpa >= 3)   return '🥉 Second Class Lower';
		if (gpa >= 2)   return '✅ Pass';
		return '❌ Fail';
	}



	// Calculate and display total, average, GPA and classification
	function calculateAndDisplay() {
		const inputs = gpaForm.querySelectorAll('.course-input');
		let total = 0;


		let gpaSum = 0;
		let count = 0;



		inputs.forEach(input => {
			const raw = (input.value || '').toString().trim();
			if (raw === '') {
				input.classList.remove('input-error');
				return; // skip empty fields
			}
			const num = parseFloat(raw);
			if (!Number.isFinite(num)) {
				input.classList.add('input-error');
				return;
			}
			// clamp to min/max if provided
			const min = Number(input.min || 0);
			const max = Number(input.max || 100);
			let clamped = Math.max(min, Math.min(max, num));
			if (clamped !== num) input.value = clamped;
			input.classList.remove('input-error');
			total += clamped;


			gpaSum += markToGPA(clamped);
			count += 1;
		});



		const average = count > 0 ? total / count : 0;
		const gpa = count > 0 ? gpaSum / count : 0;
		const classification = count > 0 ? getClassification(gpa) : '—';

		resultEl.innerHTML =
			`<strong>Total Marks:</strong> ${total} &nbsp;|&nbsp; ` +
			`<strong>Average:</strong> ${average.toFixed(2)}% &nbsp;|&nbsp; ` +
			`<strong>GPA:</strong> ${gpa.toFixed(2)} / 5.00 &nbsp;|&nbsp; ` +
			`<strong>Classification:</strong> ${classification} ` +


			`<br><small>${count} course(s) considered</small>`;
	}

	// Initial live calculation
	calculateAndDisplay();

	// Event delegation: recalc on any input change within the form
	gpaForm.addEventListener('input', function (e) {
		if (e.target && e.target.matches('.course-input')) {
			calculateAndDisplay();
		}
	});

	// Add-course button behavior (adds new input and recalculates)
	addBtn.addEventListener('click', function () {
		const current = gpaForm.querySelectorAll('.course-input').length;
		if (current >= MAX_COURSES) return;
		const newIndex = current + 1;
		const newInputWrap = createCourseInput(newIndex);
		const actions = gpaForm.querySelector('.form-actions');
		gpaForm.insertBefore(newInputWrap, actions);
		// focus the new input
		const newInput = newInputWrap.querySelector('.course-input');
		if (newInput) newInput.focus();
		calculateAndDisplay();
	});

	// On submit just recalc and prevent default (calculator-style)
	gpaForm.addEventListener('submit', function (e) {
		e.preventDefault();
		calculateAndDisplay();
	});
});

document.getElementById("year").innerText=new Date().getFullYear();

