import axios from "axios";
export const translation = async (message: string  , language : string) => {
  console.log(message);
  const res = await axios.post(
    "https://google-translate113.p.rapidapi.com/api/v1/translator/html",
    {
      from: "en",
      to: language,
      html: message,
    },
    {
      headers: {
        "x-rapidapi-key": "323f7e31cdmsh2e553cbf0512be7p146aa8jsnca23d1f7d881",
        "x-rapidapi-host": "google-translate113.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }
  );
  return res.data
};
