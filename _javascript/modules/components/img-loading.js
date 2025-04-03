const ATTR_DATA_SRC = "data-src";
const ATTR_DATA_LQIP = "data-lqip";

const cover = {
  SHIMMER: "shimmer",
  BLUR: "blur"
};

function removeCover(clzss) {
  this.parentElement.classList.remove(clzss);
}

function handleImage() {
  if (!this.complete) return;

  if (this.hasAttribute(ATTR_DATA_LQIP)) {
    removeCover.call(this, cover.BLUR);
  } else {
    removeCover.call(this, cover.SHIMMER);
  }
}

function switchLQIP() {
  const src = this.getAttribute(ATTR_DATA_SRC);
  this.setAttribute("src", encodeURI(src));
  this.removeAttribute(ATTR_DATA_SRC);
}

export function loadImg() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.addEventListener("load", handleImage);

        if (img.hasAttribute(ATTR_DATA_LQIP)) {
          switchLQIP.call(img);
        }

        if (img.complete && img.getAttribute("loading") === "lazy") {
          removeCover.call(img, cover.SHIMMER);
        }

        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll("article img");
  if (images.length === 0) return;

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}
