function _bmodal_open_buttons() {
	let open_btns = document.querySelectorAll('.bmodal-open');
	for(let btn of open_btns) {
		let open_bmodal = () => {
			if (!btn.hasAttribute('bmodal')) return;
			let bm = document.querySelector(`#${btn.getAttribute('bmodal')}`);
			if (bm) bm.style.display = 'block';
		}
		if (typeof btn.onclick !== 'function') {
			btn.onclick = open_bmodal;
		} else {
			let prevClick = btn.onclick;
			btn.onclick = () => { prevClick(); open_bmodal(); };
		}
	}
}

function _bmodal_close_buttons() {
	let close_btns = document.querySelectorAll('.bmodal-close');
	for(let btn of close_btns) {
		btn.onclick = () => {
			((modals) => {
				for(let m of modals) {
					if (m.style.display !== 'none') m.style.display = 'none';
				}
			})(document.querySelectorAll('.bmodal'));
		}
	}
}

_bmodal_open_buttons();
_bmodal_close_buttons();