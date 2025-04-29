/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  solution_template: string;
  test_cases: string;
}

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  async function fetchProblem() {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProblem(data);
      setCode(data.solution_template);
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!problem || !user) return;

    setSubmissionStatus('submitting');
    try {
      const { error } = await supabase.from('submissions').insert([
        {
          problem_id: problem.id,
          user_id: user.id,
          code,
          language,
          status: 'submitted',
        },
      ]);

      if (error) throw error;
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Error submitting solution:', error);
      setSubmissionStatus('error');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="text-center py-8">Problem not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">{problem.category}</span>
          <span
            className={
              problem.difficulty.toLowerCase() === 'easy'
                ? 'text-accent-green'
                : problem.difficulty.toLowerCase() === 'medium'
                ? 'text-accent-yellow'
                : 'text-accent-red'
            }
          >
            {problem.difficulty}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: problem.description }}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
              <button
                onClick={handleSubmit}
                disabled={submissionStatus === 'submitting' || !user}
                className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-foreground px-4 py-2 rounded-md disabled:opacity-50"
              >
                {submissionStatus === 'submitting' ? (
                  'Submitting...'
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>

          {!user && (
            <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg">
              Please log in to submit your solution.
            </div>
          )}

          {submissionStatus && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 ${
                submissionStatus === 'success'
                  ? 'bg-green-500/10 text-green-500'
                  : submissionStatus === 'error'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-gray-500/10 text-gray-500'
              }`}
            >
              {submissionStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : submissionStatus === 'error' ? (
                <XCircle className="w-5 h-5" />
              ) : null}
              <span>
                {submissionStatus === 'success'
                  ? 'Solution submitted successfully!'
                  : submissionStatus === 'error'
                  ? 'Error submitting solution'
                  : 'Submitting solution...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}