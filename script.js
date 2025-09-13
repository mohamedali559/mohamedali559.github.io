new FinisherHeader({
  count: 38,
  size: {
    min: 2,
    max: 9,
    pulse: 0,
  },
  speed: {
    x: {
      min: 0,
      max: 0.4,
    },
    y: {
      min: 0,
      max: 0.6,
    },
  },
  colors: {
    background: "#060036ff",
    particles: ["#fbfcca", "#d7f3fe", "#ffd0a7"],
  },
  blending: "overlay",
  opacity: {
    center: 1,
    edge: 0,
  },
  skew: 0,
  shapes: ["t", "c"],
});

class TypeWriter {
  constructor(element, options = {}) {
    this.element = element;
    this.words = JSON.parse(element.dataset.text);

    this.settings = {
      typingSpeed: options.typingSpeed || 120, // سرعة الكتابة
      deletingSpeed: options.deletingSpeed || 60, // سرعة المسح
      delayBeforeDelete: options.delayBeforeDelete || 1500, // تأخير قبل المسح
      // delayBeforeTypingNext: options.delayBeforeTypingNext || 0, // تأخير قبل كتابة الجملة التالية
      loop: options.loop !== undefined ? options.loop : true,
      cursor: options.cursor !== undefined ? options.cursor : true,
    };

    this.txt = "";
    this.wordIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false; // منع التنفيذ أثناء الانتظار
    this.lastTime = 0;

    if (this.settings.cursor) {
      this.addCursor();
    }

    this.type();
  }

  addCursor() {
    const cursor = document.createElement("span");
    cursor.classList.add("typewriter-cursor");
    cursor.textContent = "|";
    this.element.parentNode.insertBefore(cursor, this.element.nextSibling);

    const style = document.createElement("style");
    style.textContent = `
      .typewriter-cursor {
        display: inline-block;
        margin-left: 2px;
        animation: blink 0.7s infinite;
      }
      @keyframes blink {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  type(timestamp = 0) {
    const currentWord = this.words[this.wordIndex % this.words.length];
    const speed = this.isDeleting
      ? this.settings.deletingSpeed
      : this.settings.typingSpeed;

    if (timestamp - this.lastTime < speed) {
      requestAnimationFrame((t) => this.type(t));
      return;
    }
    this.lastTime = timestamp;

    if (!this.isDeleting) {
      // الكتابة
      this.txt = currentWord.substring(0, this.txt.length + 1);
      this.element.textContent = this.txt;

      // لو الجملة خلصت
      if (this.txt === currentWord && !this.isWaiting) {
        this.isWaiting = true;
        setTimeout(() => {
          this.isDeleting = true;
          this.isWaiting = false;
        }, this.settings.delayBeforeDelete);
      }
    } else {
      // المسح
      this.txt = currentWord.substring(0, this.txt.length - 1);
      this.element.textContent = this.txt;

      // لو تم مسح الجملة بالكامل
      if (this.txt === "B" || (this.txt === "F" && !this.isWaiting)) {
        this.isWaiting = true;
        setTimeout(() => {
          this.isDeleting = false;
          this.wordIndex++;
          if (!this.settings.loop && this.wordIndex >= this.words.length)
            return;
          this.isWaiting = false;
        }, this.settings.delayBeforeTypingNext);
      }
    }

    requestAnimationFrame((t) => this.type(t));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const element = document.querySelector(".typewriter");
  if (element) {
    new TypeWriter(element, {
      typingSpeed: 150,
      deletingSpeed: 60,
      delayBeforeDelete: 1000,
      delayBeforeTypingNext: 0,
      loop: true,
      cursor: false,
    });
  }
});
