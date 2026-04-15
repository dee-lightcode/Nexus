import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Trash2, Share2, 
  Eye, PenLine, CheckCircle, Clock, FileEdit
} from 'lucide-react';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: DocStatus;
}

const initialDocuments: Document[] = [
  { id: 1, name: 'Pitch Deck 2024.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2024-02-15', shared: true, status: 'Signed' },
  { id: 2, name: 'Financial Projections.xlsx', type: 'Spreadsheet', size: '1.8 MB', lastModified: '2024-02-10', shared: false, status: 'In Review' },
  { id: 3, name: 'Business Plan.docx', type: 'Document', size: '3.2 MB', lastModified: '2024-02-05', shared: true, status: 'Draft' },
  { id: 4, name: 'Market Research.pdf', type: 'PDF', size: '5.1 MB', lastModified: '2024-01-28', shared: false, status: 'In Review' },
  { id: 5, name: 'Investment Contract.pdf', type: 'PDF', size: '1.2 MB', lastModified: '2024-01-20', shared: true, status: 'Draft' },
];

const statusConfig = {
  'Draft':     { color: 'bg-gray-100 text-gray-700',   icon: <FileEdit size={12} /> },
  'In Review': { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
  'Signed':    { color: 'bg-green-100 text-green-700',  icon: <CheckCircle size={12} /> },
};

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
 const [, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | DocStatus>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter documents
  const filteredDocs = filterStatus === 'All'
    ? documents
    : documents.filter(d => d.status === filterStatus);

  // Handle file upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc: Document = {
      id: Date.now(),
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      lastModified: new Date().toISOString().split('T')[0],
      shared: false,
      status: 'Draft',
    };
    setDocuments([newDoc, ...documents]);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setDocuments(documents.filter(d => d.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
      setShowPreview(false);
    }
  };

  // Handle status change
  const handleStatusChange = (id: number, status: DocStatus) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, status } : d));
    if (selectedDoc?.id === id) setSelectedDoc({ ...selectedDoc, status });
  };

  // Handle signature submit
  const handleSignatureSubmit = () => {
    if (!signature.trim() || !selectedDoc) return;
    handleStatusChange(selectedDoc.id, 'Signed');
    setShowSignature(false);
    setSignature('');
    alert(`✅ Document "${selectedDoc.name}" has been signed successfully!`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Upload, review and sign your important documents</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Upload size={18} />
          Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xlsx"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {(['Draft', 'In Review', 'Signed'] as DocStatus[]).map(status => (
          <div
            key={status}
            onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}
            className={`bg-white rounded-xl p-4 shadow cursor-pointer border-2 transition ${
              filterStatus === status ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[status].color}`}>
                {statusConfig[status].icon}
                {status}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {documents.filter(d => d.status === status).length}
            </p>
            <p className="text-xs text-gray-500">documents</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Document List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              {filterStatus === 'All' ? 'All Documents' : filterStatus + ' Documents'}
            </h2>
            <div className="flex gap-2">
              {(['All', 'Draft', 'In Review', 'Signed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    filterStatus === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className={`flex items-center p-4 hover:bg-gray-50 transition cursor-pointer ${
                  selectedDoc?.id === doc.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => { setSelectedDoc(doc); setShowPreview(false); }}
              >
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FileText size={22} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[doc.status].color}`}>
                      {statusConfig[doc.status].icon}
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                    <span>Modified {doc.lastModified}</span>
                    {doc.shared && <span className="text-blue-500">Shared</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedDoc(doc); setShowPreview(true); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); }}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <FileText size={40} className="mx-auto mb-2 opacity-30" />
                <p>No documents found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">

          {/* Document Detail / Preview */}
          {selectedDoc ? (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Document Details</h3>

              {/* Preview area */}
              <div className="bg-gray-100 rounded-lg p-6 text-center mb-4">
                <FileText size={48} className="text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{selectedDoc.name}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedDoc.size} • {selectedDoc.type}</p>
              </div>

              {/* Status selector */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Status</p>
                <div className="flex gap-2">
                  {(['Draft', 'In Review', 'Signed'] as DocStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedDoc.id, s)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium transition ${
                        selectedDoc.status === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowSignature(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <PenLine size={16} />
                  Sign Document
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  <Download size={16} />
                  Download
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
              <FileText size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a document to view details</p>
            </div>
          )}

          {/* Storage info */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Storage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Used</span>
                <span className="font-medium">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available</span>
                <span className="font-medium">7.5 GB</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* E-Signature Modal */}
      {showSignature && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-1">Sign Document</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedDoc.name}</p>

            {/* Signature pad mockup */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-2">Type your signature below:</p>
              <input
                type="text"
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder="Your full name"
                className="w-full border-b-2 border-gray-400 pb-1 text-xl font-signature italic focus:outline-none focus:border-blue-500"
                style={{ fontFamily: 'cursive' }}
              />
              {signature && (
                <p className="mt-3 text-2xl text-blue-700 border-b border-blue-200 pb-1"
                  style={{ fontFamily: 'cursive' }}>
                  {signature}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-4">
              By signing, you agree that this is a legally binding signature.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSignatureSubmit}
                disabled={!signature.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Signature
              </button>
              <button
                onClick={() => { setShowSignature(false); setSignature(''); }}
                className="flex-1 border py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};