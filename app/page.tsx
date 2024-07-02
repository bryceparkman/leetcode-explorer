"use client"
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUpRightFromSquare, faAngleLeft, faAngleDoubleLeft, faAngleRight, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { CodeSkeleton, DescSkeleton, SolutionSkeleton } from "./skeleton";
import Markdown from 'react-markdown'

interface Solution {
  problem_id: number;
  title: string;
  difficulty: string;
  content: string;
  slug: string;
  java: string;
  javascript: string;
  python: string;
  cplusplus: string;
  [key: string]: string | number;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<Solution[]>([]);
  const [generatedCode, setGeneratedCode] = useState("")
  const [selectedProblem, setSelectedProblem] = useState<Solution | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('java');
  const [offset, setOffset] = useState(0);
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [isCodeLoading, setCodeLoading] = useState(false);
  const numProblemsDisplayed = 10;

  async function getResults() {
    setSearchLoading(true);
    const res = await fetch(`/api/filter_solutions?q=${query}&offset=${offset}`, {
      method: 'GET'
    });
    const data = await res.json();
    setSearchResponse(data);
  }

  useEffect(() => {
    setSearchLoading(false);
  }, [searchResponse])

  useEffect(() => {
    setCodeLoading(false);
  }, [generatedCode])

  useEffect(() => {
    if (query.length > 0) {
      getResults();
    }
  }, [offset])

  useEffect(() => {
    async function generateSolution() {
      setCodeLoading(true);
      if (!selectedProblem) return
      const res = await fetch(`/api/generate_solution?pid=${selectedProblem.problem_id}`, {
        method: 'GET'
      });
      const data = await res.json();
      setGeneratedCode(data);
    }
    generateSolution()
  }, [selectedProblem])

  function trimCode(code: string) {
    const trimmedCode = code.split('\`\`\`')[1].trim();
    return trimmedCode.slice(trimmedCode.indexOf('\n') + 1);
  }

  function trimDescription(description: string) {
    return description.split('\`\`\`')[2].trim();
  }

