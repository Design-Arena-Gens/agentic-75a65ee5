"use client";
import { useEffect, useMemo, useState } from 'react';
import type { Quadrant, Task, TaskInput } from '@lib/types';

function computeScore(input: TaskInput): number {
  const now = new Date();
  const due = input.dueDate ? new Date(input.dueDate) : undefined;
  const daysToDue = due ? Math.max(0, (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 30;
  const duePressure = 1 - Math.min(1, daysToDue / 30); // 0..1

  // Weighted scoring: importance heavy, then urgency, penalize effort, add due pressure
  const score = input.importance * 3 + input.urgency * 2 + duePressure * 2 - input.effort * 1.5;
  return Math.round(score * 10) / 10;
}

function autoQuadrant(importance: number, urgency: number): Quadrant {
  if (importance >= 4 && urgency >= 4) return 'Q1-Do';
  if (importance >= 4 && urgency < 4) return 'Q2-Schedule';
  if (importance < 4 && urgency >= 4) return 'Q3-Delegate';
  return 'Q4-Eliminate';
}

export default function TaskForm({ onAdd }: { onAdd: (task: Task) => void }) {
  const [title, setTitle] = useState('');
  const [importance, setImportance] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [effort, setEffort] = useState(2);
  const [dueDate, setDueDate] = useState<string>('');
  const [assignMode, setAssignMode] = useState<'Auto' | Quadrant>('Auto');

  const score = useMemo(() => computeScore({ title, importance, urgency, effort, dueDate, manualQuadrant: assignMode }), [title, importance, urgency, effort, dueDate, assignMode]);

  function submit() {
    if (!title.trim()) return;
    const quadrant = assignMode === 'Auto' ? autoQuadrant(importance, urgency) : assignMode;
    const t: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      importance,
      urgency,
      effort,
      dueDate: dueDate || undefined,
      manualQuadrant: assignMode,
      score,
      quadrant,
      createdAt: new Date().toISOString(),
    };
    onAdd(t);
    setTitle('');
  }

  return (
    <div className="panel">
      <div className="section">
        <h2>New Task</h2>
        <div className="form-row full">
          <label className="label" htmlFor="title">Task</label>
          <input id="title" className="input" placeholder="Describe the task" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-row">
          <div>
            <label className="label">Importance (1-5)</label>
            <input type="range" min={1} max={5} value={importance} onChange={e => setImportance(parseInt(e.target.value))} />
            <div className="badge">{importance}</div>
          </div>
          <div>
            <label className="label">Urgency (1-5)</label>
            <input type="range" min={1} max={5} value={urgency} onChange={e => setUrgency(parseInt(e.target.value))} />
            <div className="badge">{urgency}</div>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label className="label">Effort (1-5)</label>
            <input type="range" min={1} max={5} value={effort} onChange={e => setEffort(parseInt(e.target.value))} />
            <div className="badge">{effort}</div>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label className="label">Assign Mode</label>
            <select className="select" value={assignMode} onChange={e => setAssignMode(e.target.value as any)}>
              <option>Auto</option>
              <option>Q1-Do</option>
              <option>Q2-Schedule</option>
              <option>Q3-Delegate</option>
              <option>Q4-Eliminate</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }}>
            <div>
              <div className="label">Score (preview)</div>
              <div className="score" aria-live="polite">{score}</div>
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={submit}>Add to Matrix</button>
          <button className="btn secondary" onClick={() => { setTitle(''); }}>Clear</button>
        </div>
      </div>
      <div className="section">
        <h2>Scoring Details</h2>
        <div>
          <div className="badge">Score = 3?Importance + 2?Urgency + 2?DuePressure ? 1.5?Effort</div>
        </div>
      </div>
    </div>
  );
}
