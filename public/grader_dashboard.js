function fetchGenres(data) {
  let array = [];
  if (data.genre_action) {
    array.push("Action");
  }
  if (data.genre_mystery) {
    array.push("Mystery");
  }
  if (data.genre_historical) {
    array.push("Historical");
  }
  if (data.genre_horror) {
    array.push("Horror");
  }
  if (data.genre_drama) {
    array.push("Drama");
  }
  if (data.genre_comedy) {
    array.push("Comedy");
  }
  //genres array
  return array;
}

fetch("/getGraderDetails")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("greetings").textContent = "Hi " + data.name;
    let genre_array = fetchGenres(data);
    return fetch("getRecommendedScripts?genres=" + genre_array.join(","));
  })
  .then((response) => {
    let result = response.json();
    console.log("response: ", result);
    return result;
  })
  .then((scripts) => {
    const scriptList = document.getElementById("scriptList");
    console.log("scripts: ", scripts);
    scripts.forEach((script, index) => {
      // Display the script address
      //   const listItem = document.createElement("li");
      //   listItem.textContent = script.script_file_path;
      //   scriptList.appendChild(listItem);
      //   const iframe = document.createElement("iframe");
      //   iframe.src = script.script_file_path;
      //   console.log("path: ", script.script_file_path);
      //   iframe.width = "100%";
      //   iframe.height = "400px"; // Set appropriate height or make it dynamic based on content
      //   scriptList.appendChild(iframe);

      //   // Add a space between iframes
      //   scriptList.appendChild(document.createElement("br"));

      const card = document.createElement("div");
      card.className = "pdf-card";
      card.onclick = () => window.open(script.script_file_path, "_blank");

      const title = document.createElement("div");
      title.className = "pdf-card-title";
      title.textContent = script.script_title; // Assuming script has a name property
      card.appendChild(title);

      const author = document.createElement("div");
      author.className = "pdf-card-author";
      author.textContent =
        "Author: " + script.author + "\nCo-Author: " + script.co_writer; // Assuming script has an author property
      card.appendChild(author);

      const genre = document.createElement("div");
      genre.className = "pdf-card-genre";
      genre.textContent = "Genre: " + script.genre; // Assuming script has a genre property
      card.appendChild(genre);

      scriptList.appendChild(card);

      //Add rating field for the script in the form
      //   const ratingForm = document.getElementById("ratingForm");
      //   const label = document.createElement("label");
      //   label.textContent = "Rate script " + (index + 1) + ": ";
      //   const input = document.createElement("input");
      //   input.type = "number";
      //   input.min = "1";
      //   input.max = "5";
      //   input.name = "rating" + (index + 1);
      //   ratingForm.insertBefore(label, ratingForm.lastChild);
      //   ratingForm.insertBefore(input, ratingForm.lastChild);
      //   ratingForm.insertBefore(
      //     document.createElement("br"),
      //     ratingForm.lastChild
      //   );
      const scriptDropdown = document.getElementById("scriptDropdown");
      const option = document.createElement("option");
      option.value = script.script_id; // Assuming the script object has an id
      option.textContent = script.script_title;
      scriptDropdown.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching details:", error);
  });

document
  .getElementById("submitRating")
  .addEventListener("click", async function () {
    const selectedScript = document.getElementById("scriptDropdown").value;
    if (!selectedScript) {
      alert("Please select a script to rate!");
      return;
    }

    const storylineRating = document.getElementById("storylineRating").value;
    const characterDevelopmentRating = document.getElementById(
      "characterdevelopmentRating"
    ).value;
    const dialogueRating = document.getElementById("dialogueRating").value;
    const overallScoreRating =
      document.getElementById("overallscoreRating").value;

    console.log({
      script: selectedScript,
      ratings: {
        storyline: storylineRating,
        characterDevelopment: characterDevelopmentRating,
        dialogue: dialogueRating,
        overallScore: overallScoreRating,
      },
    });
    let averageRating =
      (Number(storylineRating) +
        Number(characterDevelopmentRating) +
        Number(dialogueRating) +
        Number(overallScoreRating)) /
      4;

    console.log(
      storylineRating,
      characterDevelopmentRating,
      dialogueRating,
      overallScoreRating,
      averageRating
    );
    let obj = {
      averageRating,
      script_id: selectedScript,
    };

    console.log("obj: ", obj);

    try {
      const response = await fetch("/submitRating", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("rating sent successfully!");
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Error submitting the form. Please try again.");
    }
  });
