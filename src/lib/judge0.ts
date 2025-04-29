// --- START OF FILE DSA-main/src/lib/judge0.ts ---
import axios from 'axios';

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL;

if (!JUDGE0_API_URL) {
  console.warn(
    'Judge0 API URL is not configured. Code execution will not work. ' +
    'Set VITE_JUDGE0_API_URL in your .env file.'
  );
}

// See https://github.com/judge0/judge0/blob/master/docs/api/submissions/create.md#parameters
// Map friendly language names to Judge0 language IDs
const LANGUAGE_MAP: { [key: string]: number } = {
  javascript: 93, // Node.js
  python: 71, // Python 3.8
  // Add more languages as needed
  // java: 62,
  // cpp: 54, // C++ (GCC 9.2.0)
};

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string; // Optional: for running against specific test cases
  cpu_time_limit?: number; // Optional: seconds
  memory_limit?: number; // Optional: kilobytes
}

interface Judge0Result {
    token: string; // Submission token
}

interface Judge0ExecutionDetails {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    time: string | null; // Execution time in seconds
    memory: number | null; // Memory usage in kilobytes
    status: {
        id: number;
        description: string; // e.g., "Accepted", "Wrong Answer", "Time Limit Exceeded"
    };
}

/**
 * Submits code to Judge0 for execution.
 * Returns a promise that resolves with the submission token.
 */
async function createSubmission(
    language: string,
    sourceCode: string,
    stdin?: string
): Promise<Judge0Result> {
  if (!JUDGE0_API_URL) throw new Error('Judge0 API URL not configured.');

  const languageId = LANGUAGE_MAP[language.toLowerCase()];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const submissionData: Judge0Submission = {
    language_id: languageId,
    source_code: sourceCode,
    stdin: stdin || '',
  };

  try {
    const response = await axios.post<Judge0Result>(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      submissionData,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add API Key headers for RapidAPI:
          'X-RapidAPI-Key': 'f82a93464emshd803090ba8f4556p195063jsnac353dce9995',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating Judge0 submission:', error);
    throw new Error('Failed to create code submission.');
  }
}

/**
 * Fetches the result of a Judge0 submission using its token.
 * Polls until the submission is processed.
 */
async function getSubmissionResult(token: string): Promise<Judge0ExecutionDetails> {
    if (!JUDGE0_API_URL) throw new Error('Judge0 API URL not configured.');

    let attempt = 0;
    const maxAttempts = 10;
    const delayMs = 1000; // 1 second polling interval

    while (attempt < maxAttempts) {
        try {
            const response = await axios.get<Judge0ExecutionDetails>(
                `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=*`,
                {
                    headers: {
                         'X-RapidAPI-Key': 'f82a93464emshd803090ba8f4556p195063jsnac353dce9995',
                         'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                }
            );

            // Status ID 1 (In Queue) or 2 (Processing) means wait
            if (response.data.status.id <= 2) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
                attempt++;
            } else {
                // Finished processing (Accepted, Error, etc.)
                return response.data;
            }
        } catch (error) {
            console.error(`Error fetching Judge0 result (attempt ${attempt + 1}):`, error);
            // Optional: Implement retry logic for network errors
            throw new Error('Failed to fetch submission result.');
        }
    }

    throw new Error('Submission timed out waiting for result.');
}


/**
 * Executes code using Judge0 API.
 * Creates a submission, waits for the result, and returns the execution details.
 */
export async function executeCode(
  language: string,
  sourceCode: string,
  stdin?: string
): Promise<Judge0ExecutionDetails> {
  try {
    const { token } = await createSubmission(language, sourceCode, stdin);
    const result = await getSubmissionResult(token);
    return result;
  } catch (error) {
    console.error('Code execution failed:', error);
    // Return a custom error structure if needed
    throw error;
  }
}

// --- END OF FILE DSA-main/src/lib/judge0.ts ---