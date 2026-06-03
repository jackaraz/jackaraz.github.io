const { dest, src } = require("gulp");
const GetGoogleFonts = require("get-google-fonts");

const fonts = async () => {
  const instance = new GetGoogleFonts({
    outputDir: "./dist/fonts",
    cssFile: "./fonts.css",
  });

  try {
    return await instance.download(
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700"
    );
  } catch (error) {
    console.warn("Warning: Failed to download Google Fonts:", error.message);
    console.warn("Continuing build without font download...");
  }
};

module.exports = fonts;
