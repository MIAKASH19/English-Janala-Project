//

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
        <p class="text-xl font-medium text-gray-400">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>
    
    `;
    return;
  }

  console.log("clicked", words);
  for (const word of words) {
    const Card = document.createElement("div");
    Card.classList.add(
      "bg-white",
      "w-[100%]",
      "p-10",
      "px-16",
      "rounded-xl",
      "space-y-5"
    );
    Card.innerHTML = `
          <h2 class="font-bold text-4xl">${word.word}</h2>
          <p class="text-sm">Meaning / Pronounciation</p>
          <h1 class="text-2xl font-semibold">${word.meaning}</h1>
          <div class="flex items-center justify-between">
            <div
              class="bg-sky-100 p-3 flex items-center justify-center rounded-lg cursor-pointer"
            >
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div
              class="bg-sky-100 p-3 flex items-center justify-center rounded-lg cursor-pointer"
            >
              <i class="fa-solid fa-volume-high"></i>
            </div>
          </div>`;
    wordContainer.append(Card);
  }
}

loadAllLessons();
