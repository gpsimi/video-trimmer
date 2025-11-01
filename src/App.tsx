import { Scissors } from 'lucide-react';
import { ClipForm } from './components/ClipForm';
import { Toaster } from './components/ui/toast';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, removeToast, success, error } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Clip Range
            </h1>
            <p className="text-slate-600">
              Download video or audio clips from YouTube with precise time ranges
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <ClipForm onSuccess={success} onError={error} />
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>For personal use only. Please respect copyright and terms of service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
