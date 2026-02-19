git import { useState } from "react"
import SectionCard from "./SectionCard"
import FormField from "./FormField"
import { Loader } from "../loader"

// Sleek, modular Part A: Academic Involvement form
export default function PartAAcademicInvolvement() {
  const [manualScoring, setManualScoring] = useState(false)
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">Faculty Performance Evaluation</span>
        <button
          type="button"
          className={`ml-auto px-3 py-1 rounded text-sm font-medium border transition-colors duration-150 ${manualScoring ? "bg-yellow-200 text-yellow-900 border-yellow-400" : "bg-yellow-100 text-yellow-800 border-yellow-200"}`}
          onClick={() => setManualScoring((v) => !v)}
        >
          {manualScoring ? "Manual Score Entry Enabled" : "Enable Manual Score Entry"}
        </button>
      </div>

      <SectionCard title="Result Analysis" icon="📊" borderColor="border-blue-500">
        <div className="flex items-center justify-between">
          <span className="font-medium">Result Analysis Score:</span>
          <span className="text-lg font-bold text-blue-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="Course Outcome Analysis" icon="📈" borderColor="border-green-500">
        <div className="flex items-center justify-between">
          <span className="font-medium">Course Outcome Score:</span>
          <span className="text-lg font-bold text-green-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="E-learning Content Development" icon="💻" borderColor="border-purple-500">
        <div className="flex items-center justify-between">
          <span>Number of e-learning contents developed</span>
          <span className="text-lg font-bold">0</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">E-learning Score:</span>
          <span className="text-lg font-bold text-purple-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="Academic Engagement" icon="📖" borderColor="border-indigo-500">
        <div className="flex items-center justify-between">
          <span className="font-medium">Academic Engagement Score:</span>
          <span className="text-lg font-bold text-indigo-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="Teaching Load" icon="📚" borderColor="border-yellow-500">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Weekly Load Semester I</span>
            <span className="text-lg font-bold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Weekly Load Semester II</span>
            <span className="text-lg font-bold">0</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked readOnly className="h-5 w-5 text-blue-600 rounded" id="adminResponsibility" />
            <label htmlFor="adminResponsibility" className="text-sm font-medium text-gray-700">
              Are You Ph.D Supervisor Having Scholars Enrolled at PCCOE Research Center
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">Teaching Load Score:</span>
          <span className="text-lg font-bold text-yellow-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="UG Project / PG Dissertations Guided" icon="🎓" borderColor="border-green-500">
        <div className="flex items-center justify-between">
          <span>Number of projects guided</span>
          <span className="text-lg font-bold">0</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">Projects Score:</span>
          <span className="text-lg font-bold text-green-600">0.00 / 40</span>
        </div>
      </SectionCard>

      <SectionCard title="Feedback of Faculty by Student" icon="📊" borderColor="border-blue-500">
        <div className="flex items-center justify-between">
          <span className="font-medium">Feedback Score:</span>
          <span className="text-lg font-bold text-blue-600">0.00 / 100</span>
        </div>
      </SectionCard>

      <SectionCard title="Conduction of Guardian [PTG] Meetings" icon="📅" borderColor="border-purple-500">
        <div className="flex items-center justify-between">
          <span>Number of PTG meetings conducted</span>
          <span className="text-lg font-bold">0</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">PTG Meetings Score:</span>
          <span className="text-lg font-bold text-purple-600">0.00 / 50</span>
        </div>
      </SectionCard>

      <SectionCard title="Final Score Calculation" icon="🧮" borderColor="border-orange-500">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maximum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Raw Sum of All Sections</td>
                <td className="px-6 py-4 whitespace-nowrap">0.00</td>
                <td className="px-6 py-4 whitespace-nowrap">440</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Role Adjustment Factor (Professor)</td>
                <td className="px-6 py-4 whitespace-nowrap">0.68</td>
                <td className="px-6 py-4 whitespace-nowrap">-</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap font-bold">Final Adjusted Score</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">0</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">300</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end mt-8">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
          Save Teaching Performance Data
        </button>
      </div>
    </div>
  )
}
