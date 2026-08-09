import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Download, Loader2 } from 'lucide-react';
import { InterviewReport } from '../../types/interview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  report: InterviewReport;
}

export const ReportDashboard = ({ report }: Props) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const radarData = [
    { subject: 'RAG', A: report.skillScores.rag },
    { subject: 'Agents', A: report.skillScores.agents },
    { subject: 'Prompting', A: report.skillScores.prompting },
    { subject: 'Sys Design', A: report.skillScores.systemDesign },
  ];

  const hiringColor = report.hiringDecision === 'Hire' ? 'text-emerald-400' : report.hiringDecision === 'Lean Hire' ? 'text-amber-400' : 'text-red-400';

  const handleExportPDF = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('synapse-interview-report.pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('PDF export failed. Check the browser console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={reportRef} className="min-h-screen p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Interview Report</h1>
        <p className="text-slate-400 mt-2">Synapse AI Evaluation Summary</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 flex justify-between items-center bg-gradient-to-r from-accent/5 to-accent-2/5">
          <div>
            <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Hiring Recommendation</h2>
            <p className={`text-4xl font-bold ${hiringColor}`}>{report.hiringDecision}</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Overall Score</h2>
            <p className="text-5xl font-bold text-white">{report.overallScore}<span className="text-2xl text-slate-500">%</span></p>
          </div>
        </Card>
        
        <Card className="flex flex-col justify-center">
          <button
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF Report
              </>
            )}
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-medium text-white mb-4">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-white mb-4">Strengths & Weaknesses</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase text-slate-500 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Strengths</h4>
              <ul className="space-y-1">
                {report.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase text-slate-500 mb-2 flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Weaknesses</h4>
              <ul className="space-y-1">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Improvement Plan
        </h3>
        <div className="space-y-3">
          {report.missedConcepts.map((concept, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{concept.topic}</p>
                <p className="text-xs text-slate-400 mt-1">{concept.remediation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};