'use client';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export type ClientSubject = {
  id: string;
  name: string;
  code: string;
  description: string;
  year: number | string | null;
  studentsCount: number;
  teachersCount: number;
  lessonsCount: number;
  marksCount: number;
  attendancesCount: number;
};

export default function SubjectList({
  data = [] as ClientSubject[],
  serverTotal: initialServerTotal,
}: {
  data?: ClientSubject[];
  serverTotal?: number | null;
}) {
  const [subjects] = useState<ClientSubject[]>(data);
  const [query, setQuery] = useState('');
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) =>
      `${s.name} ${s.code} ${s.description}`.toLowerCase().includes(q),
    );
  }, [subjects, query]);

  const { page, setPage, total, current } = usePagination(filtered, pageSize);

  function onDelete(s: ClientSubject) {
    alert(`Delete subject not implemented in this demo. (${s.name})`);
  }

  const atFirst = page <= 1;
  const atLast = page >= total;

  return (
    <div className="rounded-2xl dark:bg-[#1c1c1c] p-1 lg:p-4 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Subjects</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <input
            className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm bg-white dark:bg-[#000000] border-slate-200 dark:border-[#000000]"
            placeholder="Search subjects..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          {/* Add Subject button could go here if needed */}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-black/60 p-8 text-center text-slate-500 dark:text-slate-300">
          <div className="text-base font-medium mb-1">No subjects found</div>
          <div className="text-sm">
            Try a different search term{query ? ` for “${query}”` : ''}.
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-300/70">
                    <th className="py-3">Info</th>
                    <th className="py-3">Year</th>
                    <th className="py-3">Students</th>
                    <th className="py-3">Teachers</th>
                    <th className="py-3">Lessons</th>
                    {/* <th className="py-3">Marks</th> */}
                    <th className="py-3">Attendance</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {current.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 last:border-b-0 border-slate-100 dark:border-[#000000]"
                    >
                      <td className="p-1 lg:p-4">
                        <Link href={`/subjects/${s.id}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-500">
                              {getInitials(s.name || s.code)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span>{s.name}</span>
                                <span className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-black/60">
                                  {s.code}
                                </span>
                              </div>
                              {s.description && (
                                <div className="text-xs text-slate-500 dark:text-slate-300/60 line-clamp-1 max-w-[520px]">
                                  {s.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="py-4">{s.year ?? '-'}</td>
                      <td className="py-4">{s.studentsCount}</td>
                      <td className="py-4">{s.teachersCount}</td>
                      <td className="py-4">{s.lessonsCount}</td>
                      {/* <td className="py-4">{s.marksCount}</td> */}
                      <td className="py-4">{s.attendancesCount}</td>

                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/subjects/${s.id}`}
                            className="p-2 rounded-full bg-slate-100 dark:bg-[#000000]"
                            aria-label={`view ${s.name}`}
                          >
                            <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => onDelete(s)}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100"
                            aria-label={`delete ${s.name}`}
                          >
                            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M9 3v1H4v2h16V4h-5V3H9zM6 8v12a2 2 0 002 2h8a2 2 0 002-2V8H6z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-300">
                Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} –{' '}
                {Math.min(page * pageSize, filtered.length)} of {filtered.length}
                {typeof initialServerTotal === 'number' && (
                  <span className="ml-2 text-xs opacity-70">(server total: {initialServerTotal})</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={atFirst}
                  className="px-3 py-1 rounded-md border disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="px-3 py-1 text-sm">
                  {page} / {total}
                </div>
                <button
                  onClick={() => setPage(Math.min(total, page + 1))}
                  disabled={atLast}
                  className="px-3 py-1 rounded-md border disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {current.map((s) => (
              <div key={s.id} className="bg-slate-50 dark:bg-[#000000] rounded-lg p-3 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-[#000000] flex items-center justify-center text-slate-600">
                    {getInitials(s.name || s.code)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-black/60">
                        {s.code}
                      </span>
                    </div>
                    {s.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 max-w-[240px] mt-1">
                        {s.description}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">Year: {s.year ?? '-'}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-semibold">{s.studentsCount} students</div>
                  <div className="flex gap-2">
                    <Link
                      href={`/subjects/${s.id}`}
                      className="p-2 rounded-md bg-slate-100 dark:bg-[#000000]"
                      aria-label={`view ${s.name}`}
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-100" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => onDelete(s)}
                      className="p-2 rounded-md bg-red-50 hover:bg-red-100"
                      aria-label={`delete ${s.name}`}
                    >
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 3v1H4v2h16V4h-5V3H9zM6 8v12a2 2 0 002 2h8a2 2 0 002-2V8H6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* mobile pagination */}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={atFirst}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm">
                {page} / {total}
              </div>
              <button
                onClick={() => setPage(Math.min(total, page + 1))}
                disabled={atLast}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, Math.ceil(items.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
  return { page, setPage, total, current };
}

function getInitials(str: string) {
  const parts = str.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const letters = parts.length >= 2 ? [parts[0][0], parts[1][0]] : [parts[0][0]];
  return letters.join('').toUpperCase();
}
