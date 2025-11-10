"use client";
import { useEffect, useMemo, useState } from 'react';
import type { Quadrant, Task } from '@lib/types';
import { loadTasks, saveTasks } from '@lib/storage';

export default function Matrix() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  function addTask(t: Task) {
    setTasks(prev => [t, ...prev]);
  }

  function completeTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function quadrantTasks(q: Quadrant) { return tasks.filter(t => t.quadrant === q); }

  const quadrantColor = (q: Quadrant): string => {
    switch (q) {
      case 'Q1-Do': return '#f59e0b';
      case 'Q2-Schedule': return '#22c55e';
      case 'Q3-Delegate': return '#3b82f6';
      case 'Q4-Eliminate': return '#ef4444';
    }
  };

  return (
    <div className="app-grid">
      <div className="matrix-outer">
        <div className="matrix-rect">
          <div className="quadrant q1" aria-label="Important & Urgent">
            <h3>Q1: Do First</h3>
            {quadrantTasks('Q1-Do').map(t => (
              <div key={t.id} className="task" style={{ borderLeftColor: quadrantColor(t.quadrant) }}>
                <div>
                  <div className="text">{t.title}</div>
                  <div className="meta">Imp {t.importance} ? Urg {t.urgency} ? Eff {t.effort} ? Score {t.score}</div>
                </div>
                <button onClick={() => completeTask(t.id)}>Complete</button>
              </div>
            ))}
          </div>
          <div className="quadrant q2" aria-label="Important & Not Urgent">
            <h3>Q2: Schedule</h3>
            {quadrantTasks('Q2-Schedule').map(t => (
              <div key={t.id} className="task" style={{ borderLeftColor: quadrantColor(t.quadrant) }}>
                <div>
                  <div className="text">{t.title}</div>
                  <div className="meta">Imp {t.importance} ? Urg {t.urgency} ? Eff {t.effort} ? Score {t.score}</div>
                </div>
                <button onClick={() => completeTask(t.id)}>Complete</button>
              </div>
            ))}
          </div>
          <div className="quadrant q3" aria-label="Not Important & Urgent">
            <h3>Q3: Delegate</h3>
            {quadrantTasks('Q3-Delegate').map(t => (
              <div key={t.id} className="task" style={{ borderLeftColor: quadrantColor(t.quadrant) }}>
                <div>
                  <div className="text">{t.title}</div>
                  <div className="meta">Imp {t.importance} ? Urg {t.urgency} ? Eff {t.effort} ? Score {t.score}</div>
                </div>
                <button onClick={() => completeTask(t.id)}>Complete</button>
              </div>
            ))}
          </div>
          <div className="quadrant q4" aria-label="Not Important & Not Urgent">
            <h3>Q4: Eliminate</h3>
            {quadrantTasks('Q4-Eliminate').map(t => (
              <div key={t.id} className="task" style={{ borderLeftColor: quadrantColor(t.quadrant) }}>
                <div>
                  <div className="text">{t.title}</div>
                  <div className="meta">Imp {t.importance} ? Urg {t.urgency} ? Eff {t.effort} ? Score {t.score}</div>
                </div>
                <button onClick={() => completeTask(t.id)}>Complete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TaskSidePanel onAdd={addTask} />
    </div>
  );
}

function TaskSidePanel({ onAdd }: { onAdd: (t: Task) => void }) {
  const TaskForm = require('./TaskForm').default;
  return (
    <div>
      <TaskForm onAdd={onAdd} />
    </div>
  );
}
