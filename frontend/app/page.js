'use client';

import { useState } from 'react';
import CsvUploader from '../components/CsvUploader';
import CsvPreview from '../components/CsvPreview';
import ProgressBar from '../components/ProgressBar';
import ResultsTable from '../components/ResultsTable';
import { apiClient } from '../lib/api-client';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload');

  const handleFileSelected = (file) => {
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      setStep('preview');
    } else {
      setSelectedFile(null);
      setStep('upload');
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingProgress({ current: 0, total: 0 });
    setError(null);
    setStep('processing');

    try {
      const result = await apiClient.uploadCSV(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setResults(result);
      setStep('results');
    } catch (err) {
      setError(err.message || 'Failed to import CSV');
      setStep('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    setUploadProgress(0);
    setProcessingProgress({ current: 0, total: 0 });
    setStep('upload');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI CSV Importer</h1>
              <p className="text-sm text-muted-foreground">GrowEasy CRM - Intelligent Data Import</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'upload' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
              }`}>
                1
              </div>
              <span className="font-medium">Upload</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'preview' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
              }`}>
                2
              </div>
              <span className="font-medium">Preview</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${step === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'processing' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
              }`}>
                3
              </div>
              <span className="font-medium">Process</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${step === 'results' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'results' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
              }`}>
                4
              </div>
              <span className="font-medium">Results</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Import Your Leads</h2>
                <p className="text-muted-foreground">
                  Upload a CSV file from any source - Facebook Leads, Google Ads, Excel, or manual exports
                </p>
              </div>
              <CsvUploader onFileSelected={handleFileSelected} disabled={isProcessing} />
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && selectedFile && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Preview Data</h2>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Change File
                </button>
              </div>
              <CsvPreview file={selectedFile} />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Confirm Import
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Processing Your Data</h2>
                <p className="text-muted-foreground">
                  AI is analyzing and mapping your data to CRM fields
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                {uploadProgress < 100 ? (
                  <ProgressBar
                    current={uploadProgress}
                    total={100}
                    message="Uploading file..."
                  />
                ) : (
                  <ProgressBar
                    current={processingProgress.current}
                    total={processingProgress.total}
                    message="AI processing records..."
                  />
                )}
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Import Results</h2>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Import Another File
                </button>
              </div>
              <ResultsTable results={results} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>AI-Powered CSV Importer for GrowEasy CRM</p>
        </div>
      </footer>
    </main>
  );
}
