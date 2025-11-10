"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { convertIrToMarkdown } from '@lib/ir';
import { chunkText, exportKcsJson, exportKcsJsonl } from '@lib/kcs';
import { IrBlueprint, KcsDocument } from '@lib/types';
import { loadIr, loadKcs, saveIr, saveKcs } from '@lib/storage';

export default function AIOrganizer() {
  const [irRaw, setIrRaw] = useState('');
  const [irMd, setIrMd] = useState('');
  const [kcsDocs, setKcsDocs] = useState<KcsDocument[]>([]);
  const [kcsInput, setKcsInput] = useState('');
  const [chunkSize, setChunkSize] = useState(1200);
  const [overlap, setOverlap] = useState(120);

  useEffect(() => {
    const savedIr = loadIr();
    if (savedIr) { setIrRaw(savedIr.raw); setIrMd(savedIr.markdown); }
    const savedKcs = loadKcs();
    setKcsDocs(savedKcs);
  }, []);

  function convertIr() {
    const md = convertIrToMarkdown(irRaw);
    setIrMd(md);
    const ir: IrBlueprint = { raw: irRaw, markdown: md, savedAt: new Date().toISOString() };
    saveIr(ir);
  }

  function addKcsFromText() {
    if (!kcsInput.trim()) return;
    const doc = chunkText(kcsInput, { chunkSize, overlap, source: 'manual' });
    const updated = [doc, ...kcsDocs];
    setKcsDocs(updated);
    saveKcs(updated);
    setKcsInput('');
  }

  function handleKcsUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const doc = chunkText(text, { chunkSize, overlap, source: file.name });
      const updated = [doc, ...kcsDocs];
      setKcsDocs(updated);
      saveKcs(updated);
    };
    reader.readAsText(file);
  }

  function handleIrUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setIrRaw(text);
      const md = convertIrToMarkdown(text);
      setIrMd(md);
      saveIr({ raw: text, markdown: md, savedAt: new Date().toISOString() });
    };
    reader.readAsText(file);
  }

  function download(filename: string, content: string, mime = 'text/plain') {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel">
      <div className="tabs" role="tablist">
        <button className="tab-btn active" role="tab" aria-selected>Blueprints</button>
      </div>

      <div className="section">
        <h2>Instructional Ruleset (IR)</h2>
        <div className="form-row full">
          <label className="label">Raw Text Input</label>
          <textarea className="textarea" rows={8} value={irRaw} onChange={e => setIrRaw(e.target.value)} placeholder="Paste persona/behavior rules..." />
        </div>
        <div className="actions" style={{ marginBottom: 8 }}>
          <button className="btn primary" onClick={convertIr}>Convert & Save as Markdown</button>
          <label className="btn secondary" htmlFor="ir-upload" style={{ cursor: 'pointer' }}>Upload IR (.txt)</label>
          <input id="ir-upload" type="file" accept=".txt,.md" style={{ display: 'none' }} onChange={e => e.target.files && e.target.files[0] && handleIrUpload(e.target.files[0])} />
          <button className="btn" onClick={() => download(`ir.md`, irMd, 'text/markdown')}>Export IR Markdown</button>
        </div>
        <div>
          <div className="label">Markdown (auto-converted)</div>
          <div className="codebox" aria-live="polite">{irMd || '?'}</div>
        </div>
      </div>

      <div className="section">
        <h2>Knowledge Compendium Synthesis (KCS)</h2>
        <div className="form-row">
          <div>
            <label className="label">Chunk Size</label>
            <input type="number" className="input" value={chunkSize} onChange={e => setChunkSize(parseInt(e.target.value || '0') || 1)} />
          </div>
          <div>
            <label className="label">Overlap</label>
            <input type="number" className="input" value={overlap} onChange={e => setOverlap(parseInt(e.target.value || '0') || 0)} />
          </div>
        </div>
        <div className="form-row full">
          <label className="label">KCS Text Input</label>
          <textarea className="textarea" rows={6} value={kcsInput} onChange={e => setKcsInput(e.target.value)} placeholder="Paste knowledge base text..." />
        </div>
        <div className="actions" style={{ marginBottom: 8 }}>
          <button className="btn primary" onClick={addKcsFromText}>Chunk & Save</button>
          <label className="btn secondary" htmlFor="kcs-upload" style={{ cursor: 'pointer' }}>Upload KCS File</label>
          <input id="kcs-upload" type="file" accept=".txt,.md,.json,.jsonl" style={{ display: 'none' }} onChange={e => e.target.files && e.target.files[0] && handleKcsUpload(e.target.files[0])} />
          <button className="btn" onClick={() => download('kcs.json', exportKcsJson(kcsDocs), 'application/json')}>Export JSON</button>
          <button className="btn" onClick={() => download('kcs.jsonl', exportKcsJsonl(kcsDocs), 'application/x-ndjson')}>Export JSONL</button>
        </div>
        <div>
          <div className="label">Saved KCS Documents</div>
          <div className="codebox" style={{ maxHeight: 200 }}>
            {kcsDocs.length === 0 ? '?' : (
              kcsDocs.map(doc => (
                <div key={doc.docId} style={{ marginBottom: 12 }}>
                  {/* display summarized metadata */}
                  <div>Doc: <strong>{doc.docId}</strong> ? Source: {doc.source} ? Chunks: {doc.chunks.length}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
