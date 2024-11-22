import axios from "axios";
import { ApiError } from "./ApiError.js";
function waitFor(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getReponse(tokens, retries){
  try {
    if(retries==0)return [];
    await waitFor(2500);
    console.log("Waited for 2.5 seconds");
    const status=await axios.get(
      `${process.env.JUDGE_URL}/submissions/batch?base64_encoded=false`,
      {
        params:{
          tokens,
          base64_encoded:"false",
          fields:"status",
        }
      }
    );
    console.log(status.data);
    const inQueue=status.data.submissions.filter((submission)=>
      submission.status.description=="In Queue" || submission.status.description=="Processing"
    );
    if(inQueue.length>0)return getReponse(tokens,retries-1);
    else return status.data.submissions;
  } catch (error) {
    throw new ApiError(500, error.message||"Internal Server Error");
  }
}
export const CodeRunner=async (code, testCases, language_id)=>{
    
    try {
      const response = await axios.post(
          `${process.env.JUDGE_URL}/submissions/batch?base64_encoded=false`,
          {
            submissions: testCases.map(({input, expected_output}) => ({
              language_id,
              source_code: code,
              stdin:input,
              expected_output: expected_output,
            })),
          }
      );
      console.log(response.data);
      const tokens = response.data.map((submission) => submission.token).join(',');
      console.log(tokens);
      const allStatuses=await getReponse(tokens, 10);
      return allStatuses;
    } catch (error) {
      throw new ApiError(500, error.message||"Internal Server Error");
    }
}
      