  return (
    <main className="flex min-h-screen p-8">
      <div className="grid text-center grid-flow-rows grid-cols-10 gap-x-4 gap-y-4">
        <div className="row-span-2 col-span-2">
          <div style={{ color: "rgb(234, 35, 119)" }} className="text-left">
            <FontAwesomeIcon icon={faMapLocationDot} className="text-5xl mb-2 ml-16" />
            <div className="text-xl">
              LeetCode Explorer
            </div>
          </div>
          <div className="text-sm mt-3 text-left">
            An online tool to explore LeetCode problems and generate new solutions to them. <br /> <br /> Start by searching for a keyword or computer science concept below!
          </div>
          <div className="pt-5">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query !== "") getResults()
                }}
                className="group rounded-lg border border-transparent px-5 py-3 border-neutral-700 bg-neutral-900 w-full"
              />
              <div className="absolute right-0 top-0 mt-3 mr-4 text-xl">
                <button onClick={getResults}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
          <div className="py-4 text-sm">
            {(searchResponse.length > 0 || isSearchLoading) &&
              <div>
                {isSearchLoading ? <SolutionSkeleton count={numProblemsDisplayed} /> : <div>
                  {searchResponse.map((obj, index) => (
                    <div
                      key={index}
                      className={`text-left cursor-pointer pl-3 pr-1 py-2 hover:bg-gray-800 border border-neutral-700 grid grid-cols-5 grid-flow-col 
                              ${selectedProblem?.problem_id === obj.problem_id ? 'bg-gray-800' : ''} 
                              ${selectedProblem?.title === obj.title ? 'bg-gray-800' : ''} 
                              ${index === 0 ? 'rounded-t-lg' : ''} 
                              ${index === searchResponse.length - 1 ? 'rounded-b-lg' : ''}`}
                      onClick={() => setSelectedProblem(obj)}
                    >
                      <div className="col-span-3 content-center">{obj.title}</div>
                      <div className="text-right content-center pl-1">
                        <span className={`font-semibold ${obj.difficulty === 'Easy' ? 'text-green-500' : obj.difficulty === 'Medium' ? 'text-yellow-300' : 'text-red-500'}`}>
                          {obj.difficulty}
                        </span>
                      </div>
                      <div className="text-right content-center">
                        <a href={'https://leetcode.com/problems/' + obj.slug} className="align-middle rounded-lg hover:bg-gray-600 p-1" target="_blank" rel="noreferrer">
                          <FontAwesomeIcon icon={faUpRightFromSquare} className="text-sm" />
                        </a>
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="float-left my-1 py-1 ml-1">
                      Showing {offset + 1} - {offset + numProblemsDisplayed}
                    </div>
                    <button className="border rounded-lg w-7 my-2 inline-block float-right cursor-pointer hover:bg-gray-600"
                      onClick={() => {
                        setOffset(offset + numProblemsDisplayed);
                      }}>
                      <FontAwesomeIcon icon={faAngleRight} className="text-lg py-1" />
                    </button>
                    <button className={`border rounded-lg w-7 my-2 mx-1 inline-block float-right ${offset === 0 ? 'opacity-50' : 'cursor-pointer hover:bg-gray-600'}`}
                      onClick={() => {
                        setOffset(Math.max(0, offset - numProblemsDisplayed));
                      }}
                      disabled={offset === 0}>
                      <FontAwesomeIcon icon={faAngleLeft} className="text-lg py-1" />
                    </button>
                    <button className={`border rounded-lg w-7 my-2 inline-block float-right ${offset === 0 ? 'opacity-50' : 'cursor-pointer hover:bg-gray-600'}`}
                      onClick={() => {
                        setOffset(0);
                      }}
                      disabled={offset === 0}>
                      <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-lg py-1" />
                    </button>
                  </div>
                </div>
                }
              </div>
            }
          </div>
        </div>
        {selectedProblem ?
          <>
            <div className="col-span-4 h-fit">
              <div className="flex flex-col">
                <select
                  className="rounded-lg border border-transparent px-5 py-3 border-neutral-700 bg-neutral-900 mb-2"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cplusplus">C++</option>
                </select>
                <SyntaxHighlighter showLineNumbers={true} language={selectedOption === 'cplusplus' ? 'cpp' : selectedOption} style={twilight} customStyle={
                  { fontSize: '0.7rem', height: "60vh" }
                }>
                  {trimCode(selectedProblem[selectedOption] as string)}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col h-full">
                <select
                  className="rounded-lg border border-transparent px-5 py-3 border-neutral-700 bg-neutral-900 mb-2"
                  value="Haskell"
                >
                  <option value="haskell">Haskell</option>
                </select>
                {isCodeLoading ? <CodeSkeleton /> : <SyntaxHighlighter className="h-50" showLineNumbers={true} language={selectedOption === 'cplusplus' ? 'cpp' : selectedOption} style={twilight} customStyle={
                  { fontSize: '0.7rem', height: "60vh" }
                }>
                  {generatedCode && trimCode(generatedCode)}
                </SyntaxHighlighter>
                }
              </div>
            </div>
              <pre className="col-span-4 whitespace-pre-line text-left h-fit bg-neutral-950 text-white rounded p-2 border border-neutral-700">
                <Markdown>{selectedProblem.content}</Markdown>
              </pre>
            <div className="col-span-4 whitespace-pre-line text-left h-fit bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded p-0.5">
              <span className="flex w-full bg-neutral-950 text-white rounded p-2" style={{ fontFamily: "Consolas" }}>
                {isCodeLoading ? <DescSkeleton /> : trimDescription(generatedCode)}
              </span>
            </div>
          </>
        : <div className="col-span-8 whitespace-pre-line text-left h-fit bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded p-0.5">
        <span className="flex w-full bg-neutral-950 text-white rounded p-2" style={{ fontFamily: "Consolas" }}>
          Select a problem on the left and we will use OpenAI to generate a new solution and explanation in Haskell!
        </span>
      </div>}
      </div>

    </main>
  );
}

