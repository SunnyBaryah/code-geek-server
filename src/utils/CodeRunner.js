import axios from "axios";
function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getReponse(tokens, retries) {
  if (retries == 0) return [];
  await waitFor(2500);
  // console.log("Waited for 2.5 seconds");
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens,
      fields: "status",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": process.env.RAPID_API_HOST,
    },
  };
  const status = await axios.request(options);
  // console.log(status.data);
  const inQueue = status.data.submissions.filter(
    (submission) =>
      submission.status.description == "In Queue" ||
      submission.status.description == "Processing"
  );
  if (inQueue.length > 0) return getReponse(tokens, retries - 1);
  else return status.data.submissions;
}
export const CodeRunner = async (code, testCases, language_id) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": process.env.RAPID_API_HOST,
      "Content-Type": "application/json",
    },
    data: {
      submissions: testCases.map(({ input, expected_output }) => ({
        language_id,
        source_code: code,
        stdin: input,
        expected_output: expected_output,
      })),
    },
  };
  const response = await axios.request(options);
  // console.log(response.data);
  const tokens = response.data.map((submission) => submission.token).join(",");
  // console.log(tokens);
  const allStatuses = await getReponse(tokens, 10);
  return allStatuses;
};
