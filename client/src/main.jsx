import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = import.meta.env.VITE_API_BASE_URL || '/api';
const genres = ['Classic Whodunit', 'Thriller', 'Heist', 'Campus Mystery', 'General Investigation'];

function SuspectDoodle({ suspect }) {
  const hash = [...suspect.name].reduce((value, char) => value + char.charCodeAt(0), 0);
  const skins = ['#d9aa83', '#efc8a1', '#b87e61', '#e0b690'];
  const hairs = ['#30251f', '#604735', '#282b29', '#8a6244', '#49323b'];
  const clothes = ['#75816a', '#7a8b91', '#ad8064', '#77718d', '#aa9c70'];
  const hairShapes = [
    'M39 51 C36 30 47 19 63 19 C81 19 88 31 83 52 L77 43 C67 47 54 43 46 52 Z',
    'M39 51 C35 34 43 19 59 18 C80 16 89 32 83 52 C78 43 72 42 68 33 C60 45 49 43 43 52 Z',
    'M39 52 C34 35 43 18 62 18 C82 18 89 34 83 52 C79 47 77 43 76 38 C67 45 53 46 44 53 Z',
  ];
  const role = suspect.role.toLowerCase();
  const glasses = /research|scientist|lab|professor|teacher|analyst/.test(role) || hash % 3 === 0;
  const hat = /security|guard|police|detective|captain/.test(role);
  const chef = /chef|cook/.test(role);
  const skin = skins[hash % skins.length];
  const hair = hairs[Math.floor(hash / 3) % hairs.length];
  const clothesColor = clothes[Math.floor(hash / 7) % clothes.length];
  const paper = ['#e8e0cf', '#e4e3d4', '#eadfda'][Math.floor(hash / 11) % 3];

  return <svg className="character-doodle" viewBox="0 0 120 112" role="img" aria-label={`Doodle portrait of ${suspect.name}, ${suspect.role}`}>
    <rect x="1" y="1" width="118" height="110" rx="5" fill={paper} />
    <path d="M20 111 C23 88 38 78 60 78 C83 78 98 90 101 111" fill={clothesColor} stroke="#34352e" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 77 L48 88 L60 98 L72 88 L72 77" fill={skin} stroke="#34352e" strokeWidth="2" />
    <path d="M39 47 C38 34 45 25 60 25 C76 25 83 36 81 52 L78 65 C74 75 68 80 60 80 C51 80 44 72 41 63 Z" fill={skin} stroke="#34352e" strokeWidth="2.5" strokeLinejoin="round" />
    <path d={hairShapes[hash % hairShapes.length]} fill={hair} stroke="#34352e" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M49 56 Q53 53 56 56 M65 56 Q69 53 72 56" fill="none" stroke="#34352e" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 57 L58 64 L62 65 M54 70 Q60 74 66 69" fill="none" stroke="#34352e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M41 51 C36 50 36 60 42 61 M79 51 C85 49 84 60 79 62" fill={skin} stroke="#34352e" strokeWidth="2" />
    {glasses && <g fill="none" stroke="#34352e" strokeWidth="2"><rect x="45" y="52" width="13" height="9" rx="3"/><rect x="63" y="52" width="13" height="9" rx="3"/><path d="M58 56 H63 M44 55 L40 54 M76 55 L80 54"/></g>}
    <path d="M48 84 L60 97 L72 84" fill="none" stroke="#34352e" strokeWidth="2" />
    <path d="M53 88 L60 96 L67 88" fill="none" stroke="#34352e" strokeWidth="1.8" />
    {hat && <g><path d="M42 33 C43 21 52 17 61 17 C71 17 78 23 79 33 Z" fill={clothesColor} stroke="#34352e" strokeWidth="2.5"/><path d="M37 34 Q60 29 84 35 Q61 42 37 37 Z" fill={clothesColor} stroke="#34352e" strokeWidth="2.5"/><circle cx="61" cy="27" r="3" fill={paper} stroke="#34352e" strokeWidth="1.5"/></g>}
    {chef && <g><path d="M47 25 C42 21 46 15 51 16 C52 8 64 8 67 16 C74 13 79 22 73 26 Z" fill={paper} stroke="#34352e" strokeWidth="2.2"/><path d="M49 25 H72 V30 H49 Z" fill={paper} stroke="#34352e" strokeWidth="2"/></g>}
    {!hat && !chef && <path d="M80 89 L87 87 L89 94 L82 96 Z" fill={paper} stroke="#34352e" strokeWidth="1.7"/>}
    <path d="M10 15 L16 13 M102 20 L108 22 M14 92 L18 90" stroke="#b8a98e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
}
function App() {
  const [scenario, setScenario] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [genre, setGenre] = useState('Classic Whodunit');
  const [caseData, setCaseData] = useState(null);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
    const raw = await response.text();
    let body = {};
    if (raw.trim()) {
      try { body = JSON.parse(raw); }
      catch { throw new Error(`The server returned an unreadable response (HTTP ${response.status}). Check the server terminal for its error.`); }
    }
    if (!response.ok) throw new Error(body.error?.message || `The server returned HTTP ${response.status}. Check the server terminal for details.`);
    if (!raw.trim()) throw new Error(`The server returned an empty response (HTTP ${response.status}). Check the server terminal for its error.`);
    return body.data;
  }

  async function createCase(event) {
    event.preventDefault();
    setBusy(true); setError(''); setResult(null); setCaseData(null);
    try {
      const data = await request('/cases', { method: 'POST', body: JSON.stringify({ scenario, difficulty, genre, caseLength: 'Standard' }) });
      setCaseData(data); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitAnswer() {
    if (!selected || !caseData) return;
    setBusy(true); setError('');
    try { setResult(await request(`/cases/${caseData.id}/answer`, { method: 'POST', body: JSON.stringify({ suspectId: selected }) })); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function startOver() { setCaseData(null); setResult(null); setSelected(''); setError(''); }

  return <main className="shell">
    <header className="topbar"><a className="brand" href="#top" onClick={startOver}><span className="brand-mark">?</span> CASE FILE SYSTEM</a><span className="status"><i /> FICTIONAL INVESTIGATION</span></header>
    {!caseData ? <section className="intro" id="top">
      <p className="eyebrow">AI MYSTERY ROOM <span> / YOUR NEXT CASE</span></p>
      <h1>Every clue leaves<br /><em>a trace.</em></h1>
      <p className="lede">Set the scene. We’ll build a case full of suspects, evidence, and one culprit for you to uncover.</p>
      <form className="case-form" onSubmit={createCase}>
        <label htmlFor="scenario">WHAT HAPPENED?</label>
        <textarea id="scenario" required minLength={12} maxLength={2000} value={scenario} onChange={e => setScenario(e.target.value)} placeholder="A priceless painting vanished from a locked gallery during a storm..." />
        <div className="form-row">
          <div><label htmlFor="genre">CASE TYPE</label><select id="genre" value={genre} onChange={e => setGenre(e.target.value)}>{genres.map(g => <option key={g}>{g}</option>)}</select></div>
          <div><label htmlFor="difficulty">DIFFICULTY</label><select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>{['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}</select></div>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? <><span className="spinner" /> Building your case…</> : <>Create investigation <span>?</span></>}</button>
        <p className="form-note">Your scenario is used to create a fictional mystery.</p>
      </form>
    </section> : <section className="investigation" id="top">
      <button className="back" onClick={startOver}>? New case</button>
      <p className="eyebrow">CASE FILE <span> / {caseData.genre} · {caseData.difficulty}</span></p>
      <h1 className="case-title">{caseData.title}</h1>
      <div className="briefing"><span className="section-tag">THE BRIEF</span><p>{caseData.summary}</p><p>{caseData.incident?.description} <span className="incident-meta">{caseData.incident?.location}{caseData.incident?.occurredAt ? ` · ${new Date(caseData.incident.occurredAt).toLocaleString()}` : ""}</span></p></div>
      <div className="section-heading"><div><span className="section-tag">PEOPLE OF INTEREST</span><h2>Who had a motive?</h2></div><span className="count">{caseData.suspects.length} SUSPECTS</span></div>
      <div className="suspects">{caseData.suspects.map((s, i) => <button key={s.id} className={`suspect ${selected === s.id ? 'chosen' : ''} ${result?.selectedSuspectId === s.id ? 'your-pick' : ''} ${result?.culpritId === s.id ? 'culprit' : ''}`} onClick={() => !result && setSelected(s.id)} disabled={!!result}>
        <span className="suspect-number">SUSPECT 0{i + 1}</span><SuspectDoodle suspect={s} /><strong>{s.name}</strong><span className="role">{s.role}</span><p>{s.profile}</p><small>{s.relationship}</small>{result?.culpritId === s.id && <span className="culprit-label">THE CULPRIT</span>}
      </button>)}</div>
      <div className="section-heading evidence-heading"><div><span className="section-tag">EVIDENCE LOG</span><h2>What the clues say</h2></div><span className="count">{caseData.evidence.length} ITEMS</span></div>
      <div className="evidence-list">{caseData.evidence.map((item, i) => <article className="evidence" key={item.id}><span className="evidence-index">0{i + 1}</span><div><span className="evidence-type">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><p className="evidence-content">{item.content?.text || item.content?.details || item.content?.messages?.map(m => `${m.sender}: ${m.text}`).join(' · ')}</p></div></article>)}</div>
      {caseData.timeline?.length > 0 && <><div className="section-heading"><div><span className="section-tag">CASE TIMELINE</span><h2>Sequence of events</h2></div></div><div className="timeline">{caseData.timeline.map((e, i) => <div className="timeline-event" key={e.id}><time>{e.timestamp}</time><p>{e.description}</p></div>)}</div></>}
      {!result ? <div className="accuse"><div><span className="section-tag">YOUR DEDUCTION</span><h2>Who did it?</h2><p>Select a suspect above, then lock in your answer.</p></div><button className="primary" disabled={!selected || busy} onClick={submitAnswer}>{busy ? 'Checking…' : 'Reveal the truth'} <span>?</span></button></div> : <section className="solution"><span className="section-tag">CASE CLOSED</span><h2>{result.correct ? 'Your deduction was right.' : 'The evidence tells another story.'}</h2><p className="solution-summary">{result.summary}</p><p>{result.reasoning}</p><h3>Decisive evidence</h3><ul>{(result.decisiveEvidence || []).map(item => <li key={item.id}><strong>{item.title}:</strong> {item.description}</li>)}</ul><h3>What about the others?</h3><ul>{result.suspectExplanations?.map(item => <li key={item.suspectId}><strong>{caseData.suspects.find(s => s.id === item.suspectId)?.name}:</strong> {item.explanation}</li>)}</ul><button className="secondary" onClick={startOver}>Start another investigation</button></section>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>}
    <footer><span>AI MYSTERY ROOM</span><span>FICTIONAL CASES · REAL DEDUCTION</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);




