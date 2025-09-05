const createElement = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class="btn mr-3 btn-outline btn-primary">${el}</span>`
  );
  return htmlElements.join(" ");
};

// Speaking Fucntion
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpiner = (status) => {
  if (status == true) {
    document.getElementById("spiner").classList.remove("hidden");
    document.getElementById("level-words-container").classList.add("hidden");
  } else {
    document.getElementById("spiner").classList.add("hidden");
    document.getElementById("level-words-container").classList.remove("hidden");
  }
};

function loadAllLessons() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayAllLessons(json.data));
}

function displayAllLessons(lessons) {
  const lessonsContainer = document.getElementById("lessons-container");

  for (const lesson of lessons) {
    const div = document.createElement("div");

    div.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn ">Lesson - ${lesson.level_no}</button>`;

    lessonsContainer.append(div);
  }
}

const loadLevelWord = (id) => {
  manageSpiner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  const lessonBtn = document.querySelectorAll(".lesson-btn");

  lessonBtn.forEach((Btn) => {
    Btn.classList.remove("active");
  });

  const ActiveBtn = document.getElementById(`lesson-btn-${id}`);
  ActiveBtn.classList.add("active");

  fetch(url)
    .then((res) => res.json())
    .then((json) => displaylevelWord(json.data));
};

function displaylevelWord(words) {
  const wordContainer = document.getElementById("level-words-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div
        class="text-center  col-span-full rounded-xl py-10 space-y-6 font-bangla"
      >
        <img class="mx-auto" src="./assets/alert-error.png"/>
        <p class="text-xl font-medium text-gray-400 font-bangla">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-4xl font-bangla">নেক্সট Lesson এ যান</h2>
      </div>
    
    `;
    manageSpiner(false);
    return;
  }

  for (const word of words) {
    const Card = document.createElement("div");
    Card.classList.add(
      "bg-white",
      "w-[100%]",
      "p-10",
      "px-8",
      "rounded-xl",
      "space-y-5"
    );
    Card.innerHTML = `
          <h2 class="font-bold text-4xl">${
            word.word ? word.word : "শব্দ পাওয়া যায়নি"
          }</h2>
          <p class="text-sm">Meaning / Pronounciation</p>
          <h1 class="text-xl font-semibold font-bangla">${
            word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
          } / ${
      word.pronunciation ? word.pronunciation : "Pronounciation পাওয়া  যায়নি"
    }</h1>
          <div class="flex items-center justify-between">
            <div
            onclick="loadWordDetail(${word.id})"
              class="bg-sky-100 p-3 flex items-center justify-center rounded-lg cursor-pointer"
            >
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div
            onclick="pronounceWord('${word.word}')"
              class="bg-sky-100 p-3 flex items-center justify-center rounded-lg cursor-pointer"
            >
              <i class="fa-solid fa-volume-high"></i>
            </div>
          </div>`;
    wordContainer.append(Card);
  }
  manageSpiner(false);
}

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailContainer = document.getElementById("detail-container");
  console.log(word);
  detailContainer.innerHTML = `
            <div>
              <h2 class="font-bold text-2xl">
                 ${
                   word.word
                 } (<i class="fa-solid fa-microphone-lines"></i> : <span class="font-bangla">${
    word.pronunciation
  }</span>)
              </h2>
            </div>
            <div>
              <h2 class="font-bold">Meaning</h2>
              <p class="font-bangla">${word.meaning}</p>
            </div>
            <div>
              <h2 class="font-bold">Example</h2>
              <p>${word.sentence}</p>
            </div>
            <div>
              <h2 class="font-semibold mb-4 font-bangla">সমার্থক শব্দ গুলো</h2>
              <div>${createElement(word.synonyms)}</div>
            </div>`;
  document.getElementById("word_modal").showModal();
};

// Search Functionality

document.getElementById("search-btn").addEventListener("click", function () {
  const input = document.getElementById("input-search");
  const searchValues = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filteredWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValues)
      );

      displaylevelWord(filteredWords);
    });
});

loadAllLessons();
