import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';
import { Calendar, ChevronRight, FileText } from 'lucide-react';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser) {
          const data = await base44.entities.SymptomReport.filter({ user_email: currentUser.email });
          setReports(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{getTranslation('loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{getTranslation('healthHistory')}</h1>
        <p className="text-slate-500 mt-1">{getTranslation('historyDesc')}</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Link to={`/result/${report.id}`} key={report.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{report.diagnosis}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {report.symptoms.map((s, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(report.created_date).toLocaleDateString()}
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            {getTranslation('noHistory')}
            <div className="mt-4">
              <Link to="/symptoms">
                <Button>{getTranslation('checkSymptoms')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
