document.addEventListener("DOMContentLoaded", function () {
  // Get all the input elements
  const sliders = document.querySelectorAll(".slider");
  const percentages = document.querySelectorAll(".percentage");
  const audios = [
    document.getElementById("backgroundMusic"),
    document.getElementById("soundEffect"),
  ];

  // Function to handle slider input and percentage display
  function handleSliderInput(slider, percentage, audio) {
    slider.addEventListener("input", () => {
      const volume = parseFloat(slider.value) / 100;
      if (volume === 0) {
        audio.pause(); // Pause audio when volume is set to 0
      } else {
        audio.play(); // Resume audio when volume is non-zero
      }
      audio.volume = volume;

      // Update the corresponding percentage value
      percentage.textContent = `${slider.value}%`;

      // Store the slider value in localStorage
      localStorage.setItem(slider.id, slider.value);
    });
  }

  // Add event listeners for each slider
  sliders.forEach((slider, index) => {
    const audio = audios[index];
    const percentage = percentages[index];

    // Retrieve and set the stored slider value (if available) when the page loads
    const storedValue = localStorage.getItem(slider.id);
    if (storedValue) {
      slider.value = storedValue;
      const volume = parseFloat(storedValue) / 100;
      if (volume === 0) {
        audio.pause(); // Pause audio when volume is set to 0
      } else {
        audio.play(); // Resume audio when volume is non-zero
      }
      audio.volume = volume;
      percentage.textContent = `${slider.value}%`; // Update the percentage display
    } else {
      // Set the default value (50%) when no stored value is found
      percentage.textContent = "50%";
    }

    // Call the function to handle slider input and percentage display
    handleSliderInput(slider, percentage, audio);
  });
});
