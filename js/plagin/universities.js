document.addEventListener('DOMContentLoaded', () => {
	const sliderEl = document.querySelector('.universities__slider');
	if (!sliderEl) return;
	let universitiesSlider;

	const wrapper = sliderEl.querySelector('.universities__wrapper');
	const slides = Array.from(wrapper.querySelectorAll('.universities__slide'));
	if (!wrapper || slides.length === 0) return;

	if (window.innerWidth <= 500) {

		let container = document.createElement('div');
		container.className = 'universities__items';
		wrapper.innerHTML = '';
		wrapper.appendChild(container);

		const allItems = slides.flatMap(slide =>
			Array.from(slide.querySelectorAll('.universities__item'))
		);

		let currentIndex = 0;

		function renderNext() {
			const start = currentIndex * 8;
			const end = (currentIndex + 1) * 8;
			const nextItems = allItems.slice(start, end);
			nextItems.forEach(item => container.appendChild(item.cloneNode(true)));
			currentIndex++;

			if (end >= allItems.length && btn) btn.remove();
		}

		renderNext(); 

		const btn = document.createElement('button');
		btn.className = 'universities__show-more';
		btn.innerHTML = `
			<svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.75 6.70768L15.4583 -0.000651475L17.5 2.04102L8.75 10.791L-4.76837e-07 2.04102L2.04167 -0.000651475L8.75 6.70768Z" fill="black"/>
			</svg>
		`;
		btn.style.cssText = `
			margin: 35px auto 0;
			width: 35px;
			height: 35px;
			display: block;
		`;
		wrapper.appendChild(btn);

		btn.addEventListener('click', renderNext);

	} else {

			const prevBtn = sliderEl.querySelector('.universities-button-prev');
			const nextBtn = sliderEl.querySelector('.universities-button-next');
			const scrollbarEl = sliderEl.querySelector('.swiper-scrollbar');

			universitiesSlider = new window.Swiper(sliderEl, {
			  observer: true,
			  observeParents: true,
			  slidesPerView: 1,
			  spaceBetween: 40,
				loop: false,
				slidesPerGroup: 1,
				 observer: false, 			
				 observeParents: false,		
				watchOverflow: true, 		
			  speed: 800,
			  scrollbar: { el: sliderEl.querySelector('.swiper-scrollbar') },
			  navigation: {
				prevEl: sliderEl.querySelector('.universities-button-prev'),
				nextEl: sliderEl.querySelector('.universities-button-next')
			  }
			});
	}
});
