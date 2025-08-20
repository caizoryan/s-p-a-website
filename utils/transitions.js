import { $$ } from "../solid_monke/solid_monke.js";
const fade_in = (selector, r = 300, offset = 10) => {
  $$(selector).forEach((e) => {
    e.style.transition = `none`
    e.style.opacity = 0;
    e.style.transform = "translateY(100px)";
    (e.style.transition = `all ${r}ms`)
    setTimeout(
      () => ((e.style.opacity = 1), (e.style.transform = "translateY(0px)")),
      offset,
    );
  });
};
const fade_out = (selector, r = 300, offset = 10) => {
  $$(selector).forEach((e) => {
    e.style.transition = `none`
    e.style.opacity = 1;
		e.style.transform = "translateY(0px)"
    setTimeout(() => {
			e.style.transition = `all ${r}ms`
			e.style.opacity = 0;
			e.style.transform = "translateY(100px)"
		}, offset);
  });
};
const fade_out_stagger = (selector, r = 300, offset = 10, global_offset=10) => {
  $$(selector).forEach((e,i) => {
		let t = global_offset + (offset * (i+1))
    e.style.transition = `none`
    e.style.opacity = 1;
		e.style.transform = "translateY(0px)"
    setTimeout(() => {
			e.style.transition = `all ${r}ms`
			e.style.opacity = 0;
			e.style.transform = "translateY(100px)"
		}, t);
  });
};

const fade_in_stagger = (selector, r = 300, offset = 10, global_offset = 10) => {
  $$(selector).forEach((e, i) => {
		let t = global_offset + (offset * (i+1))
    e.style.transition = `all 0ms`
    e.style.opacity = 0;
    e.style.transform = "translateY(100px)";
    setTimeout(() => {
			console.log('running')
			e.style.transition = `all ${r}ms`
			e.style.opacity = 1;
			e.style.transform = "translateY(0px)"
		}, t,
    );
  });
};

const sweep_out = (selector, r = 300, offset = 10, cb = () => null) => {
  $$(selector).forEach((e) => {
    e.style.transition = `all 0ms`
    e.style.transition = `all ${r}ms`
    setTimeout(
      () => {e.style.height = '0vh' ; cb()},
      offset,
    );
  });
}

const sweep_down = (selector, r = 300, offset = 10, cb = () => null) => {
  $$(selector).forEach((e) => {
    e.style.transform = "translateY(0px)";
		e.style.transition = `all 0ms`
    setTimeout(
      () => {
				e.style.transition = `all ${r}ms`
				e.style.transform = "translateY(200px)";
			},
      offset,
    );
  });
}

export { fade_out_stagger,fade_out,fade_in, fade_in_stagger, sweep_out, sweep_down };
