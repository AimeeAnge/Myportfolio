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
	const MAX_COURSES = 12;

	// count existing course inputs
	let courseCount = gpaForm.querySelectorAll('.course-input').length;

	// Helper to create a new course input
	function createCourseInput(index) {
		const wrap = document.createElement('div');
		wrap.className = 'form-group';

		const label = document.createElement('label');
		label.htmlFor = `course${index}`;
		label.textContent = `Course ${index} marks`;

		const input = document.createElement('input');
		input.type = 'number';
		input.id = `course${index}`;
		input.name = `course${index}`;
		input.className = 'form-input course-input';
		input.placeholder = 'Enter marks (0-100)';
		input.min = '0';
		input.max = '100';

		wrap.appendChild(label);
		wrap.appendChild(input);
		return wrap;
	}

	// Calculate and display total and average based on filled inputs
	function calculateAndDisplay() {
		const inputs = gpaForm.querySelectorAll('.course-input');
		let total = 0;
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
			count += 1;
		});
        
		const average = count > 0 ? total / count : 0;
        let grade= 'hello';
        if (average>=80 && average<=100) {
            grade='Grade A';
        } else if (average>=70 && average<80) {
            grade='Grade B';            
        }
         else if (average>=60 && average<70) {
            grade='Grade c';            
        }
         else if (average>=50 && average<70) {
            grade='Grade';            
        }
         else if (average>=1 && average<50) {
            grade='Grade F';            
        } else {
            grade=" "
        } {
            
        }
		resultEl.innerHTML = `Total marks = ${total} - Classfication = ${grade} - Average = ${average.toFixed(2)}<small>${count} course(s) considered</small>`;
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

